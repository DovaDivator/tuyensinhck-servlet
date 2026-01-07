import { validateImage } from "../function/conditions/validateImage";

interface InputValidsProps {
  required?: boolean;
}

/**
   * Tạo một đối tượng `ImageValids` mới với các quy tắc xác thực đã chỉ định.
   * 
   * @param {InputValidsProps} [param0] - Cấu hình cho xác thực đầu vào. dài.
   * @param {boolean} [param0.required=false] - Có bắt buộc hay không. Mặc định là false.
   */
export class ImageValids {
  required: boolean;

  constructor({ required = false }: InputValidsProps = {}) {
    this.required = required;
  }

  validate(name: string, value: any): { [key: string]: string } {
    return validateImage(name, value, this);
  }
}