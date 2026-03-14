import api from "./api";

export interface Wedding {
  id: string;
  title: string;
  weddingDate: string; // ISO 8601
  location?: string;
  budgetTotal: string;
  coupleName1?: string;
  coupleName2?: string;
  createdAt: string;
  updatedAt: string;
}

export const weddingService = {
  async getMy(): Promise<Wedding[]> {
    const response = await api.get("/weddings/my");
    return response.data;
  },
};
