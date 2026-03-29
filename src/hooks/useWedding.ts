import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { weddingService, type CreateWeddingDTO } from "../services/weddingService";

const WEDDING_QUERY_KEY = ["wedding", "my"];

export const useWedding = () => {
  return useQuery({
    queryKey: WEDDING_QUERY_KEY,
    queryFn: () => weddingService.getMy(),
  });
};

export const useUpdateWedding = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateWeddingDTO> }) =>
      weddingService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WEDDING_QUERY_KEY });
    },
  });
};
