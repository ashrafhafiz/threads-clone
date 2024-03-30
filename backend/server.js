import http from "http";
import colors from "colors";
import app from "./app.js";
import "dotenv/config";
import dbConnect from "./database/dbConnect.js";
import mongoose from "mongoose";

const PORT = process.env.PORT || 5000;
const MODE = process.env.NODE_ENV;

const server = http.createServer(app);

// Connect to MongoDB
dbConnect();
mongoose.connection.once("open", () => {
  console.log(
    `Connected to MongoDB Server @ ${mongoose.connection.host}`.brightCyan
  );

  server.listen(PORT, function () {
    console.log(
      `Express Server started on PORT:${PORT} in ${MODE} mode.`.brightCyan
    );
  });
});

// mongoose.connection.on("error", (error) => {
//   console.log(colors.brightRed(error));
//   //   console.log(
//   //     `${error.no}: ${error.code}\t${error.syscall}\t${error.hostname}`
//   //   );
//   //   logEvents(
//   //     `${error.no}: ${error.code}\t${error.syscall}\t${error.hostname}`,
//   //     "mongoDBErrorLog.log"
//   //   );
// });

// Handle application unhandledRejection errors
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down the server due to Unhandled Promise Rejection...");
  server.close(() => process.exit(1));
});
