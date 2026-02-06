import api from "./api";

export interface Guest {
  id: number;
  name: string;
  email: string;
  phone: string;
  category: "familia_noiva" | "familia_noivo" | "amigos" | "trabalho";
  status: "confirmado" | "pendente" | "nao_vai";
  guests: number;
}

export interface CreateGuestDTO {
  name: string;
  email: string;
  phone: string;
  category: "familia_noiva" | "familia_noivo" | "amigos" | "trabalho";
  status?: "confirmado" | "pendente" | "nao_vai";
  guests?: number;
}

export const guestService = {
  async getAll(): Promise<Guest[]> {
    const response = await api.get("/guests");
    return response.data;
  },

  async create(data: CreateGuestDTO): Promise<Guest> {
    const response = await api.post("/guests", data);
    return response.data;
  },

  async update(id: number, data: Partial<CreateGuestDTO>): Promise<Guest> {
    const response = await api.put(`/guests/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/guests/${id}`);
  },
};
