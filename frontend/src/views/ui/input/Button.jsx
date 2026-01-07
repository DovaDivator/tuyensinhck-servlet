import React from 'react';
import './Button.scss';

/**
 * Một component nút có thể tùy chỉnh với hỗ trợ văn bản, biểu tượng và hình ảnh.
 *
 * @param {Object} props - Các thuộc tính của component
 * @param {string} [props.type='button'] - Loại nút (ví dụ: 'button', 'submit', 'reset')
 * @param {string} [props.className=''] - Các lớp CSS bổ sung để áp dụng cho nút
 * @param {Function} [props.onClick] - Hàm xử lý sự kiện khi nhấn nút
 * @param {boolean} [props.disabled=false] - Trạng thái vô hiệu hóa của nút
 * @param {string} [props.text] - Nội dung văn bản của nút
 * @param {string} [props.icon] - Tên lớp của biểu tượng (sử dụng FontAwesome 6)
 * @param {string} [props.imgSrc] - URL nguồn của hình ảnh biểu tượng
 * @param {string} [props.title] - chú thích hiển thị của nút
 * @returns {JSX.Element} Component nút được render
 */
const Button = ({ 
    type = 'button', 
    className = '', 
    onClick, 
    disabled = false, 
    text = "", 
    icon = "", 
    imgSrc = "" ,
    title = ""
  }) => {
    return (
      <button
        type={type}
        className={`${className}`}
        onClick={onClick}
        disabled={disabled}
        title={title}
      >
        {icon && <i className={`${icon} ${text ? 'mr-2' : ''}`}></i>}
        {imgSrc && <img src={imgSrc} alt="text" className="btn-icon" />}
        {text !== "" && <span>{text}</span>}
      </button>
    );
  };
  
  export default Button;