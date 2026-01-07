import { DropdownValids } from "../../classes/DrowdownValids";


export const validateDropdown = (
  name: string,
  value: any,
  valids: DropdownValids = new DropdownValids(),
): { [key: string]: string } => {
  if (valids.required) {
    if (valids.required && value.trim() === '') {
      return { [name]: 'Trường này là bắt buộc.' };
    }
  }
  return { [name]: '' };
};

