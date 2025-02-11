import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js";
import genreRoute from "./routes/genreRoute.js";
import booksRoute from "./routes/booksRoute.js";
import authorRoute from "./routes/authorRoute.js";
import bodyParser from "body-parser";

// import loyaltyRoute from "./routes/loyaltyRoutes.js"
import cors from "cors";

dotenv.config();
connectDB();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(morgan("dev"));
app.use(bodyParser.json());


app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/genre", genreRoute);
app.use("/api/v1/author", authorRoute);
app.use("/api/v1/book", booksRoute);

// app.use("/api/v1/loyalty", loyaltyRoute);

app.get("/", (req, res) => {
  res.send("<h1>Welcome to node server of Our BookStore</h1>");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`.underline.green);
});
