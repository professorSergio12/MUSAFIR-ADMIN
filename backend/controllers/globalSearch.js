import Hotel from "../models/hotel.model.js";
import Package from "../models/package.model.js";
import Location from "../models/location.model.js";

export const globalSearch = async (req, res, next) => {
  try {
    const search = req.query.q?.trim();
    if (!search) {
      return res.json({ hotels: [], packages: [], locations: [] });
    }

    const hotels = await Hotel.aggregate([
      {
        $search: {
          index: "searchHotel",
          compound: {
            should: [
              {
                autocomplete: {
                  query: search,
                  path: "name",
                  fuzzy: { maxEdits: 1 },
                },
              },
              {
                autocomplete: {
                  query: search,
                  path: "city",
                  fuzzy: { maxEdits: 1 },
                },
              },
            ],
          },
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          city: 1,
          country: 1,
        },
      },
      { $limit: 2 },
    ]);

    const packages = await Package.aggregate([
      {
        $search: {
          index: "packageSearch",
          compound: {
            should: [
              {
                autocomplete: {
                  query: search,
                  path: "name",
                  fuzzy: { maxEdits: 1 },
                },
              },
              {
                autocomplete: {
                  query: search,
                  path: "country",
                  fuzzy: { maxEdits: 1 },
                },
              },
            ],
          },
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          country: 1,
        },
      },
      { $limit: 2 },
    ]);

    const locations = await Location.aggregate([
      {
        $search: {
          index: "LocationSearch",
          compound: {
            should: [
              {
                autocomplete: {
                  query: search,
                  path: "name",
                  fuzzy: { maxEdits: 1 },
                },
              },
              {
                autocomplete: {
                  query: search,
                  path: "country",
                  fuzzy: { maxEdits: 1 },
                },
              },
            ],
          },
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          city: 1,
          country: 1,
        },
      },
      { $limit: 2 },
    ]);

    res.json({
      hotels,
      packages,
      locations,
    });
  } catch (error) {
    console.error("Error in global search", error);
    next(error);
  }
};
