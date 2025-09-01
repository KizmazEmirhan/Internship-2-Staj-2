const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  duration: {
    type: Number, // dakika cinsinden
    required: true
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  productivityRating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Süre hesaplama middleware
sessionSchema.pre('save', function(next) {
  if (this.startTime && this.endTime) {
    const durationMs = this.endTime - this.startTime;
    this.duration = Math.round(durationMs / (1000 * 60)); // Dakikaya çevirme
  }
  next();
});

// İstatistik metodları
sessionSchema.statics.getTotalStudyTime = async function(userId, startDate, endDate) {
  const match = {
    userId: mongoose.Types.ObjectId(userId),
    isActive: true
  };

  if (startDate && endDate) {
    match.startTime = {
      $gte: startDate,
      $lte: endDate
    };
  }

  const result = await this.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        totalMinutes: { $sum: '$duration' }
      }
    }
  ]);

  return result.length > 0 ? result[0].totalMinutes : 0;
};

sessionSchema.statics.getSubjectDistribution = async function(userId, startDate, endDate) {
  const match = {
    userId: mongoose.Types.ObjectId(userId),
    isActive: true
  };

  if (startDate && endDate) {
    match.startTime = {
      $gte: startDate,
      $lte: endDate
    };
  }

  return await this.aggregate([
    { $match: match },
    {
      $group: {
        _id: '$subject',
        totalMinutes: { $sum: '$duration' },
        averageProductivity: { $avg: '$productivityRating' },
        count: { $sum: 1 }
      }
    }
  ]);
};

module.exports = mongoose.model('Session', sessionSchema);
