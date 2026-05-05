import Hotel from "../models/hotel.model.js";
const exportALLHotelData = async (req, res) => {
  const hotelData = await Hotel.find({});

  // send this data in chunks to avoid memory overload

  //  download as csv file from the server

  // send response to client
};

const exportHotel
