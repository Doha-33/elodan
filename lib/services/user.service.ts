import { apiClient } from '../api-client'
import { API_ENDPOINTS } from '../config'

export const userService = {
  async updateProfile(data: any): Promise<any> {
    
    let formData: FormData;
    
    if (data instanceof FormData) {
      formData = data;
    } else {
      formData = new FormData();
      // Append all properties from the data object to FormData
      Object.keys(data).forEach(key => {
        formData.append(key, data[key]);
      });
    }
    
    return apiClient.patchFormData(API_ENDPOINTS.users.updateProfile, formData);
  },

  async deleteAccount(): Promise<any> {
    return apiClient.delete(API_ENDPOINTS.users.deleteAccount)
  }
}