import express from 'express'
import { PrismaClient } from '@prisma/client'

const router = express.Router()
const prisma = new PrismaClient()

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: { 
        posts: {
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    res.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    res.status(500).json({ error: 'Failed to fetch users' })
  }
})

// Create user
router.post('/', async (req, res) => {
  try {
    const { email, name } = req.body
    
    if (!email) {
      return res.status(400).json({ 
        error: 'Email is required'
    })
    }

    const user = await prisma.user.create({
      data: { email, name }
    })
    res.status(201).json(user)
  } catch (error) {
    console.error('Error creating user:', error)
    if (error.code === 'P2002') {
      res.status(409).json({ error: 'Email already exists' })
    } else {
      res.status(500).json({ error: 'Failed to create user' })
    }
  }
})

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    
    const user = await prisma.user.findUnique({
      where: { id },
      include: { 
        posts: {
          orderBy: { createdAt: 'desc' }
        }
      }
    })
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    
    res.json(user)
  } catch (error) {
    console.error('Error fetching user:', error)
    res.status(500).json({ error: 'Failed to fetch user' })
  }
})

// Update user
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { email, name } = req.body
    
    const user = await prisma.user.update({
      where: { id },
      data: { email, name }
    })
    
    res.json(user)
  } catch (error) {
    console.error('Error updating user:', error)
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'User not found' })
    } else if (error.code === 'P2002') {
      res.status(409).json({ error: 'Email already exists' })
    } else {
      res.status(500).json({ error: 'Failed to update user' })
    }
  }
})

// Delete user
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    
    // Delete user and their posts (cascade delete)
    await prisma.user.delete({
      where: { id }
    })
    
    res.status(204).send()
  } catch (error) {
    console.error('Error deleting user:', error)
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'User not found' })
    } else {
      res.status(500).json({ error: 'Failed to delete user' })
    }
  }
})

export default router