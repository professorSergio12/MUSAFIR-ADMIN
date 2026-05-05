import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchALLPackages, fetchPackageById, createPackageAPI } from "../api/Packages";
import { setAllPackage, setSinglePackage } from "../redux/packagesSlice";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetAllPackages = (enabled: boolean = true) => {
  const dispatch = useDispatch();

  const { data: pkgData, isLoading, isFetching } = useQuery({
    queryKey: ["packages", "list"],
    queryFn: () => fetchALLPackages(),
    enabled,
  });

  useEffect(() => {
    if (pkgData) {
      dispatch(setAllPackage(pkgData.data || []));
    }
  }, [pkgData, dispatch]);

  return { isLoading, isFetching };
};

export const useGetPackageById = (id: string, enabled: boolean = true) => {
  const dispatch = useDispatch();

  const { data: pkgData, isLoading, isFetching } = useQuery({
    queryKey: ["package", id],
    queryFn: () => fetchPackageById(id),
    enabled: enabled && !!id,
  });

  useEffect(() => {
    if (pkgData) {
      // Backend returns { status: "success", data: packageObject }
      // (fallback if it's an array for any older response shape)
      const pkg = Array.isArray(pkgData.data) ? pkgData.data[0] : pkgData.data;
      dispatch(setSinglePackage(pkg || null));
    } else if (!enabled || !id) {
      dispatch(setSinglePackage(null));
    }
  }, [pkgData, enabled, id, dispatch]);

  return { isLoading, isFetching };
};

export const useCreatePackage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: any) => createPackageAPI(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["packages"] });
    },
    onError: (error) => {
      console.error("Error creating package:", error);
    },
  });
};
