import express from 'express'

const router = express.Router()

// Get all posts
router.get('/', async (req, res) => {
  res.json(["Halo", "Owi"]) // Return empty array or placeholder
})

// Create post
router.post('/', async (req, res) => {
  res.status(201).json({ message: 'Post created (placeholder)' })
})

// Get post by ID
router.get('/:id', async (req, res) => {
  res.status(404).json({ error: 'Post not found (placeholder)' })
})

// Update post
router.put('/:id', async (req, res) => {
  res.status(200).json({ message: 'Post updated (placeholder)' })
})

// Delete post
router.delete('/:id', async (req, res) => {
  res.status(204).send("Delete post")
})

export default router