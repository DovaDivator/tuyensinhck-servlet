import { ImageValids } from "../../classes/ImageValids";
import { FormDataProps } from "../../types/FormInterfaces";

export const validateImage = (
  name: string,
  value: any,
  valids: ImageValids = new ImageValids({}),
  formData: FormDataProps = {}
): { [key: string]: string } => {
  if (valids.required) {
    const hasFile = Array.isArray(value) ? value.length > 0 :
      value instanceof File && value.size > 0;

    if (!hasFile) return { [name]: 'Trường này là bắt buộc.' };
  }
  return { [name]: '' };
};

