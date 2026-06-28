import dotenv from 'dotenv';
import dns from 'dns';
import mongoose from 'mongoose';

// Set public DNS servers for Node.js DNS resolver
dns.setServers(['8.8.8.8', '1.1.1.1']);

dotenv.config();

async function checkDns() {
  console.log("Checking DNS resolution with Google/Cloudflare DNS:");
  try {
    const srv = await dns.promises.resolveSrv('_mongodb._tcp.cluster0.rzqs0tu.mongodb.net');
    console.log("SRV Records found:", srv);
  } catch (err) {
    console.error("SRV resolve failed:", err.message);
  }

  try {
    const addresses = await dns.promises.resolve4('cluster0.rzqs0tu.mongodb.net');
    console.log("A Records found:", addresses);
  } catch (err) {
    console.error("A Record resolve failed:", err.message);
  }
}

async function testMongo() {
  console.log("\nTesting MongoDB Atlas Connection...");
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("SUCCESS! MongoDB connected successfully to host:", conn.connection.host);
    await mongoose.disconnect();
  } catch (error) {
    console.error("FAILED! MongoDB connection failed:", error.message);
  }
}

async function run() {
  await checkDns();
  await testMongo();
  process.exit(0);
}

run();
