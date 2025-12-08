import axiosInstance from '@/app/config/axiosConfig'
import { API_ENDPOINTS } from '@/app/api/endpoints'

export const dashboardStatsService = async () => {
  const response = await axiosInstance.get(API_ENDPOINTS.DASHBOARD_STATS)
  return response.data.content
}
