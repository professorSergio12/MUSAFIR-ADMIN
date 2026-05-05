import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchALLBookings, fetchBookingById } from "../api/Bookings";
import { setAllBoking, setSingleBooking } from "../redux/BookingSlice";

export const useGetAllBookings = () => {
  const dispatch = useDispatch();
  const fetchData = async () => {
    const data = await fetchALLBookings();
    console.log(data.data);
    dispatch(setAllBoking(data.data));
  };

  useEffect(() => {
    fetchData();
  }, [dispatch]);
};

export const useGetBookignById = (id :string) => {
  const dispatch = useDispatch();
  const fetchData = async () => {
    const data = await fetchBookingById(id);
    dispatch(setSingleBooking(data.data));
  };

  useEffect(() => {
    fetchData();
  }, []);
};
