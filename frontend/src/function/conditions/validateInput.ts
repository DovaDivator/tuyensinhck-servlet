import { FormDataProps, ValidateRule } from '../../types/FormInterfaces';

/**
 * Hàm kiểm tra giá trị đầu vào dựa trên loại validation đã chỉ định.
 *
 * @param {string} name - Tên của trường dữ liệu cần kiểm tra.
 * @param {string | number | boolean | undefined} value - Giá trị đầu vào cần được kiểm tra.
 * @param {DataValidsProps} valid - Đối tượng xác thực, trong đối tượng phải có hàm validate.
 * @param {FormDataProps} [formData] - (Tùy chọn) Dữ liệu biểu mẫu hiện tại, được sử dụng nếu cần xác thực phức tạp hơn.
 * @returns {{ [key: string]: string }} - Trả về một đối tượng chứa thông báo lỗi nếu có. Khóa là tên trường, giá trị là thông báo lỗi.
 *
 */
export const validateInput = (
  name: string,
  value: string | string[] | undefined,
  valid: ValidateRule,
  formData?: FormDataProps
): { [key: string]: string } => {
  try {
    return valid.validate(name, value, formData);
  } catch (error) {
    console.error('Lỗi xác thực:', error);
    return { [name]: 'Đã xảy ra lỗi xác thực. Vui lòng thử lại.' };
  }
};