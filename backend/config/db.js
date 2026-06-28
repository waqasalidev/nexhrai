import mongoose from 'mongoose';
import dns from 'dns';

const connectDB = async () => {
  try {
    // Force Node.js resolver to use public DNS servers to resolve local DNS SRV issues
    dns.setServers(['8.8.8.8', '1.1.1.1']);
  } catch (dnsErr) {
    console.warn(`[WARNING] Failed to set public DNS servers: ${dnsErr.message}`);
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000, // 10s timeout for server selection
      connectTimeoutMS: 10000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    throw error;
  }
};

export default connectDB;
