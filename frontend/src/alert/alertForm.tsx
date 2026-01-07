import ReactDOM from 'react-dom/client';
import Swal from 'sweetalert2';
import { ReactElement } from 'react';
import { checkValidSubmitUtils } from '../function/triggers/checkValidSubmitUtils';
import { FormDataProps, DataValidsProps, ErrorLogProps } from '../types/FormInterfaces';

type AlertFormProps = {
  [key: string]: any;
};

export const alertFormReact = (
  Component: (props: any) => ReactElement,
  props: AlertFormProps = {},
  valids: DataValidsProps = {},
  isEdit: boolean = false
): Promise<any> => {
  let formData: FormDataProps = {};
  let errors: ErrorLogProps = {};
  let isNotChange = false

  const setFormData = (data: FormDataProps) => {
    formData = {
      ...formData,  // giữ lại dữ liệu cũ
      ...data       // ghi đè dữ liệu mới
    };
  };

  const setErrors = (newErrors: ErrorLogProps) => {
    errors = newErrors;
  };

  const setIsNotChange = (value: boolean) => {
    isNotChange = value;
  }

  const container = document.createElement('div');

  return Swal.fire({
    title: '',
    html: container,
    width: '50%',
    showCancelButton: true,
    confirmButtonText: 'Gửi',
    cancelButtonText: 'Hủy',
    preConfirm: () => {
      if(isNotChange) return "";

      const result = checkValidSubmitUtils(formData, valids, setErrors);
      if (result !== true) {
        const firstErrorEntry = Object.entries(errors).find(([, msg]) => !!msg);
        const firstErrorMessage =
          firstErrorEntry ? `${firstErrorEntry[0]}: ${firstErrorEntry[1]}` : 'Dữ liệu không hợp lệ!';

        Swal.showValidationMessage(firstErrorMessage);
      }
      return formData;
    },
    didOpen: () => {
      const root = ReactDOM.createRoot(container);
      root.render(<Component {...props} setFormData={setFormData} {...(isEdit ? { setIsNotChange: setIsNotChange } : {})}/>);
    },
    customClass: {
      confirmButton: 'btn-confirm',
      cancelButton: 'btn-cancel',
    },
  });
};
