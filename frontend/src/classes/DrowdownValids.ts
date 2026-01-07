import { validateDropdown } from "../function/conditions/validateDropdown";

interface InputValidsProps {
  required?: boolean;
}

/**
   * Tạo một đối tượng `DropdownValids` mới với các quy tắc xác thực đã chỉ định.
   * 
   * @param {InputValidsProps} [param0] - Cấu hình cho xác thực đầu vào. dài.
   * @param {boolean} [param0.required=false] - Có bắt buộc hay không. Mặc định là false.
   */
export class DropdownValids {
  required: boolean;

  constructor({ required = false }: InputValidsProps = {}) {
    this.required = required;
  }

  validate(name: string, value: any): { [key: string]: string } {
    return validateDropdown(name, value, this);
  }
}