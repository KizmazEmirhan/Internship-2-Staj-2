import express from 'express'
import { body, validationResult } from 'express-validator'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import auth from '../middlewares/auth.js'

const router = express.Router()

// register
router.post(
  '/register',
  body('name').notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

    const { name, email, password } = req.body
    try {
      let user = await User.findOne({ email })
      if (user) return res.status(400).json({ msg: 'User already exists' })
      const salt = await bcryptjs.genSalt(10)
      const passwordHash = await bcryptjs.hash(password, salt)
      user = new User({ name, email, passwordHash })
      await user.save()
      const payload = { user: { id: user.id } }
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      })
      res.json({ token })
    } catch (err) {
      console.error(err.message)
      res.status(500).send('Server error')
    }
  },
)

// login
router.post('/login', body('email').isEmail(), body('password').exists(), async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

  const { email, password } = req.body
  try {
    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' })
    const isMatch = await bcryptjs.compare(password, user.passwordHash)
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' })
    const payload = { user: { id: user.id } }
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    })
    res.json({ token })
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})

// protected route to get current user
router.get('/me', auth, async (req, res) => {
  try {
    if (!req.userDoc) return res.status(404).json({ msg: 'User not found' })
    res.json(req.userDoc)
  } catch (err) {
    console.error(err)
    res.status(500).json({ msg: 'Server error' })
  }
})

export default router
