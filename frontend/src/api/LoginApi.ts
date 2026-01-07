import { hashPassword } from "../function/convert/hashPassword";

export const loginSubmitApi = async (userInput: string, password: string): Promise<any> => {
  try {
    const hashedPassword = await hashPassword(String(password));
    const dataToSend = { username: userInput, password: hashedPassword};

    const response = await fetch('http://localhost:8080/api/login', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      
      body: JSON.stringify(dataToSend),
    });
    const result = await response.json();
    // console.log(JSON.stringify(result, null, 2));
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