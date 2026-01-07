import { createContext, useState, useContext, ReactNode } from "react";
import { loginSubmitApi } from "../api/LoginApi";
import { BasicUserTitle } from "../classes/BasicUserInfo";

/**
 * Kiểu context.
 */
type AuthContextType = {
  login: (userInput: string, password: string) => Promise<boolean>;
  logout: () => void;
  setToken: React.Dispatch<React.SetStateAction<string>>;
  getToken: () => string;
  token: string;
  user: BasicUserTitle;
  setUser: React.Dispatch<React.SetStateAction<BasicUserTitle>>;
};

// Dữ liệu người dùng mẫu
const mockUser = {
  id: "00001",
  name: "Dova",
  email: "abc@gmail.com",
  phone: "0123456789",
  password: "123456",
  role: 1,
  imageUrl: "https://data.designervn.net/2020/10/12608_8040b633df346bd3f1379ddb90490a64.png",
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string>("");
  const [user, setUser] = useState<BasicUserTitle>(new BasicUserTitle("", "", 0, ""));

  /**
   * Hàm đăng nhập kiểm tra dữ liệu đầu vào với mockUser.
   */
  const login = async (userInput: string, password: string): Promise<any> => {
    try{
      const result = await loginSubmitApi(userInput, password);
      if (result.success && result.token) {
        localStorage.setItem("token", result.token);
        setToken(result.token);
      }else{
        const errorJson = {
          status: 400,
          message: "Không tìm thấy các trường hợp lệ!"
        };
        throw errorJson;
      }
      return result
    }catch(error){
      logout();
      throw error;
    }
  };

  const logout = () => {
    setToken(""); 
    localStorage.removeItem("token");
  };

  const getToken = (): string => {
    const token = localStorage.getItem("token") || "";
    // console.log(token);
    return token;
  };


  return (
    <AuthContext.Provider value={{ login, logout, setToken, getToken, token, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook để truy cập AuthContext một cách an toàn.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
