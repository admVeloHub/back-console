// VERSION: v1.0.0 | DATE: 2024-12-19 | AUTHOR: VeloHub Development Team
const mongoose = require('mongoose');

const userActivitySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  action: {
    type: String,
    required: true,
    index: true
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  timestamp: {
    type: Date,
    required: true,
    index: true,
    default: Date.now
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
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true,
  collection: 'user_activity'
});

// Índices para performance
userActivitySchema.index({ userId: 1, timestamp: -1 });
userActivitySchema.index({ action: 1, timestamp: -1 });
userActivitySchema.index({ source: 1, timestamp: -1 });
userActivitySchema.index({ sessionId: 1, timestamp: -1 });

// Métodos estáticos para consultas otimizadas
userActivitySchema.statics.getMetricsByPeriod = function(period, startDate, endDate) {
  const matchStage = {
    timestamp: {
      $gte: startDate,
      $lte: endDate
    }
  };

  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalActivities: { $sum: 1 },
        uniqueUsers: { $addToSet: '$userId' },
        uniqueSessions: { $addToSet: '$sessionId' },
        actions: { $push: '$action' },
        sources: { $push: '$source' }
      }
    },
    {
      $project: {
        _id: 0,
        totalActivities: 1,
        uniqueUsers: { $size: '$uniqueUsers' },
        uniqueSessions: { $size: '$uniqueSessions' },
        actions: 1,
        sources: 1
      }
    }
  ]);
};

userActivitySchema.statics.getHourlyDistribution = function(startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        timestamp: {
          $gte: startDate,
          $lte: endDate
        }
      }
    },
    {
      $group: {
        _id: { $hour: '$timestamp' },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { count: -1 }
    },
    {
      $limit: 1
    }
  ]);
};

userActivitySchema.statics.getTopActions = function(startDate, endDate, limit = 10) {
  return this.aggregate([
    {
      $match: {
        timestamp: {
          $gte: startDate,
          $lte: endDate
        }
      }
    },
    {
      $group: {
        _id: '$action',
        count: { $sum: 1 }
      }
    },
    {
      $sort: { count: -1 }
    },
    {
      $limit: limit
    }
  ]);
};

userActivitySchema.statics.getRecentActivities = function(startDate, endDate, limit = 20) {
  return this.find({
    timestamp: {
      $gte: startDate,
      $lte: endDate
    }
  })
  .sort({ timestamp: -1 })
  .limit(limit)
  .select('userId action timestamp source details')
  .lean();
};

const UserActivity = mongoose.model('UserActivity', userActivitySchema);

module.exports = UserActivity;
