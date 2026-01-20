import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchALLFoodOptions, fetchFoodOptionById, updateFoodOptionAPI } from "../api/FoodOptions";
import { setAllFoods, setSingleFoods, setTotalFoods } from "../redux/FoodOption";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetAllFoods = (page: number = 1, enabled: boolean = true) => {
  const dispatch = useDispatch();

  const { data: foodData, isLoading, isFetching } = useQuery({
    queryKey: ["foods", "list", page],
    queryFn: () => fetchALLFoodOptions(page),
    enabled: enabled,
  });

  useEffect(() => {
    if (foodData) {
      dispatch(setAllFoods(foodData.data || []));
      dispatch(setTotalFoods(foodData.totalFoods || 0));
    }
  }, [foodData, dispatch]);

  return { isLoading, isFetching };
};

export const useGetFoodsById = (id: string, enabled: boolean = true) => {
  const dispatch = useDispatch();
  const { data: foodData, isLoading, isFetching } = useQuery({
    queryKey: ["food", id],
    queryFn: () => fetchFoodOptionById(id),
    enabled: enabled && !!id,
  });

  useEffect(() => {
    if (foodData) {
      // Backend returns { msg: "...", data: [foodOption] } where foodOption is an array
      const food = Array.isArray(foodData.data) ? foodData.data[0] : foodData.data;
      dispatch(setSingleFoods(food || null));
    } else if (!enabled || !id) {
      dispatch(setSingleFoods(null));
    }
  }, [foodData, enabled, id, dispatch]);

  return { isLoading, isFetching };
};

export const useUpdateFoodOption = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: any }) => 
      updateFoodOptionAPI(id, formData),
    onSuccess: (data, variables) => {
      // Invalidate and refetch food queries
      queryClient.invalidateQueries({ queryKey: ["foods"] });
      queryClient.invalidateQueries({ queryKey: ["food", variables.id] });
      
      // Update Redux state if needed
      if (data) {
        const food = Array.isArray(data.data) ? data.data[0] : data.data;
        dispatch(setSingleFoods(food || null));
      }
    },
    onError: (error) => {
      console.error("Error updating food option:", error);
    },
  });
};
