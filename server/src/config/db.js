import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }

    const conn = await mongoose.connect(mongoUri, {
      dbName: 'nexus_ai_os',
    });

    console.log(`[Database] MongoDB Connected: ${conn.connection.host} (DB: nexus_ai_os)`);
  } catch (error) {
    console.error(`[Database Error] Connection failed: ${error.message}`);
    // Do not crash server in dev so APIs can return friendly errors
  }
};
