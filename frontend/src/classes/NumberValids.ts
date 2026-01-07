import { validateNumber } from '../function/conditions/validateNumber';
import { FormDataProps } from '../types/FormInterfaces';

interface NumberValidsProps {
  minLimit?: number;
  maxLimit?: number;
  required?: boolean;
  blockDemical?: boolean
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
export class NumberValids {
  minLimit?: number;
  maxLimit?: number;
  required: boolean;
  blockDemical: boolean;

  constructor({
    minLimit = undefined,
    maxLimit = undefined,
    required = false,
    blockDemical = false,
  }: NumberValidsProps = {}) {
    this.minLimit = minLimit;
    this.maxLimit = maxLimit;
    this.required = required;
    this.blockDemical = blockDemical;
  }

  validate(name: string, value: any, formData?: FormDataProps): { [key: string]: string } {
    return validateNumber(name, value, this, formData);
  }
}