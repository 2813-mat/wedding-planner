import api from "./api";

export interface Task {
  id: string;
  weddingId: string;
  title: string;
  completed: boolean;
  category: string;
  period: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskGroup {
  period: string;
  description: string;
  tasks: Task[];
}

export interface CreateTaskDTO {
  title: string;
  category: string;
  period: string;
  completed?: boolean;
}

export const checklistService = {
  async getAll(): Promise<TaskGroup[]> {
    const response = await api.get("/checklist");
    return response.data;
  },

  async create(data: CreateTaskDTO): Promise<Task> {
    const response = await api.post("/checklist/tasks", data);
    return response.data;
  },

  async update(id: string, data: Partial<CreateTaskDTO>): Promise<Task> {
    const response = await api.put(`/checklist/tasks/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/checklist/tasks/${id}`);
  },
};
