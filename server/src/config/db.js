import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }

    const conn = await mongoose.connect(mongoUri, {
      dbName: 'nexus_ai_os',
    });

    isConnected = true;
    console.log(`[Database] MongoDB Connected: ${conn.connection.host} (DB: nexus_ai_os)`);
  } catch (error) {
    console.error(`[Database Error] Connection failed: ${error.message}`);
  }
};
