const mongoose = require('mongoose')

const dayNoteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: { type: Date, required: true },
    content: { type: String, default: '' },
  },
  { timestamps: true }
)

dayNoteSchema.index({ userId: 1, date: 1 }, { unique: true })

module.exports = mongoose.model('DayNote', dayNoteSchema)
