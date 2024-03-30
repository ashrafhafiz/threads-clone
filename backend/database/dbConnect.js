// external imports
import colors from "colors";
import dbConfig from "../config/dbConfig.js";
import mongoose from "mongoose";

const dbConnect = async () => {
  try {
    await mongoose.connect(dbConfig.DB_URL, dbConfig.db_options);
  } catch (error) {
    console.log(colors.brightRed(`Error: ${error.message}`));
    process.exit(1);
  }
};

export default dbConnect;
