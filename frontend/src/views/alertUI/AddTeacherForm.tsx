import { useState, useEffect } from 'react';
import Dropdown from '../ui/input/Dropdown';
import { FormDataProps } from '../../types/FormInterfaces';
import InputField from '../ui/input/InputField';

const AddTeacherForm = ({ setFormData, listMon = []}: {
  setFormData: (data: { [key:string]: string }) => void;
  listMon: { value: string; label: string }[];
}) => {
  // console.log(defaultValue);
  const [alertForm, setAlertForm] = useState<FormDataProps>({
    name: "",
    mon: "",
    email: "",
    phone: "",
  });

  // Cập nhật formData mỗi khi selectedCountry thay đổi
useEffect(() => {
    setFormData({
      name: String(alertForm.name || ""),
      mon: String(alertForm.mon || ""),
      email: String(alertForm.email || ""),
      phone: String(alertForm.phone || ""),
    });
}, [alertForm, setFormData]);

  return (
    <div style={{ height: '270px', maxWidth: '400px', margin: 'auto' }} className='basic-gap'>
      <h3 style={{ marginBottom: '6px', display: 'block' }}>Thêm giáo viên:</h3>
      <InputField
        name="name"
        id="name"
        value={alertForm.name}
        formData={alertForm}
        setFormData={setAlertForm}
        placeholder='Tên giáo viên'
      />
      <Dropdown
        name="mon"
        id="mon"
        label="môn đảm nhiệm"
        value={String(alertForm.mon)}
        setFormData={setAlertForm}
        choices={listMon}
        allowDefault={true}
      />
      <InputField
        name="email"
        id="email"
        value={alertForm.email}
        formData={alertForm}
        setFormData={setAlertForm}
        placeholder='Email'
      />
      <InputField
        name="phone"
        id="phone"
        value={alertForm.phone}
        formData={alertForm}
        setFormData={setAlertForm}
        placeholder='Số điện thoại (không bắt buộc)'
      />
    </div>
  );
};

export default AddTeacherForm;
