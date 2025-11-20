const express = require('express');
const router = express.Router();
const { query, getClient } = require('../config/database');
const { 
  analyzeEmotions, 
  getEmotionPatterns, 
  getEmotionTrends,
  EMOTION_TYPES,
  INTENSITY_LEVELS 
} = require('../services/aiEmotionService');
const { authenticateToken, requireRole, auditLog } = require('../middleware/auth');

/**
 * @route POST /api/emotions/analyze
 * @desc Analyze text for emotions
 * @access Private
 */
router.post('/analyze', authenticateToken, auditLog('emotion_analysis', 'emotion_analyses'), async (req, res) => {
  try {
    const { text, context } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        error: 'Text input is required',
        code: 'MISSING_TEXT'
      });
    }

    if (text.length > 10000) {
      return res.status(400).json({
        error: 'Text input is too long (max 10,000 characters)',
        code: 'TEXT_TOO_LONG'
      });
    }

    // Analyze emotions
    const result = await analyzeEmotions(text, context, req.user.id);

    if (!result.success) {
      return res.status(500).json({
        error: 'Emotion analysis failed',
        code: 'ANALYSIS_FAILED',
        details: result.error
      });
    }

    res.json({
      message: 'Emotion analysis completed',
      analysis: result.analysis,
      model: result.model,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Emotion analysis endpoint error:', error);
    res.status(500).json({
      error: 'Internal server error',
      code: 'ANALYSIS_ERROR'
    });
  }
});

/**
 * @route POST /api/emotions/checkin
 * @desc Submit emotion check-in
 * @access Private
 */
router.post('/checkin', authenticateToken, auditLog('emotion_checkin', 'emotion_checkins'), async (req, res) => {
  try {
    const { primaryEmotion, secondaryEmotions, intensity, context, triggers, copingStrategies } = req.body;

    // Validate input
    if (!primaryEmotion || !intensity) {
      return res.status(400).json({
        error: 'Primary emotion and intensity are required',
        code: 'MISSING_REQUIRED_FIELDS'
      });
    }

    if (!Object.values(EMOTION_TYPES).includes(primaryEmotion)) {
      return res.status(400).json({
        error: 'Invalid primary emotion',
        code: 'INVALID_EMOTION',
        validEmotions: Object.values(EMOTION_TYPES)
      });
    }

    if (intensity < 1 || intensity > 10) {
      return res.status(400).json({
        error: 'Intensity must be between 1 and 10',
        code: 'INVALID_INTENSITY'
      });
    }

    // Analyze context if provided
    let aiAnalysis = null;
    if (context && context.trim().length > 0) {
      const analysisResult = await analyzeEmotions(context, 'emotion check-in', req.user.id);
      if (analysisResult.success) {
        aiAnalysis = analysisResult.analysis;
      }
    }

    // Store emotion check-in
    const client = await getClient();
    
    try {
      const result = await client.query(`
        INSERT INTO emotion_checkins (user_id, primary_emotion, secondary_emotions, intensity, context, triggers, coping_strategies, ai_analysis, ai_confidence)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
      `, [
        req.user.id,
        primaryEmotion,
        secondaryEmotions || [],
        intensity,
        context,
        triggers || [],
        copingStrategies || [],
        aiAnalysis ? JSON.stringify(aiAnalysis) : null,
        aiAnalysis ? aiAnalysis.confidence : null
      ]);

      res.status(201).json({
        message: 'Emotion check-in recorded successfully',
        checkin: result.rows[0],
        aiInsights: aiAnalysis
      });

    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Emotion check-in error:', error);
    res.status(500).json({
      error: 'Internal server error',
      code: 'CHECKIN_ERROR'
    });
  }
});

/**
 * @route GET /api/emotions/checkins
 * @desc Get user's emotion check-ins
 * @access Private
 */
router.get('/checkins', authenticateToken, async (req, res) => {
  try {
    const { limit = 50, offset = 0, days = 30 } = req.query;

    const result = await query(`
      SELECT 
        id,
        primary_emotion,
        secondary_emotions,
        intensity,
        context,
        triggers,
        coping_strategies,
        ai_analysis,
        ai_confidence,
        created_at
      FROM emotion_checkins
      WHERE user_id = $1 
        AND created_at >= CURRENT_DATE - INTERVAL '${parseInt(days)} days'
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3
    `, [req.user.id, parseInt(limit), parseInt(offset)]);

    // Get total count
    const countResult = await query(`
      SELECT COUNT(*) as total
      FROM emotion_checkins
      WHERE user_id = $1 
        AND created_at >= CURRENT_DATE - INTERVAL '${parseInt(days)} days'
    `, [req.user.id]);

    res.json({
      checkins: result.rows,
      pagination: {
        total: parseInt(countResult.rows[0].total),
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: parseInt(offset) + parseInt(limit) < parseInt(countResult.rows[0].total)
      },
      period: `${days} days`
    });

  } catch (error) {
    console.error('Get emotion check-ins error:', error);
    res.status(500).json({
      error: 'Internal server error',
      code: 'GET_CHECKINS_ERROR'
    });
  }
});

/**
 * @route GET /api/emotions/patterns
 * @desc Get emotion patterns for user
 * @access Private
 */
router.get('/patterns', authenticateToken, async (req, res) => {
  try {
    const { days = 30 } = req.query;

    const patterns = await getEmotionPatterns(req.user.id, parseInt(days));

    if (!patterns.success) {
      return res.status(500).json({
        error: 'Failed to get emotion patterns',
        code: 'PATTERNS_ERROR',
        details: patterns.error
      });
    }

    res.json({
      patterns: patterns.patterns,
      totalAnalyses: patterns.totalAnalyses,
      period: patterns.period,
      insights: generatePatternInsights(patterns.patterns)
    });

  } catch (error) {
    console.error('Get emotion patterns error:', error);
    res.status(500).json({
      error: 'Internal server error',
      code: 'PATTERNS_ERROR'
    });
  }
});

/**
 * @route GET /api/emotions/trends
 * @desc Get emotion trends over time
 * @access Private
 */
router.get('/trends', authenticateToken, async (req, res) => {
  try {
    const { days = 30 } = req.query;

    const trends = await getEmotionTrends(req.user.id, parseInt(days));

    if (!trends.success) {
      return res.status(500).json({
        error: 'Failed to get emotion trends',
        code: 'TRENDS_ERROR',
        details: trends.error
      });
    }

    res.json({
      trends: trends.trends,
      period: trends.period,
      insights: generateTrendInsights(trends.trends)
    });

  } catch (error) {
    console.error('Get emotion trends error:', error);
    res.status(500).json({
      error: 'Internal server error',
      code: 'TRENDS_ERROR'
    });
  }
});

/**
 * @route GET /api/emotions/summary
 * @desc Get emotion summary for user
 * @access Private
 */
router.get('/summary', authenticateToken, async (req, res) => {
  try {
    const { days = 30 } = req.query;

    // Get recent check-ins
    const checkinsResult = await query(`
      SELECT 
        primary_emotion,
        intensity,
        created_at
      FROM emotion_checkins
      WHERE user_id = $1 
        AND created_at >= CURRENT_DATE - INTERVAL '${parseInt(days)} days'
      ORDER BY created_at DESC
    `, [req.user.id]);

    // Get patterns
    const patterns = await getEmotionPatterns(req.user.id, parseInt(days));

    // Calculate summary statistics
    const checkins = checkinsResult.rows;
    const totalCheckins = checkins.length;
    
    if (totalCheckins === 0) {
      return res.json({
        summary: {
          totalCheckins: 0,
          period: `${days} days`,
          message: 'No emotion check-ins found for this period'
        }
      });
    }

    const avgIntensity = checkins.reduce((sum, c) => sum + c.intensity, 0) / totalCheckins;
    const mostCommonEmotion = patterns.success && patterns.patterns.length > 0 
      ? patterns.patterns[0] 
      : null;

    // Get recent trend (last 7 days vs previous 7 days)
    const recentCheckins = checkins.filter(c => 
      new Date(c.created_at) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    );
    const previousCheckins = checkins.filter(c => {
      const date = new Date(c.created_at);
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
      return date >= twoWeeksAgo && date < weekAgo;
    });

    const recentAvgIntensity = recentCheckins.length > 0 
      ? recentCheckins.reduce((sum, c) => sum + c.intensity, 0) / recentCheckins.length 
      : 0;
    const previousAvgIntensity = previousCheckins.length > 0 
      ? previousCheckins.reduce((sum, c) => sum + c.intensity, 0) / previousCheckins.length 
      : 0;

    const intensityTrend = recentAvgIntensity > previousAvgIntensity ? 'increasing' : 
                          recentAvgIntensity < previousAvgIntensity ? 'decreasing' : 'stable';

    res.json({
      summary: {
        totalCheckins,
        period: `${days} days`,
        avgIntensity: Math.round(avgIntensity * 10) / 10,
        mostCommonEmotion: mostCommonEmotion ? {
          emotion: mostCommonEmotion.emotion,
          frequency: mostCommonEmotion.frequency,
          percentage: Math.round((mostCommonEmotion.frequency / totalCheckins) * 100)
        } : null,
        intensityTrend,
        recentAvgIntensity: Math.round(recentAvgIntensity * 10) / 10,
        previousAvgIntensity: Math.round(previousAvgIntensity * 10) / 10,
        patterns: patterns.success ? patterns.patterns.slice(0, 5) : [],
        insights: generateSummaryInsights(checkins, patterns.patterns)
      }
    });

  } catch (error) {
    console.error('Get emotion summary error:', error);
    res.status(500).json({
      error: 'Internal server error',
      code: 'SUMMARY_ERROR'
    });
  }
});

/**
 * @route GET /api/emotions/insights
 * @desc Get AI-powered emotion insights
 * @access Private
 */
router.get('/insights', authenticateToken, async (req, res) => {
  try {
    const { days = 30 } = req.query;

    // Get recent check-ins with AI analysis
    const result = await query(`
      SELECT 
        primary_emotion,
        intensity,
        context,
        ai_analysis,
        ai_confidence,
        created_at
      FROM emotion_checkins
      WHERE user_id = $1 
        AND created_at >= CURRENT_DATE - INTERVAL '${parseInt(days)} days'
        AND ai_analysis IS NOT NULL
      ORDER BY created_at DESC
      LIMIT 20
    `, [req.user.id]);

    const insights = result.rows.map(row => ({
      date: row.created_at,
      emotion: row.primary_emotion,
      intensity: row.intensity,
      context: row.context,
      aiAnalysis: JSON.parse(row.ai_analysis),
      confidence: row.ai_confidence
    }));

    // Generate personalized insights
    const personalizedInsights = generatePersonalizedInsights(insights);

    res.json({
      insights: personalizedInsights,
      period: `${days} days`,
      totalInsights: insights.length
    });

  } catch (error) {
    console.error('Get emotion insights error:', error);
    res.status(500).json({
      error: 'Internal server error',
      code: 'INSIGHTS_ERROR'
    });
  }
});

/**
 * @route GET /api/emotions/types
 * @desc Get available emotion types
 * @access Public
 */
router.get('/types', (req, res) => {
  res.json({
    emotions: Object.values(EMOTION_TYPES),
    intensityLevels: Object.values(INTENSITY_LEVELS),
    descriptions: {
      joy: 'Feeling happy, content, and positive',
      sadness: 'Feeling down, melancholy, or blue',
      anger: 'Frustrated, irritated, or mad',
      fear: 'Worried, nervous, or scared',
      surprise: 'Unexpected or amazed',
      disgust: 'Revolted or repulsed',
      neutral: 'Balanced or indifferent',
      anxious: 'Worried, nervous, or stressed',
      calm: 'Peaceful, relaxed, and centered',
      excited: 'Enthusiastic and energized'
    }
  });
});

// Helper functions

/**
 * Generate insights from emotion patterns
 */
const generatePatternInsights = (patterns) => {
  if (!patterns || patterns.length === 0) {
    return ['No emotion patterns detected yet. Keep tracking your emotions to see insights!'];
  }

  const insights = [];
  const topEmotion = patterns[0];

  if (topEmotion.frequency > 5) {
    insights.push(`Your most common emotion is ${topEmotion.emotion}, appearing ${topEmotion.frequency} times.`);
  }

  if (patterns.length > 1) {
    const emotionVariety = patterns.length;
    insights.push(`You experience ${emotionVariety} different emotions regularly, showing good emotional diversity.`);
  }

  const highIntensityEmotions = patterns.filter(p => p.avgSentiment > 0.7);
  if (highIntensityEmotions.length > 0) {
    insights.push(`You have strong positive emotions including ${highIntensityEmotions.map(e => e.emotion).join(', ')}.`);
  }

  return insights;
};

/**
 * Generate insights from emotion trends
 */
const generateTrendInsights = (trends) => {
  const insights = [];
  const dates = Object.keys(trends).sort();
  
  if (dates.length < 2) {
    return ['Keep tracking your emotions to see trends over time!'];
  }

  const recentDates = dates.slice(-7);
  const recentEmotions = recentDates.flatMap(date => Object.keys(trends[date] || {}));
  const emotionCounts = recentEmotions.reduce((acc, emotion) => {
    acc[emotion] = (acc[emotion] || 0) + 1;
    return acc;
  }, {});

  const mostRecentEmotion = Object.keys(emotionCounts).reduce((a, b) => 
    emotionCounts[a] > emotionCounts[b] ? a : b
  );

  insights.push(`Your recent emotional pattern shows ${mostRecentEmotion} as the most frequent emotion.`);

  return insights;
};

/**
 * Generate summary insights
 */
const generateSummaryInsights = (checkins, patterns) => {
  const insights = [];
  
  if (checkins.length === 0) {
    return ['Start tracking your emotions to gain valuable insights!'];
  }

  const avgIntensity = checkins.reduce((sum, c) => sum + c.intensity, 0) / checkins.length;
  
  if (avgIntensity > 7) {
    insights.push('You tend to experience emotions with high intensity. Consider mindfulness techniques to help regulate strong emotions.');
  } else if (avgIntensity < 4) {
    insights.push('Your emotions tend to be more moderate in intensity. This suggests good emotional regulation.');
  }

  if (patterns && patterns.length > 0) {
    const positiveEmotions = patterns.filter(p => ['joy', 'calm', 'excited'].includes(p.emotion));
    const negativeEmotions = patterns.filter(p => ['sadness', 'anger', 'fear', 'anxious'].includes(p.emotion));
    
    if (positiveEmotions.length > negativeEmotions.length) {
      insights.push('You experience more positive emotions than negative ones, which is great for your emotional well-being!');
    }
  }

  return insights;
};

/**
 * Generate personalized insights
 */
const generatePersonalizedInsights = (insights) => {
  if (insights.length === 0) {
    return [];
  }

  const personalizedInsights = [];

  // Analyze triggers
  const allTriggers = insights.flatMap(i => i.aiAnalysis?.triggers || []);
  const triggerCounts = allTriggers.reduce((acc, trigger) => {
    acc[trigger] = (acc[trigger] || 0) + 1;
    return acc;
  }, {});

  const commonTriggers = Object.entries(triggerCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([trigger]) => trigger);

  if (commonTriggers.length > 0) {
    personalizedInsights.push({
      type: 'triggers',
      title: 'Common Emotional Triggers',
      description: `You frequently experience emotions triggered by: ${commonTriggers.join(', ')}`,
      recommendations: ['Identify these triggers early', 'Develop coping strategies for each trigger', 'Consider avoiding or managing these situations']
    });
  }

  // Analyze coping strategies
  const allStrategies = insights.flatMap(i => i.aiAnalysis?.copingStrategies || []);
  const strategyCounts = allStrategies.reduce((acc, strategy) => {
    acc[strategy] = (acc[strategy] || 0) + 1;
    return acc;
  }, {});

  const recommendedStrategies = Object.entries(strategyCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([strategy]) => strategy);

  if (recommendedStrategies.length > 0) {
    personalizedInsights.push({
      type: 'strategies',
      title: 'Recommended Coping Strategies',
      description: `Based on your emotional patterns, these strategies may be helpful: ${recommendedStrategies.join(', ')}`,
      recommendations: ['Practice these strategies regularly', 'Try combining multiple strategies', 'Track which strategies work best for you']
    });
  }

  return personalizedInsights;
};

module.exports = router;
