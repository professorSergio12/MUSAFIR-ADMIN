import axiosInstance from "./axiosInstance";

export const fetchALLReviews = async (
  page: number = 1,
  q: string = "",
): Promise<any> => {
  const data = await axiosInstance.get(
    `/api/admin/reviews?page=${page}&q=${encodeURIComponent(q)}`,
  );
  return data.data;
};

export const fetchReviewById = async (id: string): Promise<any> => {
  const data = await axiosInstance.get(`/api/admin/reviews/${id}`);
  return data.data;
};

export const updateReviewCommentAPI = async (
  id: string,
  comment: string,
): Promise<any> => {
  const data = await axiosInstance.put(`/api/admin/reviews/${id}/comment`, {
    comment,
  });
  return data.data;
};
