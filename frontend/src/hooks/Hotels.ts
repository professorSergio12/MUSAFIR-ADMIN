import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchALLHotels, fetchHotelsById, updateHotelAPI } from "../api/Hotels";
import { setAllHotels, setSingleHotel, setTotalHotels } from "../redux/HotelSlice";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetAllHotels = (page: number = 1, enabled: boolean = true) => {
  const dispatch = useDispatch();

  const { data: hotelData, isLoading, isFetching } = useQuery({
    queryKey: ["hotels", "list", page],
    queryFn: () => fetchALLHotels(page),
    enabled: enabled,
  });

  useEffect(() => {
    if (hotelData) {
      dispatch(setAllHotels(hotelData.data || []));
      dispatch(setTotalHotels(hotelData.totalHotels || 0));
    }
  }, [hotelData, dispatch]);

  return { isLoading, isFetching };
};

export const useGetHotelByID = (id: string, enabled: boolean = true) => {
  const dispatch = useDispatch();
  const { data: hotelData, isLoading, isFetching } = useQuery({
    queryKey: ["hotel", id],
    queryFn: () => fetchHotelsById(id),
    enabled: enabled && !!id,
  });

  useEffect(() => {
    if (hotelData) {
      // Backend returns { msg: "...", data: [hotel] } where hotel is an array
      const hotel = Array.isArray(hotelData.data) ? hotelData.data[0] : hotelData.data;
      dispatch(setSingleHotel(hotel || null));
    } else if (!enabled || !id) {
      dispatch(setSingleHotel(null));
    }
  }, [hotelData, enabled, id, dispatch]);

  return { isLoading, isFetching };
};



export const useUpdateHotel = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: any }) => 
      updateHotelAPI(id, formData),
    onSuccess: (data, variables) => {
      // Invalidate and refetch hotel queries
      queryClient.invalidateQueries({ queryKey: ["hotels"] });
      queryClient.invalidateQueries({ queryKey: ["hotel", variables.id] });
      
      // Update Redux state if needed
      if (data) {
        const hotel = Array.isArray(data.data) ? data.data[0] : data.data;
        dispatch(setSingleHotel(hotel || null));
      }
    },
    onError: (error) => {
      console.error("Error updating hotel:", error);
    },
  });
};