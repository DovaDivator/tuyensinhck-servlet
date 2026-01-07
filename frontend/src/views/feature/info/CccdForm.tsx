import React, {JSX, useEffect, useRef, useState} from 'react';
import InputImage from '../../ui/input/InputImage';
import InputField from '../../ui/input/InputField';
import InputChoice from '../../ui/input/InputChoice';
import DatetimePicker from '../../ui/input/DatetimePicker';
import { DataValidsProps, ErrorLogProps, FileDataProps, FormDataProps } from '../../../types/FormInterfaces';

import "./CccdForm.scss";
import { useAppContext } from '../../../context/AppContext';

interface CccdFormProps{
    formData: FormDataProps;
    setFormData: React.Dispatch<React.SetStateAction<FormDataProps>>;
    imgData: FileDataProps;
    setImgData: React.Dispatch<React.SetStateAction<FileDataProps>>;
    errors: ErrorLogProps;
    setErrors: React.Dispatch<React.SetStateAction<ErrorLogProps>>;
    isAdmin?: boolean;
    valids: DataValidsProps;
    status: number;
}

    const GENDER_CHOICES = [
        {value: "0", label: "Nam"},
        {value: "1", label: "Nữ"}
    ]

const CccdForm = ({
    formData,
    setFormData,
    imgData,
    setImgData,
    errors,
    setErrors,
    isAdmin = false,
    valids,
    status
}: CccdFormProps): JSX.Element => {
    const formRef = useRef<HTMLFormElement>(null);
    const {isLoading} = useAppContext();
    const [sizeClass, setSizeClass] = useState<'big' | 'small'>('big');

    useEffect(() => {
        const formEl = formRef.current;
        if (!formEl) return;

        const observer = new ResizeObserver(entries => {
            for (let entry of entries) {
                const width = entry.contentRect.width;
                if (width < 650) {
                    setSizeClass('small');
                } else {
                    setSizeClass('big');
                }
            }
        });

        observer.observe(formEl);

        return () => observer.disconnect();
    }, []);

    return(
    <form ref={formRef} className='cccd-form'>
                <div className={`image-form ${sizeClass}`}>
                    <InputImage
                        name="front"
                        id="front"
                        value={Array.isArray(imgData.front) ? imgData.front[0] : imgData.front}
                        setFileData={setImgData}
                        disabled={isAdmin || status === 1}
                        errors={errors}
                        setErrors={setErrors}
                        label="Mặt trước cccd"
                    />
                    <InputImage
                        name="back"
                        id="back"
                        value={Array.isArray(imgData.back) ? imgData.back[0] : imgData.back}
                        setFileData={setImgData}
                        disabled={isAdmin || status === 1}
                        errors={errors}
                        setErrors={setErrors}
                        label="Mặt sau cccd"
                    />
                </div>
                <div className="text-form">
                {isAdmin && (
                    <InputField
                        type="text"
                        name="realName"
                        id="realName"
                        placeholder="Tên thật: "
                        value={formData.realName}
                        formData={formData}
                        setFormData={setFormData}
                        maxLength={12}
                        errors={errors}
                        setErrors={setErrors}   
                        isSubmiting={isLoading} 
                        disabled={status === 1}
                    />
                )}
                    <InputField
                        type="text"
                        name="numCccd"
                        id="numCccd"
                        placeholder="Số căn cước công dân"
                        value={formData.numCccd}
                        formData={formData}
                        setFormData={setFormData}
                        maxLength={12}
                        errors={errors}
                        setErrors={setErrors}   
                        isSubmiting={isLoading} 
                        disabled={status === 1}
                    />
                    <DatetimePicker
                        type="date"
                        name="dateBirth"
                        id="dateBirth"
                        value={String(formData.dateBirth)}
                        setFormData={setFormData}
                        errors={errors}
                        setErrors={setErrors}
                        valids={valids.dateBirth}  
                        disabled={status === 1} 
                    />
                    <InputChoice
                        type="radio"
                        name="gender"
                        id="gender"
                        label="Giới tính"
                        value={formData.gender}
                        choices={GENDER_CHOICES}
                        setFormData={setFormData}
                        columns={2}
                        isSubmitting={isLoading}
                        disabled={status === 1} 
                    />
                    <InputField
                        type="text"
                        name="address"
                        id="address"
                        placeholder="Địa chỉ"
                        value={formData.address}
                        formData={formData}
                        setFormData={setFormData}
                        errors={errors}
                        setErrors={setErrors} 
                        isSubmiting={isLoading} 
                        disabled={status === 1}    
                    />
                </div>
                
            </form>
    );
}

export default CccdForm;