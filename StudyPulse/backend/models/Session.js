const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    startTime: { type: Date, required: true },
    endTime: {
      type: Date,
    },
      duration: {
        type: Number, // Duration in minutes
      },
      topic: {
        type: String,
        trim: true,
        default: null
      },
      questionCount: {
        type: Number,
        default: null
      },
    productivityRating: {
      type: Number,
      min: 1,
      max: 5,
    },
    subject: { type: String, required: true, trim: true },
    description: { type: String, trim: true },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Süre hesaplama middleware
sessionSchema.pre("save", function (next) {
  if (this.startTime && this.endTime) {
    const durationMs = this.endTime - this.startTime;
    this.duration = Math.round(durationMs / (1000 * 60)); // Dakikaya çevirme
  }
  next();
});

// İstatistik metodları
sessionSchema.statics.getTotalStudyTime = async function (
  userId,
  startDate,
  endDate
) {
  const match = {
    userId: new mongoose.Types.ObjectId(userId),
    // only include sessions which have a computed duration (i.e. finished sessions)
    duration: { $exists: true, $ne: null },
  };

  if (startDate && endDate) {
    match.startTime = {
      $gte: startDate,
      $lte: endDate,
    };
  }

  const result = await this.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        totalMinutes: { $sum: "$duration" },
      },
    },
  ]);

  return result.length > 0 ? result[0].totalMinutes : 0;
};

sessionSchema.statics.getSubjectDistribution = async function (
  userId,
  startDate,
  endDate
) {
  const match = {
    userId: new mongoose.Types.ObjectId(userId),
    // only include sessions which have a computed duration (i.e. finished sessions)
    duration: { $exists: true, $ne: null },
  };

  if (startDate && endDate) {
    match.startTime = {
      $gte: startDate,
      $lte: endDate,
    };
  }

  return await this.aggregate([
    { $match: match },
    {
      $group: {
        _id: "$subject",
        totalMinutes: { $sum: "$duration" },
        averageProductivity: { $avg: "$productivityRating" },
        count: { $sum: 1 },
      },
    },
  ]);
};

module.exports = mongoose.model("Session", sessionSchema);
