import { validateChoice } from "../function/conditions/validateChoice";
import { FormDataProps } from "../types/FormInterfaces";

/**
 * Lớp đại diện cho các điều kiện hợp lệ của lựa chọn.
 * @param options Các tùy chọn hợp lệ
 * @param options.required Có bắt buộc hay không (mặc định: false)
 * @param options.min Số lượng tối thiểu (mặc định: 0)
 * @param options.max Số lượng tối đa (mặc định: 0)
 */
export class ChoiceValids {
  required: boolean;
  min: number;
  max: number;

  constructor({ required = false, min = 0, max = 0 }: {
    required?: boolean;
    min?: number;
    max?: number;
  } = {}) {
    this.required = required;
    this.min = min < 0 ? 0 : min;
    if (min < 0) {
      console.error('min must be greater than or equal to 0');
    }
    this.max = max;
  }

  validate(name: string, value: any, formData?: FormDataProps): { [key: string]: string } {
      return validateChoice(name, value, this);
  }
}
