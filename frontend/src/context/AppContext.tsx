import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  Dispatch,
  SetStateAction, JSX
} from 'react';
import { useContext } from 'react';

/**
 * Giao diện cho kích thước màn hình
 */
interface ScreenSize {
  width: number;
  height: number;
}

/**
 * Giao diện cho giá trị Context
 */
interface AppContextType {
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  isTooSmall: boolean;
  screenSize: ScreenSize;
}

/**
 * Context chứa thông tin chung cho toàn ứng dụng
 */
export const AppContext = createContext<AppContextType | undefined>(undefined);

/**
 * Props của AppProvider - nhận children React node
 */
interface AppProviderProps {
  children: ReactNode;
}

/**
 * Component AppProvider cung cấp context cho toàn bộ ứng dụng
 * @param {ReactNode} children - Các thành phần con bên trong provider
 * @returns JSX.Element
 */
export const AppProvider = ({ children }: AppProviderProps): JSX.Element => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isTooSmall, setIsTooSmall] = useState<boolean>(false);
  const [screenSize, setScreenSize] = useState<ScreenSize>({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    /**
     * Cập nhật kích thước màn hình và trạng thái isTooSmall
     */
    const checkScreenSize = (): void => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      // setScreenSize({ width, height });

      setIsTooSmall(width < 250 || height < 250);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  return (
    <AppContext.Provider
      value={{ isLoading, setIsLoading, screenSize, isTooSmall }}
    >
      {children}
    </AppContext.Provider>
  );
};

/**
 * Hook để sử dụng AppContext
 * @returns {AppContextType} - Trả về giá trị context
 * @throws {Error} - Nếu hook được sử dụng ngoài AppProvider
 */
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
