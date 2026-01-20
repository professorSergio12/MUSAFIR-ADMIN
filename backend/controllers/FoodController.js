import FoodOption from "../models/foodOption.model.js";
import { errorHandler } from "../util/error.js";
import { foodSchema } from "../validations/foodValidation.js";
import { getDataURI } from "../middleware/parser.js";
import cloudinary from "../config/cloudinary.js";
export const createMeal = async (req, res, next) => {
  const { name, surchargePerDay, foodOptions, description, image } = req.body;
  const file = req.file;
  const fileUri = getDataURI(file);

  // Upload to Cloudinary
  const cloudinaryResponse = await cloudinary.uploader.upload(fileUri.content, {
    folder: "gallery",
  });
  req.body.surchargePerDay = Number(surchargePerDay);
  req.body.image = cloudinary.secure_url;
  req.body.foodOptions = JSON.parse(foodOptions);

  const { error } = foodSchema.safeParse(req.body);
  if (error) {
    console.log(error);
    const err = JSON.parse(error.message);
    return next(errorHandler(400, err[0].message));
  }

  try {
    const newFood = new FoodOption({
      name,
      surchargePerDay: Number(surchargePerDay),
      foodOptions: JSON.parse(foodOptions),
      description,
      image: cloudinaryResponse.secure_url,
    });
    await newFood.save();
    res.status(201).json({ status: "success", data: "food created" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getALLFoods = async (req, res, next) => {
  const limit = 10;
  const page = req.query.page || 1;
  const skip = (page - 1) * limit;
  
  try {
    const [allFoods, totalFoods] = await Promise.all([
    FoodOption.find(
        {},
        {
          _id: 1,
          name: 1,
          surchargePerDay: 1,
          description: 1,
        }
      ).limit(limit).skip(skip).sort({ createdAt: -1 }),
      FoodOption.countDocuments()
    ])
      res.status(200).json({ status: "success", data: allFoods, totalFoods: totalFoods });
  } catch (error) {
    console.log("Error in get all Foods", error);
    next(error);
  }
};

export const getFoodById = async (req, res, next) => {
  try {
    const foodData = await FoodOption.findById(req.params.id);
    res.status(200).json({ status: "success", data: foodData });
  } catch (error) {
    console.log("Error in get food by id", error);
    next(error);
  }
};

export const updateFoodOption = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, surchargePerDay, foodOptions, description } = req.body;

    const parsedFoodOptions = req.body.foodOptions
      ? JSON.parse(req.body.foodOptions)
      : [];

    const food = await FoodOption.findById(id);
    if (!food) {
      return next(errorHandler(404, "Food option not found"));
    }

    const oldImage = food.image || "";
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
      surchargePerDay: Number(surchargePerDay),
      foodOptions: parsedFoodOptions,
      description,
      image: finalImage,
    };

    // Validate with Zod schema
    const { error: validationError } = foodSchema.safeParse({
      ...food.toObject(),
      ...updateData,
    });

    if (validationError) {
      const err = JSON.parse(validationError.message);
      return next(errorHandler(400, err[0].message));
    }

    const updatedFood = await FoodOption.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedFood) {
      return next(errorHandler(404, "Food option not found"));
    }

    res.status(200).json({
      status: "success",
      message: "Food option updated successfully",
      data: updatedFood,
    });
  } catch (error) {
    console.error("Update food option error:", error);
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

export const deleteMeal = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(401, "Unauthorized"));
  }
  try {
    const deletedMeal = await FoodOption.findByIdAndDelete(req.params.id);

    if (!deletedMeal) {
      return next(errorHandler(404, "Error in deleting Food Option..."));
    }

    res.status(204).json(null);
  } catch (error) {
    next(error);
  }
};


export const searchFoodByquery = async(req , res,next)=>{
  try {
    const query = req.query.name || req.query.description || req.query.type;
    const limit = 10;
    const page = req.query.page || 1;
    const skip = (page - 1) * limit;
    const filter = {
      $or: [
        { name: { $regex: query, $options: "i" } },
        {  description: { $regex: query, $options: "i" } },
        { "foodOptions.name": { $regex: query, $options: "i" } }
      ]
    };
    const [data, total] = await Promise.all([
       FoodOption.find(
        filter , {
          _id: 1,
          name: 1,
          surchargePerDay: 1,
          description: 1,
        }).limit(limit).skip(skip).sort({ createdAt: -1 }) ,
        FoodOption.countDocuments(filter)
      ])
    
    // res.status(200).json({status : "success" , data : data})
    res.status(200).json({status : "success" , data : data, totalFoods: total})
  } catch (error) {
    console.log("Error in search hotel by query", error);
    next(error);
  }
}

// Lightweight endpoint for searchable dropdown pickers
// GET /api/admin/food/picker?q=...&limit=...
export const getFoodPicker = async (req, res, next) => {
  try {
    const q = (req.query.q || "").toString().trim();
    const limit = Math.min(Number(req.query.limit || 50), 200);

    const filter = q
      ? {
          $or: [
            { name: { $regex: q, $options: "i" } },
            { description: { $regex: q, $options: "i" } },
            { "foodOptions.name": { $regex: q, $options: "i" } },
          ],
        }
      : {};

    const data = await FoodOption.find(
      filter,
      { _id: 1, name: 1, surchargePerDay: 1, description: 1 }
    )
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({ status: "success", data });
  } catch (error) {
    console.log("Error in food picker", error);
    next(error);
  }
};

// export const searchFoodByType = async(req , res,next)=>{
//   try {
//     const query = req.query.type

//     const data = await FoodOption.find(
//        // ✅ correct nested query
//       {
//         _id: 1,
//         name: 1,
//         surchargePerDay: 1,
//         description: 1,
//       }
//     );
//     // res.status(200).json({status : "success" , data : data})
//     res.status(200).json({status : "success" , data : data})
//   } catch (error) {
//     console.log("Error in search hotel by query", error);
//     next(error);
//   }
// }