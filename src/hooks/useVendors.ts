import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { vendorService, type CreateVendorDTO } from "../services/vendorService";

const VENDORS_QUERY_KEY = ["vendors"];

export const useVendors = () => {
  return useQuery({
    queryKey: VENDORS_QUERY_KEY,
    queryFn: () => vendorService.getAll(),
  });
};

export const useCreateVendor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateVendorDTO) => vendorService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VENDORS_QUERY_KEY });
    },
  });
};

export const useUpdateVendor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Partial<CreateVendorDTO>;
    }) => vendorService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VENDORS_QUERY_KEY });
    },
  });
};

export const useDeleteVendor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => vendorService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VENDORS_QUERY_KEY });
    },
  });
};
