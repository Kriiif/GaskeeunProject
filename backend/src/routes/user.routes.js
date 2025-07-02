import express from 'express'
import { getUser, getUsers } from '../controllers/user.controller.js'
import authorize from '../middlewares/auth.middleware.js'

const router = express.Router()

// Get all users
router.get('/', getUsers)

router.get('/:id', authorize, getUser)

// Create user
router.post('/', async (req, res) => {
  res.status(201).json({ message: 'User created (placeholder)' })
})

// Update user
router.put('/:id', async (req, res) => {
  res.status(200).json({ message: 'User updated (placeholder)' })
})

// Delete user
router.delete('/:id', async (req, res) => {
  res.status(204).send()
})

export default router