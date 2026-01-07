/**
 * Định nghĩa kiểu dữ liệu cho tiêu đề bảng.
 * 
 * Mỗi key tương ứng với một cột, và giá trị là chuỗi hiển thị (label).
 * Có thể sử dụng để ánh xạ key -> tiêu đề hiển thị trong bảng.
 *
 * Ví dụ:
 * {
 *   name: "Họ tên",
 *   email: "Email",
 *   role: "Vai trò"
 * }
 */
export interface HeaderProps {
    [key: string]: string | undefined;
  }
  
  
  /**
   * Định nghĩa dữ liệu của một dòng trong bảng.
   * 
   * Mỗi key tương ứng với một cột dữ liệu.
   * Có thể có thêm key `link` nếu cần click vào dòng để điều hướng.
   * 
   * Ví dụ:
   * {
   *   name: "Nguyễn Văn A",
   *   email: "a@gmail.com",
   *   role: "Admin",
   *   link: "/chi-tiet/1"
   * }
   */
  export interface RowData {
    link?: string;
    [key: string]: any;
  }