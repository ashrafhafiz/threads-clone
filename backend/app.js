import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
// import bodyParser from "body-parser";
// import { fileURLToPath } from "url";
// import { dirname } from "path";
// import { readdirSync } from "fs";
import createError from "http-errors";

import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import postRouter from "./routes/post.routes.js";

const allowedOrigins = ["https://localhost:3000"];

const corsOptions = {
  origin: allowedOrigins,
  useSuccessStatus: 200,
};

const app = express();

app.use(cors(corsOptions));
// To parse JSON data in the request.body
app.use(express.json());
// To parse Form data in the request.body
// Instead of using app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ReferenceError: __dirname is not defined in ES module scope
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
// console.log(__dirname);
// readdirSync(__dirname + "/routes/").map((f) =>
//   import(`./routes/${f}`).then(({ default: router }) =>
//     app.use("/api/v1", router)
//   )
// );
// Dynamic import in not working as excepted
app.use("/api/v1", [authRouter, userRouter, postRouter]);

// Handling 404 errors
app.use((req, res, next) => {
  next(createError(404));
});

// Error handling
app.use((error, req, res, next) => {
  console.log("Error status: ", error.status);
  console.log("Message: ", error.message);
  console.log("Message: ", error.stack);

  res.status(error.status || 500);
  res.json({
    status: error.status,
    message: error.message,
    stack: error.stack,
  });
});

export default app;
