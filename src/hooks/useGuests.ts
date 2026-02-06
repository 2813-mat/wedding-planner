import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { guestService, type CreateGuestDTO } from "../services/guestService";

const GUESTS_QUERY_KEY = ["guests"];

export const useGuests = () => {
  return useQuery({
    queryKey: GUESTS_QUERY_KEY,
    queryFn: () => guestService.getAll(),
  });
};

export const useCreateGuest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateGuestDTO) => guestService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GUESTS_QUERY_KEY });
    },
  });
};

export const useUpdateGuest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateGuestDTO> }) =>
      guestService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GUESTS_QUERY_KEY });
    },
  });
};

export const useDeleteGuest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => guestService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GUESTS_QUERY_KEY });
    },
  });
};
