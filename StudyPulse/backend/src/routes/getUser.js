//get user details
import express from 'express'
import User from '../models/User.js'

const router = express.Router()

//get current user details
router.get('/me', async (req, res) => {
  const user = await User.findById(req.user.id)
  res.json(user)
})
