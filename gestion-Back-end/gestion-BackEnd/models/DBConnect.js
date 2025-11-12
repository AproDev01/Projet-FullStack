import mongoose from "mongoose";

export async function DBConnect() {
  try {
    await mongoose.connect("mongodb://localhost:27017/EtudiantsDB");
    console.log("MongoDB connecte");
  } catch (error) {
    console.log("Error", error);
  }
}
