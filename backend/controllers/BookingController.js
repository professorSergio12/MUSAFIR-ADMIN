import mongoose from "mongoose";
import Booking from "../models/booking.model.js";

// Monthly revenue summary
export const getRevenueByMonth = async (req, res, next) => {
  try {
    const monthlyRevenue = await Booking.aggregate([
      {
        $group: {
          _id: { month: { $month: "$createdAt" } },
          totalRevenue: { $sum: { $toDouble: "$amount" } },
        },
      },
      { $sort: { "_id.month": 1 } },
      {
        $project: {
          _id: 0,
          month: "$_id.month",
          totalRevenue: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: monthlyRevenue,
    });
  } catch (error) {
    next(error);
  }
};
export const getAllboooking = async (req, res, next) => {
  const pages = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (pages - 1) * limit;
  try {
    const booking = await Booking.find(
      {},
      { amount: 1, status: 1, orderId: 1, paymentId: 1, createdAt: 1 }
    )
      .sort({ createdAt: -1 })
      .populate("user", { username: 1 })
      .populate("packageId", { name: 1 })
      .limit(limit)
      .skip(skip);
    res.status(200).json({ msg: "data fetched  successfully", data: booking });
  } catch (error) {
    next(error);
  }
};

export const getBookingsById = async (req, res, next) => {
  try {
    const booking = await Booking.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(req.params.id),
        },
      },
      {
        $lookup :{
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $lookup: {
          from: "packages",
          localField: "packageId",
          foreignField: "_id",
          as: "package",
        },
      },
      { $unwind: "$package" },
      {
        $lookup: {
          from: "locations",
          localField: "package.itinerary",
          foreignField: "_id",
          as: "itinerary",
        },
      },
      {
        $lookup: {
          from: "hotels",
          localField: "package.availableHotels",
          foreignField: "_id",
          as: "hotels",
        },
      },
      {
        $lookup: {
          from: "foodoptions",
          localField: "package.availableFoodOptions",
          foreignField: "_id",
          as: "foodOptions",
        },
      },
      { $project :{
        _id:1,
        amount:1,
        paymentId:1,
        orderId:1,
        package:{
          _id:1,
          name:1,
          basePrice:1,
          images:1,
          country:1,
        },
        foodOptions:{
          _id:1,
          name:1,
          surchargePerDay:1,
          description:1,
          image:1,
          foodOptions:1,
        },
        itinerary:{
          _id:1,
          name:1,
          country:1,
          city:1,
          locationImage:1,
          day:1,
        },
        hotels:{
          _id:1,
          name:1,
          city:1,
          pricePerNight:1,
          images:1,
          country:1,
          roomTypes:1,
        },
        user:{
          _id:1,
          username:1,
          email:1,
          profilePicture:1,
          isAdmin:1,
        }
      }}
    ]);

  

    res.status(200).json({ msg: "data fetche successfully", data: booking });
  } catch (error) {
    next(error);
  }
};

export const getBookingsByPackageName = async (req, res, next) => {
  try {
    const booking = await Booking.find({  });
    res.status(200).json({ msg: "data fetched successfully", data: booking });
  } catch (error) {
    next(error);
  }
};

export const deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    res.status(200).json({ msg: "data deleted successfully", data: booking });
  } catch (error) {
    next(error);
  }
};
