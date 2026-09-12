//mongodb connection.
import mongoose from "mongoose";
//.env file sy mongodb url llaty hy.
const MONGODB_URI = process.env.MONGODB_URI;
//aagr url nae milta to error.
if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is missing in .env.local");
}
//agr koi connection pahly sy save hy.
let cached = global.mongoose;
//agr pahly sy koi connection save nae hy to.
if (!cached) {
  cached = global.mongoose = {
    conn: null,
    promise: null,
  };
}
//mongodb sy connection banaty hy.
export async function connectDB() {
  //agr connection pahly sy bana hy.
  if (cached.conn) {
    return cached.conn;
  }
//agr connection start nae howa to connection start krty hy.
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {

      family: 4,


      serverSelectionTimeoutMS: 10000,
    });
  }

  // MongoDB connection complete hone ka wait karenge.
  cached.conn = await cached.promise;

  // Successful connection terminal mein confirm karenge.
  console.log("MongoDB connected successfully.");

  // Connected MongoDB instance return karenge.
  return cached.conn;
}