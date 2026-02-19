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
  description?: string;
  price?: number;
  link?: string;
  imageUrl?: string;
}

interface GiftApiResponse {
  id: string;
  weddingId?: string;
  name: string;
  description: string;
  price: string | number;
  link?: string;
  imageUrl?: string;
  reservedBy?: string | null;
  purchased: boolean;
  priority?: "alta" | "media" | "baixa";
}

function mapApiGiftToGift(item: GiftApiResponse): Gift {
  return {
    id: Number(item.id),
    name: item.name,
    description: item.description,
    priority: item.priority ?? "media",
    price: typeof item.price === "string" ? parseFloat(item.price) : item.price,
    url: item.imageUrl ?? item.link,
    purchased: item.purchased,
    purchasedBy: item.reservedBy ?? undefined,
  };
}

export const giftService = {
  async getAll(): Promise<Gift[]> {
    const response = await api.get<GiftApiResponse[]>("/gifts");
    const data = Array.isArray(response.data) ? response.data : [];
    return data.map(mapApiGiftToGift);
  },

  async create(data: CreateGiftDTO): Promise<Gift> {
    const payload = {
      name: data.name,
      ...(data.description && { description: data.description }),
      ...(data.price != null && { price: data.price }),
      ...(data.link && { link: data.link }),
      ...(data.imageUrl && { imageUrl: data.imageUrl }),
    };
    const response = await api.post<GiftApiResponse>("/gifts", payload);
    return mapApiGiftToGift(response.data);
  },

  async update(id: number, data: Partial<CreateGiftDTO>): Promise<Gift> {
    const response = await api.put<GiftApiResponse>(`/gifts/${id}`, data);
    return mapApiGiftToGift(response.data);
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/gifts/${id}`);
  },
};
