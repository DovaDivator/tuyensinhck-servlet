import { useState, useEffect } from 'react';
import Dropdown from '../ui/input/Dropdown';
import { FormDataProps } from '../../types/FormInterfaces';

const SetMonQuanLyForm = ({ setFormData, listMon = [], defaultValue = ""}: {
  setFormData?: (data: { [key:string]: string }) => void;
  listMon: { value: string; label: string }[];
  defaultValue? : string;
}) => {
  // console.log(defaultValue);
  const [selectedCountry, setSelectedCountry] = useState<FormDataProps>({
    mon: defaultValue,
  });

  // Cập nhật formData mỗi khi selectedCountry thay đổi
  useEffect(() => {
    if (setFormData) {
      setFormData({ mon: String(selectedCountry.mon) }); // fallback về chuỗi rỗng nếu undefined
    }
    else{
      console.error("Không có setFormData");
    }
  }, [selectedCountry, setFormData]);

  return (
    <div style={{ height: '270px' }}>
      <label style={{ marginBottom: '6px', display: 'block' }}>Chọn môn học quản lý:</label>
      <Dropdown
        name="mon"
        id="mon"
        label="môn học"
        value={String(selectedCountry.mon)}
        setFormData={setSelectedCountry}
        choices={listMon}
        allowDefault={true}
      />
    </div>
  );
};

export default SetMonQuanLyForm;
