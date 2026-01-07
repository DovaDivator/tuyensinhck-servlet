import { validateTypeText } from "./validateTypeText";
import { InputValids } from "../../classes/InputValids";
import { FormDataProps } from "../../types/FormInterfaces";

export const validateText = (
  name: string,
  value: string,
  valids: InputValids = new InputValids({}),
  formData: FormDataProps = {}
): { [key: string]: string } => {
  if (valids.required && value.trim() === '') {
    return { [name]: 'Trường này là bắt buộc.' };
  }

  if (valids.minlength && value.length < valids.minlength && value.trim() !== '') {
    return { [name]: `Trường này phải có ít nhất ${valids.minlength} ký tự.` };
  }

  if (valids.match && formData[valids.match] !== value) {
    return { [name]: 'Thông tin không khớp.' };
  }

  if (Array.isArray(valids.matchType) && valids.matchType.length > 0 && value.length > 0) {
    if (checkUnmatchedType(value, valids.matchType)) {
      return { [name]: 'Thông tin không hợp lệ.' };
    }
  }

  return { [name]: '' };
};

const checkUnmatchedType = (value: string, matchType: string[]): boolean => {
  for (const type of matchType) {
    const func = validateTypeText[type];
    if (typeof func !== 'function') {
      console.error(`function ${type} not exist`);
      continue;
    }

    if (!func(value)) {
      return true;
    } else {
      return false;
    }
  }

  return false;
};
