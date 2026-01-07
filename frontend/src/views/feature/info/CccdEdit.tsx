import React, { useState, useEffect, JSX, useRef } from "react";
import { useAuth } from "../../../context/AuthContext";

import "./CccdEdit.scss";
import { DataValidsProps, ErrorLogProps, FileDataProps, FormDataProps } from "../../../types/FormInterfaces";
import { formatTimestamp } from "../../../function/convert/formatTimestamp";
import Button from "../../ui/input/Button";
import * as API from "../../../api/StudentCccd";
import CccdForm from "./CccdForm";
import { convertFileDataToBase64 } from "../../../function/convert/convertFileDataToBase64";
import { ImageValids } from "../../../classes/ImageValids";
import { DateValids } from "../../../classes/DateValids";
import { base64ToFile } from "../../../function/convert/base64ToFile";
import { useAppContext } from "../../../context/AppContext";
import { InputValids } from "../../../classes/InputValids";
import { ChoiceValids } from "../../../classes/ChoiceValids";
import { checkValidSubmitUtils } from "../../../function/triggers/checkValidSubmitUtils";

const CccdEdit = (): JSX.Element => {
    const {token, user} = useAuth();
    const {isLoading, setIsLoading} = useAppContext();
    const friendlyNote = ["Thông tin của bạn đang chờ phê duyệt!","Bạn đã cập nhật CCCD!"];

    const [isUpdated, setIsUpdated] = useState<number>(-1);

    const defaultFormRef = useRef<FormDataProps | null>(null);
    const defaultImgRef = useRef<FileDataProps | null>(null);

    const [formData, setFormData] = useState<FormDataProps>({
        numCccd: "",
        dateBirth: formatTimestamp(new Date(new Date().getFullYear() - 18, 0, 1)), // Ngày 01/01 của 18 năm về trước
        gender: "",
        address: ""
    });

    const [imgData, setImgData] = useState<FileDataProps>({
        front: undefined,
        back: undefined
    });

    const [errors, setErrors] = useState<ErrorLogProps>({
        numCccd: "",
        dateBirth: "",
        gender: "",
        address: ""
    });

    const valids: DataValidsProps = {
        front: new ImageValids({required: true}),
        back: new ImageValids({required: true}),
        dateBirth: new DateValids({required: true, cons: {max: {value: new Date(new Date().getFullYear() - 16, 11, 31)}}}),
        realName: new InputValids({required: true}),
        gender: new ChoiceValids({required: true}),
        address: new InputValids({required: true}),
        numCccd: new InputValids({required: true, minlength: 12, matchType: ['cccd']})
    }
    if(token === "" || user.isGuest()) return(<></>);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await API.GetCccd(token);
                // console.log(result);
                if (typeof result.data.confirm !== 'undefined') {
                    setIsUpdated(parseInt(result.data.confirm));
                }

                const form = {
                    realName: result.data.realName || "",
                    numCccd: result.data.numCccd || "",
                    dateBirth: result.data.dateBirth ? formatTimestamp(result.data.dateBirth ,) : formatTimestamp(new Date(new Date().getFullYear() - 18, 0, 1)),
                    gender: result.data.gender || "",
                    address: result.data.address || ""
                };
                
                const image = {
                    front: result.data.front === undefined ? result.data.front : base64ToFile("data:image/png;base64," + result.data.front, "front.png", "image/png"),
                    back:  result.data.back === undefined ? result.data.back : base64ToFile("data:image/png;base64," + result.data.back, "front.png", "image/png")
                };

                // Set dữ liệu hiển thị
                setFormData(form);
                setImgData(image);

                // Lưu bản sao gốc
                defaultFormRef.current = form;
                defaultImgRef.current = image;
            } catch (error: any) {
                console.error(error);
            }
        };

        if (token) fetchData();
    }, [token]);

    const handleReset = () => {
        if (defaultFormRef.current && defaultImgRef.current) {
            setFormData(defaultFormRef.current);
            setImgData(defaultImgRef.current);
        } else {
            console.warn("Dữ liệu mặc định chưa được khởi tạo");
        }
    };

    const handleSubmit = async () =>{
        //Hàm kiểm tra ở đây
        setIsLoading(true);
        const validate = checkValidSubmitUtils({...formData, ...imgData}, valids, setErrors);
        // console.log(validate);
        if(!validate){
            setIsLoading(false);
            return;
        }
        
        // console.log(formData);
        const base64Data = await convertFileDataToBase64(imgData);
        //Thực hiện API cập nhật
        try{
            const result = await API.UpdateCccd(token, {...formData, ...base64Data});
            console.log(result);
        }catch(error: any){
            console.error(error)
        }

        setIsLoading(false)
    }

    return (
        <section className={`cccd-form-container`}>
            <h3>Thêm Căn cước công dân</h3>
            {isUpdated >= 0 && <p className="note">{friendlyNote[isUpdated]}</p>}
            <CccdForm
                formData={formData}
                setFormData={setFormData}
                imgData={imgData}
                setImgData={setImgData}
                errors={errors}
                setErrors={setErrors}
                valids={valids}
                status={isUpdated}
            />
            <div className="button-form">
                    <Button
                        type="button"
                        className="btn-confirm"
                        onClick={handleSubmit}
                        text="Cập nhật!"
                        disabled={isLoading || isUpdated === 1}
                    />
                    <Button
                        type="button"
                        className="btn-cancel"
                        onClick={handleReset}
                        text="Khôi phục"
                        disabled={isLoading}
                    />
                </div>
        </section>
    );
};

export default React.memo(CccdEdit);