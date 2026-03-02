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
    image: 'https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    name: 'The Blair',
    price: 85.5,
    image: 'https://assets.myntassets.com/w_412,q_30,dpr_3,fl_progressive,f_webp/assets/images/25813096/2023/11/8/efb3433d-7436-4897-8331-222641f466a01699447608033FloralGownDress1.jpg',
  },
  {
    name: 'The Serena',
    price: 95.0,
    image: 'https://assets.myntassets.com/w_412,q_30,dpr_3,fl_progressive,f_webp/assets/images/25813096/2023/11/8/efb3433d-7436-4897-8331-222641f466a01699447608033FloralGownDress1.jpg',
  },
  {
    name: 'The Carrie',
    price: 150.0,
    image: 'https://assets.myntassets.com/w_412,q_30,dpr_3,fl_progressive,f_webp/assets/images/25813096/2023/11/8/efb3433d-7436-4897-8331-222641f466a01699447608033FloralGownDress1.jpg',
  },
  {
    name: 'The Miranda',
    price: 75.0,
    image: 'https://assets.myntassets.com/w_412,q_30,dpr_3,fl_progressive,f_webp/assets/images/25813096/2023/11/8/efb3433d-7436-4897-8331-222641f466a01699447608033FloralGownDress1.jpg',
  },
  {
    name: 'The Charlotte',
    price: 110.0,
    image: 'https://assets.myntassets.com/w_412,q_30,dpr_3,fl_progressive,f_webp/assets/images/25813096/2023/11/8/efb3433d-7436-4897-8331-222641f466a01699447608033FloralGownDress1.jpg',
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
