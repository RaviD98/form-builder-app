import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected!!DB HOST : ${connectionInstance.connection.host}`);
  } catch (error) {
    console.log(`MongoDB Connection Error, ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;