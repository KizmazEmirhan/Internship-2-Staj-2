import express from 'express'
import Session from '../models/Session.js'
import authMiddleware from '../middlewares/auth.js'

const router = express.Router()

// all routes protected
router.use(authMiddleware)

// create
router.post('/', async (req, res) => {
  try {
    const s = new Session({ ...req.body, user: req.user.id })
    await s.save()
    res.json(s)
  } catch (err) {
    console.error(err)
    res.status(500).send('Server error')
  }
})

// read user's sessions
router.get('/', async (req, res) => {
  try {
    const items = await Session.find({ user: req.user.id })
    res.json(items)
    console.log(items)
  } catch (err) {
    console.error(err)
    res.status(500).send('Server error')
  }
})

// update
router.put('/:id', async (req, res) => {
  try {
    const s = await Session.findOneAndUpdate({ _id: req.params.id, user: req.user.id }, req.body, {
      new: true,
    })
    if (!s) return res.status(404).json({ msg: 'Not found' })
    res.json(s)
  } catch (err) {
    console.error(err)
    res.status(500).send('Server error')
  }
})

// delete
router.delete('/:id', async (req, res) => {
  try {
    const s = await Session.findOneAndDelete({ _id: req.params.id, user: req.user.id })
    if (!s) return res.status(404).json({ msg: 'Not found' })
    res.json({ ok: true })
  } catch (err) {
    console.error(err)
    res.status(500).send('Server error')
  }
})

export default router
