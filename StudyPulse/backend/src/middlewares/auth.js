import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export default async function (req, res, next) {
  const authHeader = req.header('Authorization')
  if (!authHeader) return res.status(401).json({ msg: 'No token' })
  const token = authHeader.split(' ')[1]
  if (!token) return res.status(401).json({ msg: 'No token' })
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded.user
    // optionally load user
    req.userDoc = await User.findById(req.user.id).select('-passwordHash')
    next()
  } catch (err) {
    console.error(err)
    return res.status(401).json({ msg: 'Token invalid' })
  }
}
