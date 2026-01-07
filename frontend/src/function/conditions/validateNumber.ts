import { validateTypeText } from "./validateTypeText";
import { NumberValids } from "../../classes/NumberValids";
import { FormDataProps } from "../../types/FormInterfaces";

export const validateNumber = (
  name: string,
  value: string,
  valids: NumberValids = new NumberValids({}),
  formData: FormDataProps = {}
): { [key: string]: string } => {
  if (valids.required && value.trim() === '') {
    return { [name]: 'Trường này là bắt buộc.' };
  }

  const numValue = Number(value);
  if (typeof numValue !== 'number' || isNaN(numValue)) {
    return { [name]: 'Kiểu dữ liệu không hợp lệ.' };
  }

  if (valids.blockDemical && !Number.isInteger(numValue)) {
    return { [name]: 'Trường không chấp nhận số thập phân.' };
  }

  if (valids.minLimit !== undefined && numValue < valids.minLimit) {
    return { [name]: `Số nhập vào quá nhỏ : ${valids.minLimit}` }
  }

  if (valids.maxLimit !== undefined && numValue > valids.maxLimit) {
    return { [name]: `Số nhập vào quá lớn : ${valids.maxLimit}` }
  }

  return { [name]: '' };
};
