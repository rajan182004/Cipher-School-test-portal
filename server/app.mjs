import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectToDatabase } from "./db/conn.mjs";
import authRouter from "./routes/authRouter.mjs";
import testRouter from "./routes/testRouter.mjs";
import requireAuth from "./middlewares/requireAuth.mjs";
import userRouter from "./routes/userRouter.mjs";

const port = process.env.PORT || 3001;
const app = express();

// middlewares
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
  console.log(`${req.method}\t ${new Date().toLocaleString()}\t ${req.url}`);
  next();
});

// // routes
// app.get("/", (req, res) => {
//   res.send("Authentication Server");
// });
app.use("/api/auth", authRouter);
app.use("/api/test", requireAuth, testRouter);
app.use("/api/user", requireAuth, userRouter);

// render /dist/index.html
app.use(express.static("dist"));

app.get("*", (req, res) => {
  res.sendFile("index.html", { root: "dist" });
});

// Connect to MongoDB and start server
connectToDatabase()
  .then(() => {
    app.listen(port, (err) => {
      if (err) {
        console.log("Error in starting server");
        return;
      }
      console.log(`Server started at port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });
