import { ChoiceValids } from "../../classes/ChoiceValids";

/**
 * Hàm kiểm tra hợp lệ các lựa chọn theo quy tắc từ đối tượng ChoiceValids.
 * 
 * @param {string} name - Tên trường dữ liệu.
 * @param {string[]} value - Giá trị cần kiểm tra (dự kiến là một mảng hoặc chuỗi).
 * @param {ChoiceValids} [valids=new ChoiceValids()] - Đối tượng chứa các quy tắc kiểm tra như required, min, max.
 * @returns {{ [key: string]: string }} Đối tượng với key là tên trường và value là thông báo lỗi (chuỗi rỗng nếu không lỗi).
 */
export const validateChoice = (
  name: string,
  value: string[],
  valids: ChoiceValids = new ChoiceValids({})
): { [key: string]: string } => {
  if (valids.required && (!value || value.length === 0)) {
    return { [name]: "Trường này là bắt buộc." };
  }

  if (valids.min > 0 && value && value.length < valids.min) {
    return { [name]: `Bạn phải chọn tối thiểu ${valids.min} tùy chọn` };
  }

  if (valids.max && value && value.length > valids.max) {
    return { [name]: `Bạn chỉ được chọn tối đa ${valids.max} tùy chọn` };
  }

  return { [name]: "" };
};
