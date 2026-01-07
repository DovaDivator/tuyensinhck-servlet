import React from 'react';
import Select from 'react-select';
import { onChangeChoice } from '../../../function/triggers/onChangeChoice';
import { ErrorLogProps, FormDataProps, ValidateRule } from '../../../types/FormInterfaces';
import { ChoiceOption } from '../../../classes/ChoiceGroup';
import { ChoiceValids } from '../../../classes/ChoiceValids';

import './Dropdown.scss';

interface DropdownProps {
  name: string;
  id: string;
  label?: string;
  choices: ChoiceOption[];
  value: string | undefined;
  allowDefault?: boolean;
  setFormData: React.Dispatch<React.SetStateAction<FormDataProps>>;
  errors?: ErrorLogProps;
  setErrors?: React.Dispatch<React.SetStateAction<ErrorLogProps>>;
  valid?: ValidateRule;
  isSubmitting?: boolean;
  disabled?: boolean;
}

const Dropdown = ({
  name,
  id,
  label = '',
  choices = [],
  value,
  allowDefault = false,
  setFormData,
  errors = {},
  setErrors = undefined,
  valid = new ChoiceValids({}),
  isSubmitting = false,
  disabled = false,
}: DropdownProps) => {
  const selectedOption = choices.find((option) => option.value === (typeof value === 'string' ? value : '')) || null;

  const handleChange = (selected: any) => {
    const newValue = selected ? selected.value : '';
    onChangeChoice({ name, value: newValue, setFormData });

    if (isSubmitting || !setErrors) return;
    const errorObj = valid.validate(name, newValue);
    setErrors((prev) => ({ ...prev, ...errorObj }));
  };

  return (
    <div className="dropdown-wrapper">
      <Select
        inputId={id}
        name={name}
        options={allowDefault ? [{ value: '', label: `-- Mặc định --` }, ...choices] : choices}
        value={selectedOption}
        onChange={handleChange}
        isDisabled={disabled}
        placeholder={`-- Chọn ${label} --`}
        className="dropdown-item"
        classNamePrefix="react-select"
        isSearchable
        styles={{
          menu: (provided) => ({
            ...provided,
            zIndex: 9999, // Đảm bảo hiển thị lên trên
          }),
          menuList: (provided) => ({
            ...provided,
            maxHeight: 200, // Chiều cao tối đa của danh sách item
            overflowY: 'auto', // Chỉ scroll phần nội dung
          }),
        }}
      />
      {errors[name] && <span className="error-message">{errors[name]}</span>}
    </div>
  );
};

export default Dropdown;
