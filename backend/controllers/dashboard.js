import Booking from "../models/booking.model.js";
import Hotel from "../models/hotel.model.js";
import Package from "../models/package.model.js";
import PackageReviews from "../models/packageReviews.model.js";

export const getSummary = async (req, res, next) => {
  try {
    const allHotel = await Hotel.countDocuments();
    const allPackage = await Package.countDocuments();
    const allBooking = await Booking.countDocuments();
    const revenue = await Booking.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: {
              $toDouble: "$amount",
            },
          },
        },
      },
    ]);

    res.status(200).json({
      msg: "Summary fetched successfully",
      data: {
        totalHotels: allHotel,
        activePackages: allPackage,
        totalBookings: allBooking,
        totalRevenue: revenue[0]?.totalRevenue || 0,
      },
    });
  } catch (error) {
    console.log("Error in get all Hotels", error);
    next(error);
  }
};

export const getRecentBookings = async (req, res, next) => {
  try {
    const recentBookings = await Booking.find(
      {},
      { time: 1, amount: 1, createdAt: 1 }
    )
      .sort({ created: -1 })
      .limit(3)
      .populate("user", { username: 1 })
      .populate("packageId", { name: 1 });
    res.status(200).json({
      msg: "Summary fetched successfully",
      data: {
        recentBookings,
      },
    });
  } catch (error) {
    console.log("Error in get recent bookings", error);
    next(error);
  }
};

export const getRecentReiviews = async (req, res, next) => {
  try {
    const reviews = await PackageReviews.find({}, { rating: 1, title: 1 })
      .sort({ createdAt: -1 })
      .limit(3)
      .populate("user", { username: 1 })
      .populate("package", { name: 1 });
    res.status(200).json({
      msg: "Summary fetched successfully",
      data: {
        reviews,
      },
    });
  } catch (error) {
    console.log("Error in get recent bookings", error);
    next(error);
  }
};

export const getTopPackages = async (req, res, next) => {
  try {
    const topPackages = await Booking.aggregate([
      {
        $group: {
          _id: "$packageId",
          totalBookings: { $sum: 1 },
        },
      },
      { $sort: { totalBookings: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "packages",
          localField: "_id",
          foreignField: "_id",
          as: "package",
        },
      },
      { $unwind: "$package" },
      {
        $project: {
          _id: 0,
          packageId: "$package._id",
          name: "$package.name",
          totalBookings: 1,
        },
      },
    ]);
    console.log("packages are:", topPackages);

    res
      .status(200)
      .json({ msg: "data fetched  successfadsaully", data: topPackages });
  } catch (error) {
    next(error);
  }
};

export const getMonthlyRevenue = async (req, res, next) => {
  try {
    const currentYear = new Date().getFullYear() - 1;

    const monthlyRevenue = await Booking.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
            $lt: new Date(`${currentYear + 1}-01-01T00:00:00.000Z`),
          },
        },
      },
      {
        $group: {
          _id: { month: { $month: "$createdAt" } },
          totalRevenue: { $sum: "$amount" },
          totalBookings: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.month": 1 },
      },
      {
        $project: {
          _id: 0,
          month: "$_id.month",
          totalRevenue: 1,
          totalBookings: 1,
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
