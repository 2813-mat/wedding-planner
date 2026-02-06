import api from "./api";

export interface Honeymoon {
  id: number;
  destination: string;
  name: string;
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  notes?: string;
  status: "planejando" | "confirmado" | "em_progresso" | "concluido";
  image: string;
}

export interface CreateHoneymoonDTO {
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  spent?: number;
  notes?: string;
  status?: "planejando" | "confirmado" | "em_progresso" | "concluido";
}

export const honeymoonService = {
  async getAll(): Promise<Honeymoon[]> {
    const response = await api.get("/honeymoon");
    return response.data;
  },

  async create(data: CreateHoneymoonDTO): Promise<Honeymoon> {
    const response = await api.post("/honeymoon", data);
    return response.data;
  },

  async update(
    id: number,
    data: Partial<CreateHoneymoonDTO>,
  ): Promise<Honeymoon> {
    const response = await api.put(`/honeymoon/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/honeymoon/${id}`);
  },
};
