import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
await connectDB();

import userRoutes from "./routes/userRoutes.js";
import packageRoutes from "./routes/packageRoutes.js";
import hotelRoutes from "./routes/hotelRoutes.js";
import iteneraryRoutes from "./routes/locations.js";
import foodRoutes from "./routes/foodRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import dashboardRoutes from "./routes/dashboard.js";
import reviewsRoutes from "./routes/reivewsRoutes.js";
import galleryRoutes from "./routes/galleryRoutes.js";

app.use("/", (req, res) => {
  res.send("Admin Portal Backend is running");
});

app.use("/api/admin/users", userRoutes);
app.use("/api/admin/package", packageRoutes);
app.use("/api/admin/hotel", hotelRoutes);
app.use("/api/admin/itenerary", iteneraryRoutes);
app.use("/api/admin/meal", foodRoutes);
app.use("/api/admin/booking", bookingRoutes);
app.use("/api/admin/dashboard", dashboardRoutes);
app.use("/api/admin/reviews", reviewsRoutes);
app.use("/api/admin/gallery", galleryRoutes);


app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong!";
  res.status(status).json({ message: message });
});

// app.listen(PORT, () => {
//   console.log(`Admin Portal Backend is running on port ${PORT}`);
// });
