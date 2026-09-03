import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState >= 1) {
    return;
  }

  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error('MONGO_URI is missing in environment variables');
  }

  try {
    const conn = await mongoose.connect(mongoUri, {
      dbName: 'nexus_ai_os',
      serverSelectionTimeoutMS: 5000, // Fail fast after 5s instead of hanging
    });

    isConnected = true;
    console.log(`[Database] MongoDB Connected: ${conn.connection.host} (DB: nexus_ai_os)`);
  } catch (error) {
    console.error(`[Database Error] Connection failed: ${error.message}`);
    throw error;
  }
};
