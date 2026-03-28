import api from "./api";

export interface BudgetPayment {
  id: string;
  weddingId: string;
  categoryId: string;
  categoryName: string;
  amount: number;
  date: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaymentDTO {
  categoryId: string;
  amount: number;
  date: string;
  description?: string;
}

export const paymentService = {
  async getAll(): Promise<BudgetPayment[]> {
    const response = await api.get("/budget/payments");
    return response.data;
  },

  async create(data: CreatePaymentDTO): Promise<BudgetPayment> {
    const response = await api.post("/budget/payments", data);
    return response.data;
  },

  async update(
    id: string,
    data: Partial<CreatePaymentDTO>,
  ): Promise<BudgetPayment> {
    const response = await api.put(`/budget/payments/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/budget/payments/${id}`);
  },
};
