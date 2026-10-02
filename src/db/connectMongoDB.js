import mongoose from 'mongoose';
import dns from 'dns';
import { Product } from '../models/product.js';
import { Category } from '../models/category.js';

dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '1.1.1.1']);

export const connectMongoDB = async () => {
  try {
    const mongoUrl = process.env.MONGO_URL;
    if (!mongoUrl) {
      throw new Error('MONGO_URL is not defined in environment variables');
    }
    await mongoose.connect(mongoUrl);
    console.log('✅ MongoDB connection established successfully');
    await Promise.all([Product.syncIndexes(), Category.syncIndexes()]);
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error.message);
    process.exit(1);
  }
};
