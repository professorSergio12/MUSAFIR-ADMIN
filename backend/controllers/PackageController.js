import Package from "../models/package.model.js";
import { errorHandler } from "../util/error.js";
import { packageSchema } from "../validations/packageValidation.js";
import { getDataURI } from "../middleware/parser.js";
import cloudinary from "../config/cloudinary.js";

export const createPackage = async (req, res, next) => {
  try {

    const {
      name,
      description,
      basePrice,
      durationDays,
      bestSeason,
      country,
      isRecommended,
      itinerary,
      availableHotels,
      availableFoodOptions,
    } = req.body;

    
    const parseField = (value) => {
      if (!value) return [];
      if (Array.isArray(value)) return value;
      try {
        return JSON.parse(value);
      } catch {
        return [];
      }
    };

    
    let imageUrl = req.body.images || null;
    if (req.file) {
      const fileUri = getDataURI(req.file);
      const uploadRes = await cloudinary.uploader.upload(fileUri.content, {
        folder: "gallery",
      });
      imageUrl = uploadRes.secure_url;
    }

    
    const packageData = {
      name,
      description,
      basePrice: Number(basePrice),
      durationDays: Number(durationDays),
      bestSeason,
      country,
      images: imageUrl,
      isRecommended: isRecommended === "true" || isRecommended === true,
      itinerary: parseField(itinerary),
      availableHotels: parseField(availableHotels),
      availableFoodOptions: parseField(availableFoodOptions),
    };

    
    const { error } = packageSchema.safeParse(packageData);
    if (error) {
      return next(errorHandler(400, error.errors[0].message));
    }


    await Package.create(packageData);

    res.status(201).json({
      success: true,
      message: "Package created successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getAllPackage = async (req, res, next) => {
  try {
    const allPackage = await Package.find(
      {},
      {
        name: 1,
        basePrice: 1,
        durationDays: 1,
        images: 1,
        bestSeason: 1,
        country: 1,
        images: 1,
      }
    );
    res.status(200).json({ status: "success", data: allPackage });
  } catch (error) {
    console.log("Error in get all package", error);
    next(error);
  }
};

export const getPackageById = async (req, res, next) => {
  try {
    const packageData = await Package.findById(req.params.id)
      .populate("itinerary")
      .populate("availableHotels")
      .populate("availableFoodOptions");
    res.status(200).json({ status: "success", data: packageData });
  } catch (error) {
    console.log("Error in get package by id", error);
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

export const deletePaackage = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(401, "Unauthorized"));
  }
  try {
    const deletedpackage = await Package.findByIdAndDelete(req.params.id);

    if (!deletedpackage) {
      return next(errorHandler(404, "Error in deleting Packge..."));
    }

    res.status(204).json(null);
  } catch (error) {
    next(error);
  }
};

export const filterBySeasson = (req, res, next) => {
  const season = req.params.season;
  if (!req.user.isAdmin) {
    return next(errorHandler(401, "Unauthorized"));
  }

  try {
    const data = Package.find({ bestSeason: season }).sort({ bestSeason: 1 });
    res.status(200).json({ status: "success", data: data });
  } catch (error) {
    console.log(error);
  }
};

export const getTopPackages = async (req, res, next) => {
  try {
    // const data = await Package({} ,{} ).sort
  } catch (error) {
    console.log(error);
    next(error);
  }
};
