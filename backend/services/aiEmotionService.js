const axios = require('axios');
const { query, getClient } = require('../config/database');

// AI Service Configuration
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const HUGGINGFACE_API_URL = 'https://api-inference.huggingface.co/models';

/**
 * Emotion types supported by the system
 */
const EMOTION_TYPES = {
  JOY: 'joy',
  SADNESS: 'sadness',
  ANGER: 'anger',
  FEAR: 'fear',
  SURPRISE: 'surprise',
  DISGUST: 'disgust',
  NEUTRAL: 'neutral',
  ANXIOUS: 'anxious',
  CALM: 'calm',
  EXCITED: 'excited'
};

/**
 * Emotion intensity levels
 */
const INTENSITY_LEVELS = {
  VERY_LOW: 1,
  LOW: 2,
  MODERATE: 3,
  MEDIUM: 4,
  MEDIUM_HIGH: 5,
  HIGH: 6,
  VERY_HIGH: 7,
  INTENSE: 8,
  VERY_INTENSE: 9,
  EXTREME: 10
};

/**
 * Analyze text for emotions using OpenAI API
 * @param {string} text - Text to analyze
 * @param {string} context - Additional context (optional)
 * @returns {Object} Emotion analysis result
 */
const analyzeEmotionsWithOpenAI = async (text, context = '') => {
  try {
    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }

    const prompt = `Analyze the following text for emotional content and provide a detailed emotion analysis.

Text: "${text}"
Context: "${context}"

Please provide:
1. Primary emotion (one of: joy, sadness, anger, fear, surprise, disgust, neutral, anxious, calm, excited)
2. Secondary emotions (up to 3 additional emotions)
3. Intensity level (1-10 scale)
4. Confidence score (0.0-1.0)
5. Emotional triggers identified
6. Suggested coping strategies
7. Brief explanation of the analysis

Respond in JSON format:
{
  "primaryEmotion": "emotion",
  "secondaryEmotions": ["emotion1", "emotion2"],
  "intensity": number,
  "confidence": number,
  "triggers": ["trigger1", "trigger2"],
  "copingStrategies": ["strategy1", "strategy2"],
  "explanation": "brief explanation"
}`;

    const response = await axios.post(OPENAI_API_URL, {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an expert emotional intelligence analyst. Provide accurate, empathetic, and helpful emotion analysis.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 500,
      temperature: 0.3
    }, {
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const analysis = JSON.parse(response.data.choices[0].message.content);
    
    return {
      success: true,
      model: 'openai-gpt-3.5-turbo',
      analysis: {
        primaryEmotion: analysis.primaryEmotion,
        secondaryEmotions: analysis.secondaryEmotions || [],
        intensity: Math.max(1, Math.min(10, analysis.intensity || 5)),
        confidence: Math.max(0, Math.min(1, analysis.confidence || 0.8)),
        triggers: analysis.triggers || [],
        copingStrategies: analysis.copingStrategies || [],
        explanation: analysis.explanation || 'Emotion analysis completed'
      }
    };

  } catch (error) {
    console.error('OpenAI emotion analysis error:', error);
    return {
      success: false,
      error: error.message,
      fallback: true
    };
  }
};

/**
 * Analyze text for emotions using Hugging Face API
 * @param {string} text - Text to analyze
 * @returns {Object} Emotion analysis result
 */
const analyzeEmotionsWithHuggingFace = async (text) => {
  try {
    if (!HUGGINGFACE_API_KEY) {
      throw new Error('Hugging Face API key not configured');
    }

    // Use emotion classification model
    const response = await axios.post(`${HUGGINGFACE_API_URL}/j-hartmann/emotion-english-distilroberta-base`, {
      inputs: text
    }, {
      headers: {
        'Authorization': `Bearer ${HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const emotions = response.data[0];
    
    // Find the emotion with highest score
    const primaryEmotion = emotions.reduce((max, emotion) => 
      emotion.score > max.score ? emotion : max
    );

    // Get secondary emotions (top 3 excluding primary)
    const secondaryEmotions = emotions
      .filter(emotion => emotion.label !== primaryEmotion.label)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(emotion => emotion.label);

    // Map Hugging Face labels to our emotion types
    const emotionMapping = {
      'joy': 'joy',
      'sadness': 'sadness',
      'anger': 'anger',
      'fear': 'fear',
      'surprise': 'surprise',
      'disgust': 'disgust',
      'neutral': 'neutral'
    };

    const mappedPrimaryEmotion = emotionMapping[primaryEmotion.label] || 'neutral';
    const mappedSecondaryEmotions = secondaryEmotions.map(emotion => 
      emotionMapping[emotion] || emotion
    );

    // Calculate intensity based on confidence score
    const intensity = Math.round(primaryEmotion.score * 10);

    return {
      success: true,
      model: 'huggingface-emotion-distilroberta',
      analysis: {
        primaryEmotion: mappedPrimaryEmotion,
        secondaryEmotions: mappedSecondaryEmotions,
        intensity: Math.max(1, Math.min(10, intensity)),
        confidence: primaryEmotion.score,
        triggers: [],
        copingStrategies: generateCopingStrategies(mappedPrimaryEmotion),
        explanation: `Detected ${mappedPrimaryEmotion} with ${Math.round(primaryEmotion.score * 100)}% confidence`
      }
    };

  } catch (error) {
    console.error('Hugging Face emotion analysis error:', error);
    return {
      success: false,
      error: error.message,
      fallback: true
    };
  }
};

/**
 * Generate coping strategies based on emotion
 * @param {string} emotion - Primary emotion
 * @returns {Array} List of coping strategies
 */
const generateCopingStrategies = (emotion) => {
  const strategies = {
    joy: [
      'Share your positive feelings with others',
      'Practice gratitude journaling',
      'Engage in activities that maintain this mood'
    ],
    sadness: [
      'Allow yourself to feel and process emotions',
      'Reach out to supportive friends or family',
      'Engage in gentle physical activity',
      'Consider professional support if needed'
    ],
    anger: [
      'Take deep breaths and count to ten',
      'Remove yourself from the triggering situation',
      'Express feelings in a constructive way',
      'Practice relaxation techniques'
    ],
    fear: [
      'Identify specific fears and challenge them',
      'Practice grounding techniques',
      'Seek support from trusted individuals',
      'Focus on what you can control'
    ],
    surprise: [
      'Take time to process the unexpected event',
      'Ask questions to understand the situation',
      'Stay open to new possibilities',
      'Maintain flexibility in your response'
    ],
    disgust: [
      'Identify what specifically triggered this feeling',
      'Set appropriate boundaries',
      'Focus on what aligns with your values',
      'Practice self-compassion'
    ],
    anxious: [
      'Practice deep breathing exercises',
      'Use progressive muscle relaxation',
      'Challenge anxious thoughts with facts',
      'Maintain regular sleep and exercise routines'
    ],
    calm: [
      'Maintain this peaceful state through mindfulness',
      'Use this calm energy for productive activities',
      'Practice gratitude for this moment',
      'Share this calm energy with others'
    ],
    excited: [
      'Channel this energy into productive activities',
      'Share your excitement with others',
      'Use this momentum to pursue goals',
      'Practice mindfulness to stay grounded'
    ],
    neutral: [
      'Use this balanced state for reflection',
      'Engage in activities that bring meaning',
      'Practice mindfulness and awareness',
      'Consider what would bring more fulfillment'
    ]
  };

  return strategies[emotion] || strategies.neutral;
};

/**
 * Fallback emotion analysis using rule-based approach
 * @param {string} text - Text to analyze
 * @returns {Object} Emotion analysis result
 */
const fallbackEmotionAnalysis = (text) => {
  const emotionKeywords = {
    joy: ['happy', 'excited', 'joyful', 'pleased', 'delighted', 'cheerful', 'elated', 'thrilled'],
    sadness: ['sad', 'depressed', 'down', 'upset', 'disappointed', 'hurt', 'grief', 'melancholy'],
    anger: ['angry', 'mad', 'furious', 'irritated', 'annoyed', 'frustrated', 'rage', 'outraged'],
    fear: ['afraid', 'scared', 'worried', 'anxious', 'nervous', 'terrified', 'panic', 'concerned'],
    surprise: ['surprised', 'shocked', 'amazed', 'astonished', 'startled', 'bewildered'],
    disgust: ['disgusted', 'revolted', 'repulsed', 'sickened', 'appalled', 'nauseated'],
    anxious: ['anxious', 'worried', 'nervous', 'uneasy', 'restless', 'tense', 'stressed'],
    calm: ['calm', 'peaceful', 'relaxed', 'serene', 'tranquil', 'composed', 'centered'],
    excited: ['excited', 'thrilled', 'enthusiastic', 'eager', 'pumped', 'energized']
  };

  const textLower = text.toLowerCase();
  const emotionScores = {};

  // Calculate emotion scores based on keyword presence
  Object.keys(emotionKeywords).forEach(emotion => {
    emotionScores[emotion] = emotionKeywords[emotion].reduce((score, keyword) => {
      return score + (textLower.includes(keyword) ? 1 : 0);
    }, 0);
  });

  // Find primary emotion
  const primaryEmotion = Object.keys(emotionScores).reduce((max, emotion) => 
    emotionScores[emotion] > emotionScores[max] ? emotion : max
  );

  // If no emotions detected, default to neutral
  const finalPrimaryEmotion = emotionScores[primaryEmotion] > 0 ? primaryEmotion : 'neutral';

  // Get secondary emotions
  const secondaryEmotions = Object.keys(emotionScores)
    .filter(emotion => emotion !== finalPrimaryEmotion && emotionScores[emotion] > 0)
    .sort((a, b) => emotionScores[b] - emotionScores[a])
    .slice(0, 3);

  // Calculate intensity based on keyword density
  const totalKeywords = Object.values(emotionScores).reduce((sum, score) => sum + score, 0);
  const intensity = Math.min(10, Math.max(1, totalKeywords + 3));

  return {
    success: true,
    model: 'rule-based-fallback',
    analysis: {
      primaryEmotion: finalPrimaryEmotion,
      secondaryEmotions: secondaryEmotions,
      intensity: intensity,
      confidence: 0.6, // Lower confidence for fallback
      triggers: [],
      copingStrategies: generateCopingStrategies(finalPrimaryEmotion),
      explanation: 'Emotion analysis completed using rule-based approach'
    }
  };
};

/**
 * Main emotion analysis function
 * @param {string} text - Text to analyze
 * @param {string} context - Additional context
 * @param {string} userId - User ID for logging
 * @returns {Object} Emotion analysis result
 */
const analyzeEmotions = async (text, context = '', userId = null) => {
  try {
    if (!text || text.trim().length === 0) {
      throw new Error('Text input is required');
    }

    let result = null;

    // Try OpenAI first
    if (OPENAI_API_KEY) {
      result = await analyzeEmotionsWithOpenAI(text, context);
      if (result.success) {
        await logEmotionAnalysis(userId, text, result, 'openai');
        return result;
      }
    }

    // Try Hugging Face as fallback
    if (HUGGINGFACE_API_KEY) {
      result = await analyzeEmotionsWithHuggingFace(text);
      if (result.success) {
        await logEmotionAnalysis(userId, text, result, 'huggingface');
        return result;
      }
    }

    // Use rule-based fallback
    result = fallbackEmotionAnalysis(text);
    await logEmotionAnalysis(userId, text, result, 'fallback');
    
    return result;

  } catch (error) {
    console.error('Emotion analysis error:', error);
    return {
      success: false,
      error: error.message,
      analysis: null
    };
  }
};

/**
 * Log emotion analysis to database
 * @param {string} userId - User ID
 * @param {string} text - Analyzed text
 * @param {Object} result - Analysis result
 * @param {string} model - Model used
 */
const logEmotionAnalysis = async (userId, text, result, model) => {
  try {
    if (!userId || !result.success) return;

    const client = await getClient();
    
    try {
      await client.query(`
        INSERT INTO emotion_analyses (user_id, input_text, detected_emotions, confidence_scores, sentiment_score, analysis_metadata, model_id)
        VALUES ($1, $2, $3, $4, $5, $6, (SELECT id FROM ai_models WHERE name = 'Emotion Detection v1.0'))
      `, [
        userId,
        text,
        JSON.stringify({
          primary: result.analysis.primaryEmotion,
          secondary: result.analysis.secondaryEmotions
        }),
        JSON.stringify({
          primary: result.analysis.confidence,
          secondary: result.analysis.secondaryEmotions.map(() => result.analysis.confidence * 0.7)
        }),
        result.analysis.intensity / 10, // Convert to 0-1 scale
        JSON.stringify({
          model: result.model,
          triggers: result.analysis.triggers,
          copingStrategies: result.analysis.copingStrategies,
          explanation: result.analysis.explanation
        })
      ]);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error logging emotion analysis:', error);
  }
};

/**
 * Get emotion patterns for a user
 * @param {string} userId - User ID
 * @param {number} days - Number of days to analyze
 * @returns {Object} Emotion patterns
 */
const getEmotionPatterns = async (userId, days = 30) => {
  try {
    const result = await query(`
      SELECT 
        detected_emotions->>'primary' as primary_emotion,
        COUNT(*) as frequency,
        AVG(sentiment_score) as avg_sentiment,
        AVG(confidence_scores->>'primary')::float as avg_confidence
      FROM emotion_analyses
      WHERE user_id = $1 
        AND created_at >= CURRENT_DATE - INTERVAL '${days} days'
      GROUP BY detected_emotions->>'primary'
      ORDER BY frequency DESC
    `, [userId]);

    const patterns = result.rows.map(row => ({
      emotion: row.primary_emotion,
      frequency: parseInt(row.frequency),
      avgSentiment: parseFloat(row.avg_sentiment),
      avgConfidence: parseFloat(row.avg_confidence)
    }));

    return {
      success: true,
      patterns: patterns,
      totalAnalyses: patterns.reduce((sum, p) => sum + p.frequency, 0),
      period: `${days} days`
    };

  } catch (error) {
    console.error('Error getting emotion patterns:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Get emotion trends over time
 * @param {string} userId - User ID
 * @param {number} days - Number of days to analyze
 * @returns {Object} Emotion trends
 */
const getEmotionTrends = async (userId, days = 30) => {
  try {
    const result = await query(`
      SELECT 
        DATE(created_at) as date,
        detected_emotions->>'primary' as primary_emotion,
        AVG(sentiment_score) as avg_sentiment,
        COUNT(*) as count
      FROM emotion_analyses
      WHERE user_id = $1 
        AND created_at >= CURRENT_DATE - INTERVAL '${days} days'
      GROUP BY DATE(created_at), detected_emotions->>'primary'
      ORDER BY date ASC
    `, [userId]);

    const trends = {};
    result.rows.forEach(row => {
      if (!trends[row.date]) {
        trends[row.date] = {};
      }
      trends[row.date][row.primary_emotion] = {
        count: parseInt(row.count),
        avgSentiment: parseFloat(row.avg_sentiment)
      };
    });

    return {
      success: true,
      trends: trends,
      period: `${days} days`
    };

  } catch (error) {
    console.error('Error getting emotion trends:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

module.exports = {
  analyzeEmotions,
  getEmotionPatterns,
  getEmotionTrends,
  EMOTION_TYPES,
  INTENSITY_LEVELS,
  generateCopingStrategies
};
