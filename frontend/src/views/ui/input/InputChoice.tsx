import React from 'react';
import './InputChoice.scss';
import { onChangeChoice } from '../../../function/triggers/onChangeChoice';
import { validateChoice } from '../../../function/conditions/validateChoice';
import { ErrorLogProps, FormDataProps, ValidateRule} from '../../../types/FormInterfaces';
import { ChoiceOption } from '../../../classes/ChoiceGroup';
import { ChoiceValids } from '../../../classes/ChoiceValids';

interface InputChoiceProps {
  type?: 'checkbox' | 'radio';
  name: string;
  id: string;
  label?: string;
  choices: ChoiceOption[];
  value: string | string[] | undefined;
  setFormData: React.Dispatch<React.SetStateAction<FormDataProps>>;
  errors?: ErrorLogProps
  setErrors?: React.Dispatch<React.SetStateAction<ErrorLogProps>>;
  valid?: ValidateRule;
  isSubmitting?: boolean;
  columns?: number;
  disabled?: boolean;
}

/**
 * Props cho component InputChoice - nhóm input kiểu checkbox hoặc radio.
 *
 * @typedef {Object} InputChoiceProps
 * @param {'checkbox'|'radio'} [type='checkbox'] - Loại input, mặc định là 'checkbox'.
 * @param {string} name - Tên nhóm input, dùng để nhóm các input cùng tên.
 * @param {string} id - ID duy nhất của input.
 * @param {string} label - Nhãn hiển thị cho nhóm input.
 * @param {ChoiceOption[]} choices - Mảng các lựa chọn, mỗi phần tử là đối tượng ChoiceOption.
 * @param {any} value - Giá trị hiện tại được chọn.
 * @param {React.Dispatch<React.SetStateAction<FormDataProps>>} setFormData - Hàm cập nhật dữ liệu form.
 * @param {ErrorLogProps} [errors] - Đối tượng chứa lỗi của form, có thể không truyền.
 * @param {React.Dispatch<React.SetStateAction<ErrorLogProps>>} setErrors - Hàm cập nhật trạng thái lỗi.
 * @param {ValidateRule} [valid] - Điều kiện validate cho input, có thể không truyền.
 * @param {boolean} [isSubmitting=false] - Trạng thái đang submit form.
 * @param {number} [columns=1] - Số cột dùng để chia layout, mặc định 1.
 * @param {boolean} [disabled=false] - Trạng thái input bị vô hiệu hóa.
 */
const InputChoice = ({
  type = 'checkbox', // 'checkbox' or 'radio'
  name,
  id,
  label="",
  choices = [],
  value,
  setFormData,
  errors = {},
  setErrors = undefined,
  valid = new ChoiceValids({}),
  isSubmitting = false,
  columns = 1, // Number of columns for layout
  disabled = false,
}: InputChoiceProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    let newValue: string | string[] | undefined;

    if (type === 'checkbox') {
      newValue = target.checked
        ? [...(value || []), target.value]
        : Array.isArray(value)
          ? value.filter((val: string) => val !== target.value) : [];
    } else {
      newValue = target.value; // Radio buttons store a single value
    }

    onChangeChoice({name, value: newValue, setFormData});

    if (isSubmitting || !setErrors) return;
    const errorObj = valid.validate(name, newValue);
    setErrors((prev) => ({ ...prev, ...errorObj }));
  };

  return (
    <div className="choice-wrapper">
      <span className="choice-label">{label}</span>
      <fieldset
        className="choice-group"
        style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
      >
        {choices.map((choice) => (
          <label key={choice.value} className="choice-item">
            <input
              type={type}
              name={name}
              id={`${id}-${choice.value}`}
              value={choice.value}
              checked={
                type === 'checkbox'
                  ? Array.isArray(value) && value.includes(choice.value)
                  : value === choice.value
              }
              onChange={handleChange}
              className="choice-input"
              disabled={disabled}
            />
            <span className="choice-text">{choice.label}</span>
          </label>
        ))}
      </fieldset>
      {errors[name] && <span className="error-message">{errors[name]}</span>}
    </div>
  );
};

export default InputChoice;