import React, {JSX} from 'react';
import usePasswordToggle from '../../../function/triggers/usePasswordToggle';
import PasswordToggleIcon from './PasswordToggleIcon';
import './InputField.scss';
import { onChangeInput } from '../../../function/triggers/onChangeInput';
import { validateText } from '../../../function/conditions/validateText';
import { ErrorLogProps, FormDataProps, ValidateRule } from '../../../types/FormInterfaces';
import { InputOptions } from '../../../classes/InputOption';
import { InputValids } from '../../../classes/InputValids';

interface InputFieldProps {
  type?: 'text' | 'password' | 'email' | 'number' | string; // có thể mở rộng thêm
  name: string;
  id: string;
  placeholder?: string;
  value: string | string[] | undefined;
  maxLength?: number;
  formData: FormDataProps;
  setFormData: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>;
  options?: InputOptions;
  errors?: ErrorLogProps;
  setErrors?: React.Dispatch<React.SetStateAction<ErrorLogProps>>;
  valids?: ValidateRule;
  isSubmiting?: boolean;
  disabled?: boolean;
}

const InputField = ({
  type = 'text',
  name,
  id,
  placeholder = "",
  value,
  maxLength,
  formData,
  setFormData,
  options = new InputOptions({}),
  errors = {},
  setErrors = undefined,
  valids = new InputValids({}),
  isSubmiting = false,
  disabled = false,
}: InputFieldProps): JSX.Element => {
  const { showPassword, togglePassword } = usePasswordToggle();
  const inputType = type === 'password' && showPassword ? 'text' : type;

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    trimInput(setFormData, formData, name);
    if (isSubmiting || !setErrors) return;
    const errorObj = valids.validate(e.target.name, e.target.value, formData);
    setErrors(prev => ({ ...prev, ...errorObj }));
  };

  return (
    <div className={`input-wrapper ${value ? 'has-value' : ''}`}>
      {placeholder !== "" && <span className="input-label">{placeholder}</span>}
      <label className="input-field-wrapper" tabIndex={1}>
        <input
          type={inputType}
          name={name}
          id={id}
          lang="en"
          placeholder=" "
          value={value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChangeInput(e, setFormData, options)}
          onBlur={handleBlur}
          maxLength={maxLength}
          className="input-field"
          disabled={disabled}
          autoComplete={type !== 'password' ? name : 'off'}
        />
        <PasswordToggleIcon
          showPassword={showPassword}
          togglePassword={togglePassword}
          type={type}
        />
      </label>
      {errors[name] && <span className="error-message">{errors[name]}</span>}
    </div>
  );
};

export default InputField;

const trimInput = (
  setFormData: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>,
  formData: { [key: string]: any },
  name: string
) => {
  setFormData(prev => ({
    ...prev,
    [name]: (formData[name] || '').trim()
  }));
};
