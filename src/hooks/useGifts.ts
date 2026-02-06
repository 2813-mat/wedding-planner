import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { giftService, type CreateGiftDTO } from "../services/giftService";

const GIFTS_QUERY_KEY = ["gifts"];

export const useGifts = () => {
  return useQuery({
    queryKey: GIFTS_QUERY_KEY,
    queryFn: () => giftService.getAll(),
  });
};

export const useCreateGift = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateGiftDTO) => giftService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GIFTS_QUERY_KEY });
    },
  });
};

export const useUpdateGift = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateGiftDTO> }) =>
      giftService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GIFTS_QUERY_KEY });
    },
  });
};

export const useDeleteGift = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => giftService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GIFTS_QUERY_KEY });
    },
  });
};
