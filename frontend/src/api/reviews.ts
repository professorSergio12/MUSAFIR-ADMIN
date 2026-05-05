import axios from "axios";

export const fetchALLReviews = async (page: number = 1, q: string = ""): Promise<any> => {
  const data = await axios.get(
    `${import.meta.env.VITE_BACKEND_URL}/api/admin/reviews?page=${page}&q=${encodeURIComponent(q)}`
  );
  return data.data;
};

export const fetchReviewById = async (id:string): Promise<any> => {
  const data = await axios.get(
    `${import.meta.env.VITE_BACKEND_URL}/api/admin/reviews/${id}`
  );
  return data.data;
};

export const updateReviewCommentAPI = async (id: string, comment: string): Promise<any> => {
  const data = await axios.put(
    `${import.meta.env.VITE_BACKEND_URL}/api/admin/reviews/${id}/comment`,
    { comment }
  );
  return data.data;
};
