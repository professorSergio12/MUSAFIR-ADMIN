import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchALLReviews, fetchReviewById, updateReviewCommentAPI } from "../api/reviews";
import { setAllReviews, setSingleReview, setTotalReviews } from "../redux/reviewsSlice";

export const useGetAllReviews = (
  page: number = 1,
  enabled: boolean = true,
  q: string = ""
) => {
  const dispatch = useDispatch();

  const { data: reviewsData, isLoading, isFetching } = useQuery({
    queryKey: ["reviews", "list", { page, q }],
    queryFn: () => fetchALLReviews(page, q),
    enabled,
  });

  useEffect(() => {
    if (reviewsData) {
      dispatch(setAllReviews(reviewsData.data || []));
      dispatch(setTotalReviews(reviewsData.totalReviews || 0));
    }
  }, [reviewsData, dispatch]);

  return { isLoading, isFetching };
};

export const useGetReviewById = (id: string, enabled: boolean = true) => {
  const dispatch = useDispatch();

  const { data: reviewData, isLoading, isFetching } = useQuery({
    queryKey: ["review", id],
    queryFn: () => fetchReviewById(id),
    enabled: enabled && !!id,
  });

  useEffect(() => {
    if (reviewData) {
      const review = Array.isArray(reviewData.data) ? reviewData.data[0] : reviewData.data;
      dispatch(setSingleReview(review || null));
    } else if (!enabled || !id) {
      dispatch(setSingleReview(null));
    }
  }, [reviewData, enabled, id, dispatch]);

  return { isLoading, isFetching };
};

export const useUpdateReviewComment = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, comment }: { id: string; comment: string }) =>
      updateReviewCommentAPI(id, comment),
    onSuccess: (data, variables) => {
      // Invalidate and refetch the single review
      queryClient.invalidateQueries({ queryKey: ["review", variables.id] });
      
      // Update Redux state if data is returned
      if (data?.data) {
        const review = Array.isArray(data.data) ? data.data[0] : data.data;
        dispatch(setSingleReview(review || null));
      }
    },
    onError: (error) => {
      console.error("Error updating review comment:", error);
    },
  });
};
