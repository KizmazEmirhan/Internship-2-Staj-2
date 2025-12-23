const express = require('express')
const router = express.Router()
const DayNote = require('../models/DayNote')
const auth = require('../middleware/auth')

// get note for a specific date (query ?date=YYYY-MM-DD)
router.get('/', auth, async (req, res, next) => {
  try {
    const dateQ = req.query.date ? new Date(req.query.date) : new Date()
    const start = new Date(dateQ)
    start.setHours(0, 0, 0, 0)
    const end = new Date(dateQ)
    end.setHours(23, 59, 59, 999)

    const note = await DayNote.findOne({ userId: req.user.id, date: { $gte: start, $lte: end } })
    res.json(note || null)
  } catch (err) {
    next(err)
  }
})

// create or update note for a date
router.post('/', auth, async (req, res, next) => {
  try {
    const { date, content } = req.body
    if (!date) return res.status(400).json({ success: false, message: 'date required' })

    const d = new Date(date)
    const start = new Date(d)
    start.setHours(0, 0, 0, 0)

    const note = await DayNote.findOneAndUpdate(
      { userId: req.user.id, date: { $gte: start, $lte: new Date(start.getTime() + 86400000 - 1) } },
      { content, date: d, userId: req.user.id },
      { upsert: true, new: true }
    )
    res.json(note)
  } catch (err) {
    next(err)
  }
})

// delete note by id
router.delete('/:id', auth, async (req, res, next) => {
  try {
    const { id } = req.params
    const note = await DayNote.findById(id)
    if (!note) return res.status(404).json({ success: false, message: 'note not found' })
    if (note.userId.toString() !== req.user.id) return res.status(403).json({ success: false, message: 'not allowed' })
    await DayNote.findByIdAndDelete(id)
    res.json({ success: true })
  } catch (err) {
    next(err)
  }
})

module.exports = router
