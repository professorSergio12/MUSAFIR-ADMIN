import Location from "../models/location.model.js";
import { errorHandler } from "../util/error.js";
import { itinerarySchema } from "../validations/IteneraryValidation.js";
import { getDataURI } from "../middleware/parser.js";
import cloudinary from "../config/cloudinary.js";
export const createItenerary = async (req, res, next) => {
  req.body.day = Number(req.body.day);
  const { name, country, city, details, day } = req.body;
  const file = req.file;
  const fileUri = getDataURI(file);
  console.log(name, country, city, details, file, day);

  // Upload to Cloudinary
  const cloudinaryResponse = await cloudinary.uploader.upload(fileUri.content, {
    folder: "gallery",
  });
  req.body.locationImage = cloudinaryResponse.secure_url;
  const { error } = itinerarySchema.safeParse(req.body);
  if (error) {
    const err = JSON.parse(error.message);
    return next(errorHandler(400, err[0].message));
  }

  try {
    const newItinerary = new Location({
      name,
      country,
      city,
      details,
      locationImage: cloudinaryResponse.secure_url,
      day,
    });
    await newItinerary.save();
    res.status(201).json({ status: "success", data: "newItinerary created" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getAllItenerary = async (req, res, next) => {
  try {
    const limit = 10;
    const page = req.query.page || 1;
    const skip = (page - 1) * limit;

    const [allItinerary, totalItinerary] = await Promise.all([

     Location.find(
      {},
      { _id: 1, name: 1, country: 1, city: 1, day: 1 }
    ).limit(limit).skip(skip).sort({ createdAt: -1 }),
    Location.countDocuments()
  ])
    res.status(200).json({ status: "success", data: allItinerary , totalItinerary: totalItinerary });
  } catch (error) {
    console.log("Error in get all Hotels", error);
    next(error);
  }
};

export const getIteneraryById = async (req, res, next) => {
  try {
    const allItinerary = await Location.find({ _id: req.params.id });
    res.status(200).json({ status: "success", data: allItinerary });
  } catch (error) {
    console.log("Error in get all Hotels", error);
    next(error);
  }
};

export const updateItinerary = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, country, city, details, day } = req.body;

    const location = await Location.findById(id);
    if (!location) {
      return next(errorHandler(404, "Location not found"));
    }

    const oldImage = location.locationImage || "";
    let finalImage = oldImage;

    // Handle new file upload if any
    if (req.file) {
      // Delete old image from Cloudinary if it exists
      if (oldImage) {
        try {
          const publicId = oldImage
            .split("/upload/")[1]
            .replace(/^v\d+\//, "")
            .replace(/\.[^/.]+$/, "");
          await cloudinary.uploader.destroy(publicId);
        } catch (err) {
          console.error("Cloudinary delete failed:", err);
        }
      }

      // Upload new image
      const fileUri = getDataURI(req.file);
      const cloudinaryResponse = await cloudinary.uploader.upload(fileUri.content, {
        folder: "gallery",
      });
      finalImage = cloudinaryResponse.secure_url;
    }

    const updateData = {
      name,
      country,
      city,
      details,
      day: Number(day),
      locationImage: finalImage,
    };

    // Validate with Zod schema
    const { error: validationError } = itinerarySchema.safeParse({
      ...location.toObject(),
      ...updateData,
    });

    if (validationError) {
      const err = JSON.parse(validationError.message);
      return next(errorHandler(400, err[0].message));
    }

    const updatedLocation = await Location.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedLocation) {
      return next(errorHandler(404, "Location not found"));
    }

    res.status(200).json({
      status: "success",
      message: "Location updated successfully",
      data: updatedLocation,
    });
  } catch (error) {
    console.error("Update location error:", error);
    next(error);
  }
};

// export const updatePackage = async (req, res, next) => {
//   if (!req.user.isAdmin) {
//     return next(errorHandler(401, "Unauthorized"));
//   }

//   const updateFields = {
//     name: req.body.name,
//     description: req.body.description,
//     basePrice: req.body.basePrice,
//     durationDays: req.body.durationDays,
//     isRecommended: req.body.isRecommended,
//     bestSeason: req.body.bestSeason,
//     images: req.body.images,
//     country: req.body.country,
//     itinerary: req.body.itinerary,
//     availableHotels: req.body.availableHotels,
//     availableFoodOptions: req.body.availableFoodOptions,
//   };

//   const updateObject = Object.fromEntries(
//     Object.entries(updateFields).filter(([_, v]) => v !== undefined)
//   );

//   try {
//     const updatedPackage = await packageModel.findByIdAndUpdate(
//       req.params.id,
//       updateObject,
//       { new: true, runValidators: true }
//     );

//     if (!updatedPackage) {
//       return next(errorHandler(404, "Package not found"));
//     }

//     if (req.body.isRecommended !== undefined) {
//       await redisClient.del("recommended_packages");
//       console.log("Cleared recommended packages cache");
//     }

//     res.status(200).json({ status: "success", data: updatedPackage });
//   } catch (error) {
//     next(error);
//   }
// };

export const deleteItenerary = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(401, "Unauthorized"));
  }
  try {
    const deletedLocation = await Location.findByIdAndDelete(req.params.id);

    if (!deletedLocation) {
      return next(errorHandler(404, "Error in deleting Location..."));
    }

    res.status(204).json(null);
  } catch (error) {
    next(error);
  }
};


export const searchItnieraryByquery = async(req , res,next)=>{
  try {
    const query = req.query.name || req.query.country || req.query.city || req.query.day;
    const limit = 10;
    const page = req.query.page || 1;
    const skip = (page - 1) * limit;
    const filter = {
      $or: [
        { name: { $regex: query, $options: "i" } },
        { country: { $regex: query, $options: "i" } },
        { city: { $regex: query, $options: "i" } } ,
        { day: { $eq: req.query.day } }
      ]
    };
    const [data, total] = await Promise.all([
    Location.find(filter , 
       { _id: 1, name: 1, country: 1, city: 1, day: 1 })
       .limit(limit).skip(skip).sort({ createdAt: -1 }),
    Location.countDocuments(filter)
  ])

    res.status(200).json({status : "success" , data : data ,totalItinerary: total})
  } catch (error) {
    console.log("Error in search hotel by query", error);
    next(error);
  }
}

// Lightweight endpoint for searchable dropdown pickers
// GET /api/admin/locations/picker?q=...&limit=...
export const getItineraryPicker = async (req, res, next) => {
  try {
    const q = (req.query.q || "").toString().trim();
    const limit = Math.min(Number(req.query.limit || 50), 200);

    const filter = q
      ? {
          $or: [
            { name: { $regex: q, $options: "i" } },
            { country: { $regex: q, $options: "i" } },
            { city: { $regex: q, $options: "i" } },
          ],
        }
      : {};

    const data = await Location.find(
      filter,
      { _id: 1, name: 1, country: 1, city: 1, day: 1 }
    )
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({ status: "success", data });
  } catch (error) {
    console.log("Error in itinerary picker", error);
    next(error);
  }
};

// export const searchItnieraryByDay = async(req , res,next)=>{
//   try {
//     const query = req.query.day
//     const data = await Location.find({day : query} ,  { _id: 1, name: 1, country: 1, city: 1, day: 1 });
//     // res.status(200).json({status : "success" , data : data})
//     res.status(200).json({status : "success" , data : data})
//   } catch (error) {
//     console.log("Error in search hotel by query", error);
//     next(error);
//   }
// }
