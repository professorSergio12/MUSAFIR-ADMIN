import { useState, useEffect, useRef } from "react";
import { Plus, Upload, X, Edit2, Trash2, Loader2, Image as ImageIcon } from "lucide-react";
import {
  fetchAllGalleryImages,
  uploadGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
  type GalleryImage,
} from "../../api/Gallery";

export default function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  const [uploadForm, setUploadForm] = useState({
    image: null as File | null,
    imagePreview: "",
    caption: "",
    location: "",
  });

  const [editForm, setEditForm] = useState({
    image: null as File | null,
    imagePreview: "",
    caption: "",
    location: "",
  });

  // Fetch all images
  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      setIsLoading(true);
      const data = await fetchAllGalleryImages();
      setImages(data);
    } catch (error) {
      console.error("Error loading images:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle file selection for upload
  const handleUploadFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const preview = URL.createObjectURL(file);
      setUploadForm((prev) => ({
        ...prev,
        image: file,
        imagePreview: preview,
      }));
    }
  };

  // Handle file selection for edit
  const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const preview = URL.createObjectURL(file);
      setEditForm((prev) => ({
        ...prev,
        image: file,
        imagePreview: preview,
      }));
    }
  };

  // Handle upload
  const handleUpload = async () => {
    if (!uploadForm.image) return;

    try {
      setIsUploading(true);
      await uploadGalleryImage(
        uploadForm.image,
        uploadForm.caption || undefined,
        uploadForm.location || undefined
      );
      await loadImages();
      setShowUploadModal(false);
      resetUploadForm();
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // Handle edit
  const handleEdit = async () => {
    if (!selectedImage) return;

    try {
      setIsUploading(true);
      await updateGalleryImage(
        selectedImage._id,
        editForm.image || undefined,
        editForm.caption || undefined,
        editForm.location || undefined
      );
      await loadImages();
      setShowEditModal(false);
      setSelectedImage(null);
      resetEditForm();
    } catch (error) {
      console.error("Error updating image:", error);
      alert("Failed to update image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    try {
      await deleteGalleryImage(id);
      await loadImages();
    } catch (error) {
      console.error("Error deleting image:", error);
      alert("Failed to delete image. Please try again.");
    }
  };

  // Open edit modal
  const openEditModal = (image: GalleryImage) => {
    setSelectedImage(image);
    setEditForm({
      image: null,
      imagePreview: image.imageUrl,
      caption: image.caption || "",
      location: image.location || "",
    });
    setShowEditModal(true);
  };

  // Reset forms
  const resetUploadForm = () => {
    if (uploadForm.imagePreview) {
      URL.revokeObjectURL(uploadForm.imagePreview);
    }
    setUploadForm({
      image: null,
      imagePreview: "",
      caption: "",
      location: "",
    });
  };

  const resetEditForm = () => {
    if (editForm.imagePreview && editForm.image) {
      URL.revokeObjectURL(editForm.imagePreview);
    }
    setEditForm({
      image: null,
      imagePreview: "",
      caption: "",
      location: "",
    });
  };

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      if (uploadForm.imagePreview) {
        URL.revokeObjectURL(uploadForm.imagePreview);
      }
      if (editForm.imagePreview && editForm.image) {
        URL.revokeObjectURL(editForm.imagePreview);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Gallery</h1>
          <p className="mt-1 text-sm text-slate-600">
            Manage and organize your gallery images
          </p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
        >
          <Plus className="w-4 h-4" />
          Upload Image
        </button>
      </div>

      {/* Images Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
      ) : images.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <ImageIcon className="mb-4 w-16 h-16 text-slate-400" />
          <p className="text-lg font-medium text-slate-600">No images yet</p>
          <p className="mt-1 text-sm text-slate-500">
            Upload your first image to get started
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {images.map((image) => (
            <div
              key={image._id}
              className="group relative overflow-hidden rounded-xl bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              {/* Image */}
              <div className="aspect-square overflow-hidden bg-slate-100">
                <img
                  src={image.imageUrl}
                  alt={image.caption || "Gallery image"}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              </div>

              {/* Overlay Actions */}
              <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  onClick={() => openEditModal(image)}
                  className="rounded-lg bg-white/90 p-2 text-slate-700 transition-colors hover:bg-white"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(image._id)}
                  className="rounded-lg bg-red-500/90 p-2 text-white transition-colors hover:bg-red-600"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Caption */}
              {(image.caption || image.location) && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                  {image.caption && (
                    <p className="text-sm font-medium text-white">
                      {image.caption}
                    </p>
                  )}
                  {image.location && (
                    <p className="mt-1 text-xs text-white/80">{image.location}</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 p-6">
              <h2 className="text-xl font-semibold text-slate-900">
                Upload Image
              </h2>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  resetUploadForm();
                }}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Image Preview */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Image
                </label>
                {uploadForm.imagePreview ? (
                  <div className="relative">
                    <img
                      src={uploadForm.imagePreview}
                      alt="Preview"
                      className="h-64 w-full rounded-lg object-cover"
                    />
                    <button
                      onClick={() => {
                        if (uploadForm.imagePreview) {
                          URL.revokeObjectURL(uploadForm.imagePreview);
                        }
                        setUploadForm((prev) => ({
                          ...prev,
                          image: null,
                          imagePreview: "",
                        }));
                      }}
                      className="absolute right-2 top-2 rounded-full bg-red-500 p-1.5 text-white hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-8 transition-colors hover:border-indigo-400 hover:bg-slate-100"
                  >
                    <Upload className="mb-2 w-8 h-8 text-slate-400" />
                    <p className="text-sm font-medium text-slate-600">
                      Click to upload image
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      PNG, JPG, GIF up to 5MB
                    </p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleUploadFileChange}
                  className="hidden"
                />
              </div>

              {/* Caption */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Caption (Optional)
                </label>
                <input
                  type="text"
                  value={uploadForm.caption}
                  onChange={(e) =>
                    setUploadForm((prev) => ({ ...prev, caption: e.target.value }))
                  }
                  placeholder="Enter image caption"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                />
              </div>

              {/* Location */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Location (Optional)
                </label>
                <input
                  type="text"
                  value={uploadForm.location}
                  onChange={(e) =>
                    setUploadForm((prev) => ({ ...prev, location: e.target.value }))
                  }
                  placeholder="Enter location"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-slate-200 p-6">
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  resetUploadForm();
                }}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={!uploadForm.image || isUploading}
                className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading && <Loader2 className="w-4 h-4 animate-spin" />}
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 p-6">
              <h2 className="text-xl font-semibold text-slate-900">
                Edit Image
              </h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedImage(null);
                  resetEditForm();
                }}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Image Preview */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Image
                </label>
                <div className="relative">
                  <img
                    src={editForm.imagePreview}
                    alt="Preview"
                    className="h-64 w-full rounded-lg object-cover"
                  />
                  <button
                    onClick={() => editFileInputRef.current?.click()}
                    className="absolute right-2 top-2 rounded-lg bg-white/90 px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-white"
                  >
                    Change Image
                  </button>
                </div>
                <input
                  ref={editFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleEditFileChange}
                  className="hidden"
                />
              </div>

              {/* Caption */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Caption
                </label>
                <input
                  type="text"
                  value={editForm.caption}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, caption: e.target.value }))
                  }
                  placeholder="Enter image caption"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                />
              </div>

              {/* Location */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Location
                </label>
                <input
                  type="text"
                  value={editForm.location}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, location: e.target.value }))
                  }
                  placeholder="Enter location"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-slate-200 p-6">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedImage(null);
                  resetEditForm();
                }}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleEdit}
                disabled={isUploading}
                className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading && <Loader2 className="w-4 h-4 animate-spin" />}
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
