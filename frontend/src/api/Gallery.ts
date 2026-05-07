import axiosInstance from "./axiosInstance";

export interface GalleryImage {
  _id: string;
  userId?: string;
  imageUrl: string;
  caption?: string;
  location?: string;
  tags?: string[];
  uploadedAt: string;
}

export const fetchAllGalleryImages = async (): Promise<GalleryImage[]> => {
  const data = await axiosInstance.get("/api/admin/gallery");
  return data.data.data;
};

export const uploadGalleryImage = async (
  file: File,
  caption?: string,
  location?: string,
  tags?: string[],
): Promise<GalleryImage> => {
  const formData = new FormData();
  formData.append("image", file);
  if (caption) formData.append("caption", caption);
  if (location) formData.append("location", location);
  if (tags) formData.append("tags", JSON.stringify(tags));

  const data = await axiosInstance.post(
    "/api/admin/gallery/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return data.data.data;
};

export const updateGalleryImage = async (
  id: string,
  file?: File,
  caption?: string,
  location?: string,
  tags?: string[],
): Promise<GalleryImage> => {
  const formData = new FormData();
  if (file) formData.append("image", file);
  if (caption !== undefined) formData.append("caption", caption);
  if (location !== undefined) formData.append("location", location);
  if (tags !== undefined) formData.append("tags", JSON.stringify(tags));

  const data = await axiosInstance.put(
    `/api/admin/gallery/update/${id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return data.data.data;
};

export const deleteGalleryImage = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/api/admin/gallery/delete/${id}`);
};
