
import dotenv from "dotenv";
import express from "express";
import connectDB from "./db/index.js";

const app = express();

dotenv.config({
  path: "./.env",
})

connectDB()
.then(() => {
   app.listen(process.env.PORT || 4000, () => {
     console.log(`Server is running on port ${process.env.PORT || 4000}`);
   });
})
.catch((error) => {
  console.error("Error connecting to MongoDB:", error.message);
  process.exit(1);
});





















/*
//first approach -everything in one file

import express from "express"

const app = express()

( async () => {
  try {
    await mongoose.connect('${process.env.MONGODB_URI}/{DB_NAME}')
    app.on("error", (error) => {
      console.log("Error while connecting to MongoDB", error);
      throw error;
    })

    app.listen(process.env.PORT || 3000, () => {
      console.log(`Server is running on port ${process.env.PORT || 3000}`);
    })
  } catch (error) {
    console.error("Error connecting to MongoDB:", error)
    process.exit(1)
  }
})

export default connectDB;

*/