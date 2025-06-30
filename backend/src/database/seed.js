import connectToDatabase from './mongodb.js'
import User from '../models/user.model.js'
import Field from '../models/field.model.js'
import mongoose from 'mongoose'

const seed = async () => {
  await connectToDatabase()

  try {
    await User.deleteMany({})
    await Field.deleteMany({})

    const owner = await User.create({
      name: 'Budi Lapangan',
      email: 'budi@example.com',
      phone: '081234567890',
      role: 'owner',
      img_path: ''
    })

    const user = await User.create({
      name: 'Ani Penyewa',
      email: 'ani@example.com',
      phone: '089876543210',
      role: 'user',
      img_path: ''
    })

    await Field.insertMany([
      {
        name: 'Lapangan Futsal A',
        category: 'Futsal',
        price: 150000,
        is_active: true,
        owner_id: owner._id
      },
      {
        name: 'Lapangan Badminton B',
        category: 'Bulu Tangkis',
        price: 100000,
        is_active: true,
        owner_id: owner._id
      }
    ])

    console.log('✅ Seed success')
  } catch (err) {
    console.error('❌ Seed failed:', err)
  } finally {
    mongoose.disconnect()
  }
}

seed()
