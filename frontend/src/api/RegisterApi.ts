import { hashPassword } from "../function/convert/hashPassword";
import { FormDataProps } from "../types/FormInterfaces";

export const registerSubmitApi = async (formData: FormDataProps): Promise<any> => {
  try {
    // Chỉ lấy các trường cần thiết
    const { name, email, phone, password } = formData;

    if (!name && !email && !phone && !password) {
      throw new Error('Dữ liệu bị thiếu!');
    }

    const hashedPassword = await hashPassword(String(password));
    const dataToSend = { name, email, phone, password: hashedPassword };

    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSend),
    });
    const result = await response.json();
    if (!response.ok) {
      const errorJson = {
        status: response.status,
        message: result.message
      };
      console.error(errorJson);
      throw errorJson;
    }
    // console.log('Phản hồi từ servlet:', result);
    return result;

  } catch (error) {
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      throw {
        status: 503,
        message: 'Không thể kết nối đến máy chủ.'
      };
    }
    throw error;
  }
};