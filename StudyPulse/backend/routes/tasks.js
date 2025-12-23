const express = require('express')
const router = express.Router()
const Task = require('../models/Task')
const auth = require('../middleware/auth')

// list tasks for user (optional query: completed=false/true)
router.get('/', auth, async (req, res, next) => {
  try {
    const q = { userId: req.user.id }
    if (req.query.completed !== undefined) q.completed = req.query.completed === 'true'
    const tasks = await Task.find(q).sort({ dueDate: 1, createdAt: -1 })
    res.json(tasks)
  } catch (err) {
    next(err)
  }
})

// create task
router.post('/', auth, async (req, res, next) => {
  try {
    const payload = { ...req.body, userId: req.user.id }
    const task = new Task(payload)
    await task.save()
    res.status(201).json(task)
  } catch (err) {
    next(err)
  }
})

// update task
router.put('/:id', auth, async (req, res, next) => {
  try {
    const { id } = req.params
    const task = await Task.findById(id)
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' })
    if (task.userId.toString() !== req.user.id) return res.status(403).json({ success: false, message: 'Not allowed' })

    Object.assign(task, req.body)
    // if completed set completedAt when true and not already set
    if (req.body.completed === true && !task.completedAt) task.completedAt = new Date()
    if (req.body.completed === false) task.completedAt = null

    await task.save()
    res.json(task)
  } catch (err) {
    next(err)
  }
})

// delete task
router.delete('/:id', auth, async (req, res, next) => {
  try {
    const { id } = req.params
    const task = await Task.findById(id)
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' })
    if (task.userId.toString() !== req.user.id) return res.status(403).json({ success: false, message: 'Not allowed' })
    await Task.findByIdAndDelete(id)
    res.json({ success: true })
  } catch (err) {
    next(err)
  }
})

module.exports = router
