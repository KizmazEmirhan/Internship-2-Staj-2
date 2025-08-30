import mongoose from 'mongoose'

const SessionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true },
    topic: { type: String },
    durationMinutes: { type: Number },
    date: { type: Date },
    notes: { type: String },
  },
  { timestamps: true }
)

export default mongoose.model('Session', SessionSchema)
