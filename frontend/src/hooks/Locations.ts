import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setAllLocation, setSingleLocation, setTotalItinerary } from "../redux/Locations";
import { fetchALocation, fetchLocationById, updateItineraryAPI } from "../api/Locations";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetAllLocation = (page: number = 1, enabled: boolean = true) => {
  const dispatch = useDispatch();

  const { data: locationData, isLoading, isFetching } = useQuery({
    queryKey: ["locations", "list", page],
    queryFn: () => fetchALocation(page),
    enabled: enabled,
  });

  useEffect(() => {
    if (locationData) {
      dispatch(setAllLocation(locationData.data || []));
      dispatch(setTotalItinerary(locationData.totalItinerary || 0));
    }
  }, [locationData, dispatch]);

  return { isLoading, isFetching };
};

export const useGetLocationById = (id: string, enabled: boolean = true) => {
  const dispatch = useDispatch();
  const { data: locationData, isLoading, isFetching } = useQuery({
    queryKey: ["location", id],
    queryFn: () => fetchLocationById(id),
    enabled: enabled && !!id,
  });

  useEffect(() => {
    if (locationData) {
      // Backend returns { msg: "...", data: [location] } where location is an array
      const location = Array.isArray(locationData.data) ? locationData.data[0] : locationData.data;
      dispatch(setSingleLocation(location || null));
    } else if (!enabled || !id) {
      dispatch(setSingleLocation(null));
    }
  }, [locationData, enabled, id, dispatch]);

  return { isLoading, isFetching };
};

export const useUpdateItinerary = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: any }) => 
      updateItineraryAPI(id, formData),
    onSuccess: (data, variables) => {
      // Invalidate and refetch location queries
      queryClient.invalidateQueries({ queryKey: ["locations"] });
      queryClient.invalidateQueries({ queryKey: ["location", variables.id] });
      
      // Update Redux state if needed
      if (data) {
        const location = Array.isArray(data.data) ? data.data[0] : data.data;
        dispatch(setSingleLocation(location || null));
      }
    },
    onError: (error) => {
      console.error("Error updating itinerary:", error);
    },
  });
};
