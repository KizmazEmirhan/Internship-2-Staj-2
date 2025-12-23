const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    dueDate: { type: Date },
    completed: { type: Boolean, default: false },
    completedAt: { type: Date },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  },
  { timestamps: true }
)

// mark complete helper
taskSchema.methods.markComplete = function () {
  this.completed = true
  this.completedAt = new Date()
  return this.save()
}

module.exports = mongoose.model('Task', taskSchema)
