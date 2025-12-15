import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) throw new Error("Missing MONGODB_URI");

type GlobalWithMongoose = typeof globalThis & {
  _mongooseConn?: Promise<typeof mongoose>;
};

const globalAny = global as GlobalWithMongoose;

export const connectDB = async () => {
  if (!globalAny._mongooseConn) {
    globalAny._mongooseConn = mongoose.connect(MONGODB_URI, {
      dbName: "detective_market_mvp",
      bufferCommands: false
    });
  }
  return globalAny._mongooseConn;
};