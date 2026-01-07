import { validateText } from '../function/conditions/validateText';
import { FormDataProps } from '../types/FormInterfaces';

interface InputValidsProps {
  minlength?: number;
  required?: boolean;
  match?: string;
  matchType?: string[];
}

/**
   * Tạo một đối tượng `InputValids` mới với các quy tắc xác thực đã chỉ định.
   * 
   * @param {InputValidsProps} [param0] - Cấu hình cho xác thực đầu vào.
   * @param {number} [param0.minlength=0] - Độ dài tối thiểu. Mặc định là 0 - không xét độ dài.
   * @param {boolean} [param0.required=false] - Có bắt buộc hay không. Mặc định là false.
   * @param {string} [param0.match=''] - kiểu dữ liệu input cần khớp. Mặc định là ''.
   * @param {string[]} [param0.matchType=[]] - Danh sách các kiểu so khớp.
   */
export class InputValids {
  minlength: number;
  required: boolean;
  match: string;
  matchType: string[];

  constructor({ minlength = 0, required = false, match = '', matchType = [] }: InputValidsProps = {}) {
    this.minlength = minlength;
    this.required = required;
    this.match = match;
    this.matchType = matchType;
  }

  validate(name: string, value: any, formData?: FormDataProps): { [key: string]: string } {
    return validateText(name, value, this, formData);
  }
}