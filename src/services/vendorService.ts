import api from "./api";

export interface Vendor {
  id: number;
  weddingId: string;
  name: string;
  category: string;
  contactName: string;
  phone: string;
  email: string;
  price: number;
  status: "cotando" | "contratado" | "pago" | "cancelado";
  notes: string;
}

export interface CreateVendorDTO {
  name: string;
  category: string;
  contactName: string;
  email: string;
  phone: string;
  status: "cotando" | "contratado" | "pago" | "cancelado";
  notes: string;
  price: number;
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
