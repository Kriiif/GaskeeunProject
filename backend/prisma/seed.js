import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')
  
  // Create users
  const user1 = await prisma.user.create({
    data: {
      email: 'john2@example.com',
      name: 'John Doe 2',
      posts: {
        create: [
          {
            title: 'Getting Started with MongoDB and Prisma',
            content: 'This is my first post using MongoDB with Prisma!',
            published: true
          },
          {
            title: 'Advanced MongoDB Queries',
            content: 'Learning about advanced querying techniques',
            published: false
          }
        ]
      }
    }
  })

  const user2 = await prisma.user.create({
    data: {
      email: 'jane2@example.com',
      name: 'Jane Smith 2',
      posts: {
        create: [
          {
            title: 'Building APIs with Express',
            content: 'A comprehensive guide to building REST APIs',
            published: true
          }
        ]
      }
    }
  })
  
  console.log('Created users:', { user1: user1.id, user2: user2.id })
  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })