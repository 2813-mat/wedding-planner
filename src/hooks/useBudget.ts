import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  budgetService,
  type CreateBudgetCategoryDTO,
} from "../services/budgetService";
import {
  paymentService,
  type CreatePaymentDTO,
} from "../services/paymentService";

const PAYMENTS_QUERY_KEY = ["budget", "payments"];

const BUDGET_QUERY_KEY = ["budget", "categories"];

export const useBudgetCategories = () => {
  return useQuery({
    queryKey: BUDGET_QUERY_KEY,
    queryFn: () => budgetService.getAll(),
  });
};

export const useCreateBudgetCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBudgetCategoryDTO) => budgetService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BUDGET_QUERY_KEY });
    },
  });
};

export const useUpdateBudgetCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreateBudgetCategoryDTO>;
    }) => budgetService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BUDGET_QUERY_KEY });
    },
  });
};

export const useDeleteBudgetCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => budgetService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BUDGET_QUERY_KEY });
    },
  });
};

export const usePayments = () => {
  return useQuery({
    queryKey: PAYMENTS_QUERY_KEY,
    queryFn: () => paymentService.getAll(),
  });
};

export const useCreatePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePaymentDTO) => paymentService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PAYMENTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: BUDGET_QUERY_KEY });
    },
  });
};

export const useDeletePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => paymentService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PAYMENTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: BUDGET_QUERY_KEY });
    },
  });
};
