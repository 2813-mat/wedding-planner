import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  checklistService,
  type CreateTaskDTO,
} from "../services/checklistService";

const CHECKLIST_QUERY_KEY = ["checklist"];

export const useChecklist = () => {
  return useQuery({
    queryKey: CHECKLIST_QUERY_KEY,
    queryFn: () => checklistService.getAll(),
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTaskDTO) => checklistService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHECKLIST_QUERY_KEY });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateTaskDTO> }) =>
      checklistService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHECKLIST_QUERY_KEY });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => checklistService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHECKLIST_QUERY_KEY });
    },
  });
};
