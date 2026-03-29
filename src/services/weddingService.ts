import api from "./api";

export interface Wedding {
  id: string;
  title: string;
  weddingDate: string; // ISO 8601
  location?: string;
  budgetTotal: string;
  coupleName1?: string;
  coupleName2?: string;
  guestLimit?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWeddingDTO {
  title: string;
  weddingDate: string;
  location?: string;
  budgetTotal?: number;
  coupleName1?: string;
  coupleName2?: string;
  guestLimit?: number | null;
}

export const weddingService = {
  async getMy(): Promise<Wedding[]> {
    const response = await api.get("/weddings/my");
    return response.data;
  },

  async getAll(): Promise<Wedding[]> {
    const response = await api.get("/weddings");
    return response.data;
  },

  async create(data: CreateWeddingDTO): Promise<Wedding> {
    const response = await api.post<Wedding>("/weddings", data);
    return response.data;
  },

  async update(id: string, data: Partial<CreateWeddingDTO>): Promise<Wedding> {
    const response = await api.put<Wedding>(`/weddings/${id}`, data);
    return response.data;
  },

  async join(id: string): Promise<void> {
    await api.post(`/weddings/${id}/join`);
  },
};
