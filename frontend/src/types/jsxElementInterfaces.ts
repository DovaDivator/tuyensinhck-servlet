import { ReactNode } from "react";

/**
 * Giao diện mở rộng cho các hàm trả về JSX hoặc ReactNode cần áp dụng lớp CSS tùy chỉnh.
 *
 * @interface jsxEleProps
 * @property {string} [className] - Tên lớp CSS để áp dụng cho component.
 */
export interface jsxEleProps {
    className?: string;
  }

/**
 * Giao diện định nghĩa các thuộc tính cho component Background.
 *
 * @interface BackgroundProps
 * @extends jsxEleProps
 * @property {React.ReactNode} children - Nội dung sẽ được hiển thị bên trong component.
 * @property {number} [delay] - Độ trễ tùy chọn (tính bằng mili giây) cho hiệu ứng chuyển động hoặc hoạt ảnh.
 */
export interface BackgroundProps extends jsxEleProps {
    children: ReactNode;
    delay?: number;
  }