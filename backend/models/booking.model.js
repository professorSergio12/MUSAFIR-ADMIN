import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    packageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Package",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    amount: {
      type: Number,
      required: true,
    },
    paymentId: String,
    orderId: String,
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled"],
      default: "Confirmed",
    },
  },
  { timestamps: true }
);
bookingSchema.index({ package: 1, createdAt: -1 }); // For package reviews sorted by date
bookingSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model("Booking", bookingSchema);
