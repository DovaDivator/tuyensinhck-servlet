import React, {JSX, useState, useRef, ChangeEvent } from 'react';
import './InputImage.scss'; 
import { FileDataProps, ErrorLogProps } from '../../../types/FormInterfaces';

interface InputImageProps{
   name: string;
   id: string;
   value: File | undefined;
   setFileData: React.Dispatch<React.SetStateAction<FileDataProps>>;
   maxSize?: number;
   disabled?: boolean;
     errors?: ErrorLogProps;
     setErrors?: React.Dispatch<React.SetStateAction<ErrorLogProps>>;
     label?: string;
}

const InputImage = ({
   name,
   id,
   value,
   setFileData,
   maxSize = 0,
   disabled = false,
   errors = {},
   setErrors = undefined,
   label = ""
}: InputImageProps): JSX.Element => {
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref đến input file

  // Xử lý khi người dùng chọn ảnh
  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if(selectedFile.size > maxSize * 1024 * 1024 && maxSize > 0){
        alert("Kích thước ảnh vượt quá yêu cầu tối đa: " + String(maxSize) + "MB");
      }
      setFileData(prev => ({
        ...prev,
        [name]: selectedFile
      }));
    }
  };

  // Kích hoạt input khi nhấn container
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="image-upload-container">
      {/* Input file ẩn */}
      <input
        name={name}
        id={id}
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        ref={fileInputRef}
        style={{ display: 'none' }}
        disabled={disabled}
      />
      {/* Container hiển thị ảnh hoặc nhắc chọn file */}
      {label && <span className="label">{label}</span>}
      <div
        className="image-preview"
        onClick={triggerFileInput}
        style={{
          backgroundImage: value ? `url(${URL.createObjectURL(value)})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
      {!value && (
        <span>
          Nhấn để chọn ảnh {maxSize > 0 ? `(Tối đa: ${maxSize}MB)` : ''}
        </span>
      )}
      </div>
      <span className={`error-message ${errors[name] ? "" : "not-active"}`}>.{errors[name]}</span>
    </div>
  ); 
}

export default InputImage;