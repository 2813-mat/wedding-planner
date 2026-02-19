import api from "./api";

export interface Honeymoon {
  id: string;
  weddingId: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  budget: string;
  notes?: string;
  status: "planejando" | "confirmado" | "em_progresso" | "concluido";
  createdAt: string;
  updatedAt: string;
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

export interface HoneymoonViewModel extends Omit<Honeymoon, "budget"> {
  budget: number;
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
