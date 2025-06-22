import express from 'express'
import { PrismaClient } from '@prisma/client'

const router = express.Router()
const prisma = new PrismaClient()

// Get all posts
router.get('/', async (req, res) => {
  try {
    const { published } = req.query
    
    const where = published !== undefined 
      ? { published: published === 'true' }
      : {}

    const posts = await prisma.post.findMany({
      where,
      include: { 
        author: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    res.json(posts)
  } catch (error) {
    console.error('Error fetching posts:', error)
    res.status(500).json({ error: 'Failed to fetch posts' })
  }
})

// Create post
router.post('/', async (req, res) => {
  try {
    const { title, content, authorId, published = false } = req.body
    
    if (!title || !authorId) {
      return res.status(400).json({ error: 'Title and authorId are required' })
    }

    const post = await prisma.post.create({
      data: { 
        title, 
        content, 
        authorId, 
        published 
      },
      include: { 
        author: {
          select: { id: true, name: true, email: true }
        }
      }
    })
    res.status(201).json(post)
  } catch (error) {
    console.error('Error creating post:', error)
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Author not found' })
    } else {
      res.status(500).json({ error: 'Failed to create post' })
    }
  }
})

// Get post by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    
    const post = await prisma.post.findUnique({
      where: { id },
      include: { 
        author: {
          select: { id: true, name: true, email: true }
        }
      }
    })
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' })
    }
    
    res.json(post)
  } catch (error) {
    console.error('Error fetching post:', error)
    res.status(500).json({ error: 'Failed to fetch post' })
  }
})

// Update post
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { title, content, published } = req.body
    
    const post = await prisma.post.update({
      where: { id },
      data: { title, content, published },
      include: { 
        author: {
          select: { id: true, name: true, email: true }
        }
      }
    })
    
    res.json(post)
  } catch (error) {
    console.error('Error updating post:', error)
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Post not found' })
    } else {
      res.status(500).json({ error: 'Failed to update post' })
    }
  }
})

// Delete post
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    
    await prisma.post.delete({
      where: { id }
    })
    
    res.status(204).send()
  } catch (error) {
    console.error('Error deleting post:', error)
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Post not found' })
    } else {
      res.status(500).json({ error: 'Failed to delete post' })
    }
  }
})

export default router