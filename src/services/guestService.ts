import api from "./api";

export interface Guest {
  id: string;
  weddingId: string;
  userId: string | null;
  fullName: string;
  email: string;
  phone: string;
  relation: string;
  groupName: string;
  plusOne: boolean;
  confirmed: number | null;
  adults: number;
  children: number;
  invitationSentAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGuestDTO {
  fullName: string;
  email?: string;
  phone?: string;
  relation?: string;
  groupName?: string;
  plusOne?: boolean;
  confirmed?: number;
  adults?: number;
  children?: number;
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
