import Swal, { SweetAlertResult } from 'sweetalert2';
import { validateText } from '../function/conditions/validateText';
import { InputValids } from '../classes/InputValids';

interface alerlSimpleInputProps {
  title?: string;
  placeholder?: string;
  valid: InputValids;
  inputValue?: string;
};

export const alertSimpleInput = async ({
  title = "",
  placeholder = "",
  valid,
  inputValue = ""
}: alerlSimpleInputProps): Promise<SweetAlertResult<any>> => {
  const name = 'inputError';

  const result = await Swal.fire({
    title: title,
    input: 'text',
    inputPlaceholder: placeholder,
    inputValue: inputValue,
    showCancelButton: true,
    confirmButtonText: 'Gửi',
    cancelButtonText: 'Hủy',
    customClass: {
      confirmButton: 'btn-confirm',
      cancelButton: 'btn-cancel'
    },
    inputValidator: (value: string) => {
      const feedback = validateText(name, value, valid);
      return feedback[name] !== '' ? feedback[name] : null;
    }
  });

  // Trả về email nếu xác nhận, ngược lại trả về chuỗi rỗng
  return result;
};
