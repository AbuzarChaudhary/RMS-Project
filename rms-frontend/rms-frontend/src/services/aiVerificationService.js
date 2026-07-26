import { axiosClient } from '@/services/api/axiosClient';
import { ENDPOINTS } from '@/services/api/endpoints';

// AI defect-verification API. Sends the captured photo, returns a confidence result.
export const aiVerificationService = {
  // formData: FormData containing the image (+ optional returnId)
  verifyDefect: (formData) =>
    axiosClient
      .post(ENDPOINTS.ai.verifyDefect, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then((r) => r.data),
};
