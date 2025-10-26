import apiClient from './client';
import type { FormSection } from '../features/formBuilder/types';

// Define FormStructure locally since it's not exported from types
type FormStructure = FormSection[];

export interface FormData {
  id?: string;
  title: string;
  description?: string;
  structure: FormStructure;
  is_published?: boolean;
}

export const formService = {
  async getForms(): Promise<FormData[]> {
    const response = await apiClient.get('/forms');
    return response.data.data;
  },

  async getForm(id: string): Promise<FormData> {
    const response = await apiClient.get(`/forms/${id}`);
    return response.data.data;
  },

  async createForm(formData: Omit<FormData, 'id'>): Promise<FormData> {
    const response = await apiClient.post('/forms', formData);
    return response.data.data;
  },

  async updateForm(id: string, formData: Partial<FormData>): Promise<FormData> {
    const response = await apiClient.put(`/forms/${id}`, formData);
    return response.data.data;
  },

  async deleteForm(id: string): Promise<void> {
    await apiClient.delete(`/forms/${id}`);
  },

  async togglePublish(id: string): Promise<FormData> {
    const response = await apiClient.post(`/forms/${id}/toggle-publish`);
    return response.data.data;
  }
};
