# MR.CREAMS AI Emotion Detection System

## Overview

The MR.CREAMS AI Emotion Detection System provides comprehensive emotion analysis capabilities using multiple AI models and fallback mechanisms. The system analyzes text input to detect emotions, provide insights, and generate personalized recommendations for emotional well-being.

## Features

### Multi-Model AI Integration
- **OpenAI GPT-3.5 Turbo**: Primary emotion analysis with detailed insights
- **Hugging Face DistilRoBERTa**: Fallback emotion classification model
- **Rule-Based Fallback**: Keyword-based analysis when AI services are unavailable
- **Model Selection**: Automatic failover between different AI providers

### Emotion Detection
- **10 Emotion Types**: joy, sadness, anger, fear, surprise, disgust, neutral, anxious, calm, excited
- **Intensity Scoring**: 1-10 scale for emotional intensity
- **Confidence Scoring**: 0.0-1.0 confidence in analysis results
- **Secondary Emotions**: Detection of multiple emotions in text
- **Context Analysis**: Understanding of emotional triggers and situations

### Pattern Recognition
- **Emotion Patterns**: Analysis of recurring emotional states
- **Trend Analysis**: Tracking emotional changes over time
- **Trigger Identification**: Recognition of emotional triggers
- **Coping Strategy Recommendations**: Personalized suggestions based on patterns

### Data Storage & Analytics
- **Comprehensive Logging**: All analyses stored in database
- **User-Specific Patterns**: Individual emotion pattern tracking
- **Historical Analysis**: Long-term emotional trend analysis
- **Performance Metrics**: Model accuracy and confidence tracking

## API Endpoints

### Emotion Analysis (`/api/emotions`)

#### POST `/analyze`
Analyze text for emotions using AI models.

**Request Body:**
```json
{
  "text": "I'm feeling really anxious about the presentation tomorrow. I can't stop worrying about what could go wrong.",
  "context": "work stress"
}
```

**Response:**
```json
{
  "message": "Emotion analysis completed",
  "analysis": {
    "primaryEmotion": "anxious",
    "secondaryEmotions": ["fear", "neutral"],
    "intensity": 7,
    "confidence": 0.89,
    "triggers": ["presentation", "work stress", "worrying"],
    "copingStrategies": [
      "Practice deep breathing exercises",
      "Use progressive muscle relaxation",
      "Challenge anxious thoughts with facts",
      "Maintain regular sleep and exercise routines"
    ],
    "explanation": "Detected anxiety with high confidence. The text shows clear signs of work-related stress and anticipatory anxiety about a presentation."
  },
  "model": "openai-gpt-3.5-turbo",
  "timestamp": "2024-01-01T12:00:00Z"
}
```

#### POST `/checkin`
Submit emotion check-in with AI analysis.

**Request Body:**
```json
{
  "primaryEmotion": "anxious",
  "secondaryEmotions": ["fear", "sadness"],
  "intensity": 6,
  "context": "Feeling overwhelmed with work deadlines and personal issues",
  "triggers": ["work pressure", "family stress"],
  "copingStrategies": ["deep breathing", "talking to friends"]
}
```

**Response:**
```json
{
  "message": "Emotion check-in recorded successfully",
  "checkin": {
    "id": "uuid",
    "user_id": "uuid",
    "primary_emotion": "anxious",
    "secondary_emotions": ["fear", "sadness"],
    "intensity": 6,
    "context": "Feeling overwhelmed with work deadlines and personal issues",
    "triggers": ["work pressure", "family stress"],
    "coping_strategies": ["deep breathing", "talking to friends"],
    "ai_analysis": {...},
    "ai_confidence": 0.87,
    "created_at": "2024-01-01T12:00:00Z"
  },
  "aiInsights": {
    "primaryEmotion": "anxious",
    "secondaryEmotions": ["fear", "sadness"],
    "intensity": 6,
    "confidence": 0.87,
    "triggers": ["work pressure", "family stress"],
    "copingStrategies": [...],
    "explanation": "..."
  }
}
```

#### GET `/checkins`
Get user's emotion check-ins with pagination.

**Query Parameters:**
- `limit` (default: 50): Number of check-ins to return
- `offset` (default: 0): Number of check-ins to skip
- `days` (default: 30): Number of days to look back

**Response:**
```json
{
  "checkins": [
    {
      "id": "uuid",
      "primary_emotion": "anxious",
      "secondary_emotions": ["fear", "sadness"],
      "intensity": 6,
      "context": "Feeling overwhelmed...",
      "triggers": ["work pressure", "family stress"],
      "coping_strategies": ["deep breathing", "talking to friends"],
      "ai_analysis": {...},
      "ai_confidence": 0.87,
      "created_at": "2024-01-01T12:00:00Z"
    }
  ],
  "pagination": {
    "total": 25,
    "limit": 50,
    "offset": 0,
    "hasMore": false
  },
  "period": "30 days"
}
```

#### GET `/patterns`
Get emotion patterns for user.

**Query Parameters:**
- `days` (default: 30): Number of days to analyze

**Response:**
```json
{
  "patterns": [
    {
      "emotion": "anxious",
      "frequency": 8,
      "avgSentiment": 0.3,
      "avgConfidence": 0.85
    },
    {
      "emotion": "joy",
      "frequency": 5,
      "avgSentiment": 0.8,
      "avgConfidence": 0.92
    }
  ],
  "totalAnalyses": 25,
  "period": "30 days",
  "insights": [
    "Your most common emotion is anxious, appearing 8 times.",
    "You experience 5 different emotions regularly, showing good emotional diversity.",
    "You have strong positive emotions including joy."
  ]
}
```

#### GET `/trends`
Get emotion trends over time.

**Query Parameters:**
- `days` (default: 30): Number of days to analyze

**Response:**
```json
{
  "trends": {
    "2024-01-01": {
      "anxious": {
        "count": 2,
        "avgSentiment": 0.3
      },
      "joy": {
        "count": 1,
        "avgSentiment": 0.8
      }
    },
    "2024-01-02": {
      "calm": {
        "count": 1,
        "avgSentiment": 0.6
      }
    }
  },
  "period": "30 days",
  "insights": [
    "Your recent emotional pattern shows anxious as the most frequent emotion."
  ]
}
```

#### GET `/summary`
Get emotion summary for user.

**Query Parameters:**
- `days` (default: 30): Number of days to analyze

**Response:**
```json
{
  "summary": {
    "totalCheckins": 25,
    "period": "30 days",
    "avgIntensity": 5.2,
    "mostCommonEmotion": {
      "emotion": "anxious",
      "frequency": 8,
      "percentage": 32
    },
    "intensityTrend": "stable",
    "recentAvgIntensity": 5.1,
    "previousAvgIntensity": 5.3,
    "patterns": [
      {
        "emotion": "anxious",
        "frequency": 8,
        "avgSentiment": 0.3,
        "avgConfidence": 0.85
      }
    ],
    "insights": [
      "You tend to experience emotions with moderate intensity, suggesting good emotional regulation.",
      "You experience more positive emotions than negative ones, which is great for your emotional well-being!"
    ]
  }
}
```

#### GET `/insights`
Get AI-powered emotion insights.

**Query Parameters:**
- `days` (default: 30): Number of days to analyze

**Response:**
```json
{
  "insights": [
    {
      "type": "triggers",
      "title": "Common Emotional Triggers",
      "description": "You frequently experience emotions triggered by: work pressure, family stress, deadlines",
      "recommendations": [
        "Identify these triggers early",
        "Develop coping strategies for each trigger",
        "Consider avoiding or managing these situations"
      ]
    },
    {
      "type": "strategies",
      "title": "Recommended Coping Strategies",
      "description": "Based on your emotional patterns, these strategies may be helpful: deep breathing, talking to friends, exercise",
      "recommendations": [
        "Practice these strategies regularly",
        "Try combining multiple strategies",
        "Track which strategies work best for you"
      ]
    }
  ],
  "period": "30 days",
  "totalInsights": 15
}
```

#### GET `/types`
Get available emotion types and descriptions.

**Response:**
```json
{
  "emotions": ["joy", "sadness", "anger", "fear", "surprise", "disgust", "neutral", "anxious", "calm", "excited"],
  "intensityLevels": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  "descriptions": {
    "joy": "Feeling happy, content, and positive",
    "sadness": "Feeling down, melancholy, or blue",
    "anger": "Frustrated, irritated, or mad",
    "fear": "Worried, nervous, or scared",
    "surprise": "Unexpected or amazed",
    "disgust": "Revolted or repulsed",
    "neutral": "Balanced or indifferent",
    "anxious": "Worried, nervous, or stressed",
    "calm": "Peaceful, relaxed, and centered",
    "excited": "Enthusiastic and energized"
  }
}
```

## AI Models

### OpenAI GPT-3.5 Turbo
- **Primary Model**: Most accurate and detailed analysis
- **Features**: Context understanding, trigger identification, coping strategies
- **Confidence**: Typically 0.8-0.95
- **Use Case**: Detailed emotion analysis with insights

### Hugging Face DistilRoBERTa
- **Fallback Model**: Emotion classification when OpenAI unavailable
- **Features**: Fast emotion detection, confidence scoring
- **Confidence**: Typically 0.7-0.9
- **Use Case**: Basic emotion classification

### Rule-Based Fallback
- **Emergency Model**: Keyword-based analysis
- **Features**: Basic emotion detection, pattern matching
- **Confidence**: Fixed at 0.6
- **Use Case**: When AI services are unavailable

## Emotion Types

| Emotion | Description | Common Triggers | Coping Strategies |
|---------|-------------|-----------------|-------------------|
| **Joy** | Happy, content, positive | Success, connection, achievement | Share feelings, practice gratitude |
| **Sadness** | Down, melancholy, blue | Loss, disappointment, isolation | Allow feelings, seek support |
| **Anger** | Frustrated, irritated, mad | Injustice, frustration, conflict | Deep breathing, express constructively |
| **Fear** | Worried, nervous, scared | Uncertainty, threat, change | Identify fears, grounding techniques |
| **Surprise** | Unexpected, amazed | Unexpected events, new information | Process information, stay open |
| **Disgust** | Revolted, repulsed | Unpleasant situations, violations | Set boundaries, focus on values |
| **Neutral** | Balanced, indifferent | Routine, calm periods | Use for reflection, mindfulness |
| **Anxious** | Worried, nervous, stressed | Pressure, uncertainty, deadlines | Breathing exercises, challenge thoughts |
| **Calm** | Peaceful, relaxed, centered | Relaxation, stability, peace | Maintain state, practice mindfulness |
| **Excited** | Enthusiastic, energized | Anticipation, opportunities, goals | Channel energy, share excitement |

## Configuration

### Environment Variables
```env
# AI Service Configuration
OPENAI_API_KEY=your-openai-api-key
HUGGINGFACE_API_KEY=your-huggingface-api-key

# Database Configuration
DB_USER=postgres
DB_HOST=localhost
DB_NAME=mr_creams_db
DB_PASSWORD=your-password
DB_PORT=5432
```

### Model Configuration
```javascript
// Emotion types
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

// Intensity levels
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
```

## Error Handling

### Common Error Codes
| Code | Description | Solution |
|------|-------------|----------|
| `MISSING_TEXT` | Text input is required | Provide text in request body |
| `TEXT_TOO_LONG` | Text exceeds 10,000 characters | Reduce text length |
| `ANALYSIS_FAILED` | AI analysis failed | Check API keys, try again |
| `INVALID_EMOTION` | Invalid emotion type | Use valid emotion from types list |
| `INVALID_INTENSITY` | Intensity not between 1-10 | Use valid intensity range |

### Fallback Behavior
1. **Primary**: Try OpenAI GPT-3.5 Turbo
2. **Secondary**: Try Hugging Face DistilRoBERTa
3. **Fallback**: Use rule-based analysis
4. **Error**: Return error with details

## Performance Metrics

### Response Times
- **OpenAI**: 2-5 seconds
- **Hugging Face**: 1-3 seconds
- **Rule-based**: <100ms

### Accuracy Rates
- **OpenAI**: 85-95% accuracy
- **Hugging Face**: 75-85% accuracy
- **Rule-based**: 60-70% accuracy

### Confidence Scores
- **High Confidence**: 0.8-1.0
- **Medium Confidence**: 0.6-0.8
- **Low Confidence**: 0.4-0.6

## Privacy & Security

### Data Protection
- All emotion data encrypted at rest
- User-specific data isolation
- Audit logging for all analyses
- GDPR compliance for data export/deletion

### API Security
- JWT token authentication required
- Rate limiting on all endpoints
- Input validation and sanitization
- CORS protection

## Future Enhancements

### Planned Features
- **Voice Emotion Analysis**: Audio-based emotion detection
- **Real-time Analysis**: WebSocket-based live emotion tracking
- **Advanced Patterns**: Machine learning pattern recognition
- **Therapist Integration**: Emotion data sharing with therapists
- **Mobile App Support**: Native mobile emotion tracking
- **Biometric Integration**: Heart rate, stress level correlation
- **Group Analysis**: Couple/family emotion pattern analysis
- **Predictive Analytics**: Emotion trend prediction
- **Custom Models**: User-specific emotion model training
- **Multilingual Support**: Emotion analysis in multiple languages
