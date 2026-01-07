import { FormEvent } from 'react';
import { validateInput } from '../conditions/validateInput';

import { showToast } from '../../alert/alertToast';
import { alertBasic } from '../../alert/alertBasic';
import { FormDataProps, ErrorLogProps, DataValidsProps } from '../../types/FormInterfaces';

/**
 * Kiểm tra tính hợp lệ của các trường trong form đăng nhập dựa trên các quy tắc đã định nghĩa.
 *
 * @param {Object} params - Đối tượng chứa các tham số cần thiết để xử lý submit.
 * @param {FormDataProps} params.formData - Dữ liệu đầu vào từ form (ví dụ: email, password).
 * @param {DataValidsProps} params.valids - Các quy tắc kiểm tra hợp lệ tương ứng với từng trường.
 * @param {React.Dispatch<React.SetStateAction<ErrorLogProps>>} params.setErrors - Hàm dùng để cập nhật lỗi cho từng trường.
 * 
 * @returns {boolean} Trả về `true` nếu tất cả các trường hợp lệ, ngược lại trả về `false`.
 */
export const checkValidSubmitUtils = (
  formData: { [key: string]: any },
  valids: DataValidsProps,
  setErrors: React.Dispatch<React.SetStateAction<ErrorLogProps>> | ((errors: ErrorLogProps) => void)
): boolean => {
  // e.preventDefault();
  let allValid = true;
  const newErrors = {};

  Object.keys(valids || {}).forEach((field) => {
    const result = validateInput(field, formData[field], valids[field], formData);
    Object.assign(newErrors, result);
    if (Object.values(result)[0]) allValid = false;
  });

  if (typeof setErrors === 'function') {
    if (setErrors.length === 1) {
      // setErrors là kiểu (errors) => void
      setErrors({
        ...(typeof (setErrors as any).prev === 'object' ? (setErrors as any).prev : {}),
        ...newErrors,
      });
    } else {
      // setErrors là React setState dạng (prev) => newState
      (setErrors as React.Dispatch<React.SetStateAction<ErrorLogProps>>)(prev => ({
        ...prev,
        ...newErrors
      }));
    }
  }

  return allValid;
};
