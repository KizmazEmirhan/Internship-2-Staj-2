const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  theme: {
    type: String,
    enum: ['light', 'dark', 'system'],
    default: 'system'
  },
  notifications: {
    email: {
      enabled: {
        type: Boolean,
        default: true
      },
      frequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'never'],
        default: 'weekly'
      }
    },
    push: {
      enabled: {
        type: Boolean,
        default: true
      },
      studyReminders: {
        type: Boolean,
        default: true
      },
      progressUpdates: {
        type: Boolean,
        default: true
      }
    }
  },
  privacy: {
    showProfileToOthers: {
      type: Boolean,
      default: true
    },
    shareStudyStats: {
      type: Boolean,
      default: true
    }
  },
  studyPreferences: {
    defaultSessionDuration: {
      type: Number,
      default: 60, // dakika cinsinden
      min: 15,
      max: 240
    },
    breakReminders: {
      enabled: {
        type: Boolean,
        default: true
      },
      interval: {
        type: Number,
        default: 45, // dakika cinsinden
        min: 15,
        max: 120
      }
    }
  },
  language: {
    type: String,
    enum: ['tr', 'en'],
    default: 'tr'
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

// Yeni kullanıcı için varsayılan ayarlar oluşturma
settingsSchema.statics.createDefaultSettings = async function(userId) {
  return await this.create({ userId });
};

// Ayarları güncelleme metodu
settingsSchema.statics.updateUserSettings = async function(userId, updates) {
  return await this.findOneAndUpdate(
    { userId },
    { $set: updates },
    { new: true, runValidators: true }
  );
};

module.exports = mongoose.model('Settings', settingsSchema);
