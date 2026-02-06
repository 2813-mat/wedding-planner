import api from "./api";

export interface Vendor {
  id: number;
  name: string;
  category: string;
  email: string;
  phone: string;
  service: string;
  budget: number;
  status: "ativo" | "inativo";
}

export interface CreateVendorDTO {
  name: string;
  category: string;
  email: string;
  phone: string;
  service: string;
  budget: number;
  status?: "ativo" | "inativo";
}

export const vendorService = {
  async getAll(): Promise<Vendor[]> {
    const response = await api.get("/vendors");
    return response.data;
  },

  async create(data: CreateVendorDTO): Promise<Vendor> {
    const response = await api.post("/vendors", data);
    return response.data;
  },

  async update(id: number, data: Partial<CreateVendorDTO>): Promise<Vendor> {
    const response = await api.put(`/vendors/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/vendors/${id}`);
  },
};
