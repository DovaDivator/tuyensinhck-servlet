import React, {JSX} from 'react';
import Button from './Button';
import './InputField.scss';

interface InputFieldSearchProps {
  name: string;
  id: string;
  formData: string;
  setFormData: React.Dispatch<React.SetStateAction<string >>;
  isSubmiting?: boolean;
  disabled?: boolean;
}

/**
 * Component InputFieldSearch là một ô nhập liệu dùng để tìm kiếm.
 * 
 * @param {string} name - Tên của trường nhập liệu, thường dùng để liên kết với dữ liệu hoặc thuộc tính trong form.
 * @param {string} id - ID của ô nhập liệu, thường dùng để xác định và kết nối với nhãn (label) hoặc cho mục đích truy xuất.
 * @param {string} formData - Dữ liệu của ô nhập liệu, chứa giá trị của trường tìm kiếm.
 * @param {function} setFormData - Hàm để cập nhật giá trị `formData` trong state, được sử dụng để xử lý sự thay đổi của người dùng.
 * @param {boolean} [isSubmiting=false] - Tham số tùy chọn chỉ ra liệu form có đang được gửi không. Nếu đang gửi, ô nhập liệu sẽ bị vô hiệu hóa.
 * @param {boolean} [disabled=false] - Tham số tùy chọn để vô hiệu hóa ô nhập liệu. Khi `true`, người dùng không thể nhập vào trường này.
 * 
 * @returns {JSX.Element} - Trả về JSX của ô nhập liệu tìm kiếm.
 */
const InputFieldSearch = ({
  name,
  id,
  formData,
  setFormData,
  isSubmiting = false,
  disabled = false,
}:InputFieldSearchProps):JSX.Element => {

  return (
    <form
      className="input-wrapper searching"
      tabIndex={1}
      onSubmit={(e) => {
        e.preventDefault(); // Ngăn reload trang
        console.log("Đã submit tìm kiếm với từ khóa:", formData);
      }}
    >
      <label className="input-field-wrapper" tabIndex={1}>
        <input
          type='text'
          name={name}
          id={id}
          lang="en"
          placeholder='Tìm kiếm...'
          value={formData}
          onChange={(e) => setFormData( e.target.value)}
          onBlur={(e) => {
            setFormData(formData.trim());
            if (isSubmiting) return;
          }}
          maxLength={65}
          className="input-field search-input"
          disabled={disabled}
          autoComplete={'on'}
        />
        <Button
          type='submit'
          icon='fa-solid fa-magnifying-glass'
          className='btn-search'
        />
      </label>
    </form>
  );
};

export default InputFieldSearch;