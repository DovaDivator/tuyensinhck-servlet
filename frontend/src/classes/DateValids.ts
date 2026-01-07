import { FormDataProps } from "../types/FormInterfaces";
import { validateDate } from "../function/conditions/validateDate";

interface DateValidsProps {
  required?: boolean;

  cons?: Partial<{
    min: {
      value: string | Date;
      dist?: Partial<{
        year: number;
        month: number;
        day: number;
        hour: number;
        min: number;
        isWithin: boolean;
      }>;
    };
    max: {
      value: string | Date;
      dist?: Partial<{
        year: number;
        month: number;
        day: number;
        hour: number;
        min: number;
        isWithin: boolean;
      }>;
    };
  }>;
}

/**
 * Tạo một đối tượng `InputValids` mới với các quy tắc xác thực đã chỉ định.
 * 
 * @param {DateValidsProps} [param0] - Cấu hình cho xác thực đầu vào.
 * @param {boolean} [param0.required=false] - Có bắt buộc hay không. Mặc định là false.
 * @param {Object} [param0.cons] - Struct chứa ràng buộc thời gian gồm `min` và `max`, mỗi cái có thể có `dist` riêng.
 */
export class DateValids {
  required: boolean;

  cons?: Partial<{
    min: {
      value: string | Date;
      dist?: Partial<{
        year: number;
        month: number;
        day: number;
        hour: number;
        min: number;
        isWithin: boolean;
      }>;
    };
    max: {
      value: string | Date;
      dist?: Partial<{
        year: number;
        month: number;
        day: number;
        hour: number;
        min: number;
        isWithin: boolean;
      }>;
    };
  }>;

  constructor({ required = false, cons = {} }: DateValidsProps = {}) {
    this.required = required;
    this.cons = cons;
  }

  validate(name: string, value: any, formData?: FormDataProps): { [key: string]: string } {
    return validateDate(name, value, this, formData);
  }
}
