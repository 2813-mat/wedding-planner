import api from "./api";

export interface Gift {
  id: number;
  name: string;
  description: string;
  priority: "alta" | "media" | "baixa";
  price: number;
  url?: string;
  purchased: boolean;
  purchasedBy?: string;
}

export interface CreateGiftDTO {
  name: string;
  description: string;
  priority: "alta" | "media" | "baixa";
  price: number;
  url?: string;
  purchased?: boolean;
  purchasedBy?: string;
}

export const giftService = {
  async getAll(): Promise<Gift[]> {
    const response = await api.get("/gifts");
    return response.data;
  },

  async create(data: CreateGiftDTO): Promise<Gift> {
    const response = await api.post("/gifts", data);
    return response.data;
  },

  async update(id: number, data: Partial<CreateGiftDTO>): Promise<Gift> {
    const response = await api.put(`/gifts/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/gifts/${id}`);
  },
};
