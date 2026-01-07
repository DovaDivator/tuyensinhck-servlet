import { BasicUserInfo, BasicUserTitle } from "../classes/BasicUserInfo";

export const getUserSession = async (token: string): Promise<BasicUserTitle> => {
  try {
    const result = await getUserApi(token, "get-session");
    const user = new BasicUserTitle(
      result.data.id,
      result.data.name,
      result.data.role,
      result.data.avatarImg ?? ""
    );
    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const getBasicUserInfo = async (token: string): Promise<BasicUserInfo> => {
  try {
    const result = await getUserApi(token, "get-user-info");
    const user = new BasicUserInfo(
      result.data.id,
      result.data.name,
      result.data.role,
      result.data.avatarImg ?? "",
      result.data.email,
      result.data.phone ?? "",
      result.data.created_at
    );
    return user;
  } catch (error) {
    throw error;
  }
}

const getUserApi = async (token: string, url: string): Promise<any> => {
  try {
    const response = await fetch('/api/' + url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include'   // <-- BẮT BUỘC để gửi JSESSIONID
    });
    const text = await response.text();
    const result = await JSON.parse(text);
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