// VERSION: v1.0.0 | DATE: 2024-12-19 | AUTHOR: VeloHub Development Team
const mongoose = require('mongoose');

const botFeedbackSchema = new mongoose.Schema({
  colaboradorNome: {
    type: String,
    required: true,
    index: true
  },
  action: {
    type: String,
    required: true,
    index: true
  },
  messageId: {
    type: Number,
    required: true,
    index: true
  },
  sessionId: {
    type: String,
    index: true,
    default: null
  },
  source: {
    type: String,
    required: true,
    index: true
  },
  details: {
    feedbackType: {
      type: String,
      required: true,
      index: true
    },
    comment: {
      type: String,
      default: ''
    },
    question: {
      type: String,
      default: ''
    },
    answer: {
      type: String,
      default: ''
    },
    aiProvider: {
      type: String,
      default: null
    },
    responseSource: {
      type: String,
      default: ''
    }
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  collection: 'bot_feedback'
});

// Índices para performance
botFeedbackSchema.index({ colaboradorNome: 1, createdAt: -1 });
botFeedbackSchema.index({ 'details.feedbackType': 1, createdAt: -1 });
botFeedbackSchema.index({ action: 1, createdAt: -1 });
botFeedbackSchema.index({ sessionId: 1, createdAt: -1 });

// Métodos estáticos para consultas otimizadas
botFeedbackSchema.statics.getFeedbackMetrics = function(startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        createdAt: {
          $gte: startDate,
          $lte: endDate
        }
      }
    },
    {
      $group: {
        _id: '$details.feedbackType',
        count: { $sum: 1 },
        colaboradores: { $addToSet: '$colaboradorNome' }
      }
    },
    {
      $project: {
        _id: 0,
        feedbackType: '$_id',
        count: 1,
        colaboradores: { $size: '$colaboradores' }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);
};

botFeedbackSchema.statics.getFeedbackByPeriod = function(startDate, endDate, groupBy = 'day') {
  let groupFormat;
  
  switch (groupBy) {
    case 'day':
      groupFormat = {
        year: { $year: '$createdAt' },
        month: { $month: '$createdAt' },
        day: { $dayOfMonth: '$createdAt' }
      };
      break;
    case 'week':
      groupFormat = {
        year: { $year: '$createdAt' },
        week: { $week: '$createdAt' }
      };
      break;
    case 'month':
      groupFormat = {
        year: { $year: '$createdAt' },
        month: { $month: '$createdAt' }
      };
      break;
    default:
      groupFormat = {
        year: { $year: '$createdAt' },
        month: { $month: '$createdAt' },
        day: { $dayOfMonth: '$createdAt' }
      };
  }

  return this.aggregate([
    {
      $match: {
        createdAt: {
          $gte: startDate,
          $lte: endDate
        }
      }
    },
    {
      $group: {
        _id: groupFormat,
        positive: {
          $sum: {
            $cond: [{ $eq: ['$details.feedbackType', 'positive'] }, 1, 0]
          }
        },
        negative: {
          $sum: {
            $cond: [{ $eq: ['$details.feedbackType', 'negative'] }, 1, 0]
          }
        },
        neutral: {
          $sum: {
            $cond: [{ $eq: ['$details.feedbackType', 'neutral'] }, 1, 0]
          }
        },
        total: { $sum: 1 }
      }
    },
    {
      $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
    }
  ]);
};

botFeedbackSchema.statics.getTopColaboradores = function(startDate, endDate, limit = 10) {
  return this.aggregate([
    {
      $match: {
        createdAt: {
          $gte: startDate,
          $lte: endDate
        }
      }
    },
    {
      $group: {
        _id: '$colaboradorNome',
        totalFeedbacks: { $sum: 1 },
        positiveFeedbacks: {
          $sum: {
            $cond: [{ $eq: ['$details.feedbackType', 'positive'] }, 1, 0]
          }
        },
        negativeFeedbacks: {
          $sum: {
            $cond: [{ $eq: ['$details.feedbackType', 'negative'] }, 1, 0]
          }
        }
      }
    },
    {
      $addFields: {
        satisfactionRate: {
          $cond: [
            { $gt: ['$totalFeedbacks', 0] },
            {
              $multiply: [
                { $divide: ['$positiveFeedbacks', '$totalFeedbacks'] },
                100
              ]
            },
            0
          ]
        }
      }
    },
    {
      $sort: { satisfactionRate: -1, totalFeedbacks: -1 }
    },
    {
      $limit: limit
    }
  ]);
};

botFeedbackSchema.statics.getRecentFeedbacks = function(startDate, endDate, limit = 20) {
  return this.find({
    createdAt: {
      $gte: startDate,
      $lte: endDate
    }
  })
  .sort({ createdAt: -1 })
  .limit(limit)
  .select('colaboradorNome action details.feedbackType details.comment createdAt')
  .lean();
};

const BotFeedback = mongoose.model('BotFeedback', botFeedbackSchema);

module.exports = BotFeedback;
