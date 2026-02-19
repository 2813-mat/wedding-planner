import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  honeymoonService,
  type CreateHoneymoonDTO,
  type Honeymoon,
  type HoneymoonViewModel,
} from "../services/honeymoonService";

const HONEYMOON_QUERY_KEY = ["honeymoon"];

export const useHoneymoon = () => {
  return useQuery<Honeymoon[], Error, HoneymoonViewModel[]>({
    queryKey: HONEYMOON_QUERY_KEY,
    queryFn: honeymoonService.getAll,
    select: (data) =>
      data.map((item) => ({
        ...item,
        budget: Number(item.budget),
      })),
  });
};

export const useCreateHoneymoon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateHoneymoonDTO) => honeymoonService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HONEYMOON_QUERY_KEY });
    },
  });
};

export const useUpdateHoneymoon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Partial<CreateHoneymoonDTO>;
    }) => honeymoonService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HONEYMOON_QUERY_KEY });
    },
  });
};

export const useDeleteHoneymoon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => honeymoonService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HONEYMOON_QUERY_KEY });
    },
  });
};
