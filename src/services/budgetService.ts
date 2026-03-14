import api from "./api";

export interface BudgetCategory {
  id: string;
  weddingId: string;
  name: string;
  planned: number;
  spent: number;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBudgetCategoryDTO {
  name: string;
  planned: number;
  color: string;
  spent?: number;
}

export const budgetService = {
  async getAll(): Promise<BudgetCategory[]> {
    const response = await api.get("/budget/categories");
    return response.data;
  },

  async create(data: CreateBudgetCategoryDTO): Promise<BudgetCategory> {
    const response = await api.post("/budget/categories", data);
    return response.data;
  },

  async update(
    id: string,
    data: Partial<CreateBudgetCategoryDTO>,
  ): Promise<BudgetCategory> {
    const response = await api.put(`/budget/categories/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/budget/categories/${id}`);
  },
};
