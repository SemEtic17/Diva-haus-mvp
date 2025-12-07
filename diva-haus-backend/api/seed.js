import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });
import mongoose from 'mongoose';
import Product from './models/Product.js';

const products = [
  {
    name: 'The Audrey',
    price: 120.0,
    image: 'https://picsum.photos/400/500?1',
  },
  {
    name: 'The Blair',
    price: 85.5,
    image: 'https://picsum.photos/400/500?2',
  },
  {
    name: 'The Serena',
    price: 95.0,
    image: 'https://picsum.photos/400/500?3',
  },
  {
    name: 'The Carrie',
    price: 150.0,
    image: 'https://picsum.photos/400/500?4',
  },
  {
    name: 'The Miranda',
    price: 75.0,
    image: 'https://picsum.photos/400/500?5',
  },
  {
    name: 'The Charlotte',
    price: 110.0,
    image: 'https://picsum.photos/400/500?6',
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log('MongoDB Connected...');

    await Product.deleteMany({});
    console.log('Products Removed...');

    await Product.insertMany(products);
    console.log('Database Seeded...');

    mongoose.connection.close();
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

seedDB();
