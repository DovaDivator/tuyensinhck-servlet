import React, { useState, useEffect, JSX, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useAppContext } from "../../../context/AppContext";

import "../info/CccdEdit.scss";
import { DataValidsProps, ErrorLogProps, FileDataProps, FormDataProps } from "../../../types/FormInterfaces";
import { formatTimestamp } from "../../../function/convert/formatTimestamp";
import Button from "../../ui/input/Button";
import * as API from "../../../api/AdminCccdMgr";
import CccdForm from "../info/CccdForm";
import { convertFileDataToBase64 } from "../../../function/convert/convertFileDataToBase64";
import { ImageValids } from "../../../classes/ImageValids";
import { checkValidSubmitUtils } from "../../../function/triggers/checkValidSubmitUtils";
import { DateValids } from "../../../classes/DateValids";
import { InputValids } from "../../../classes/InputValids";
import { ChoiceValids } from "../../../classes/ChoiceValids";
import { base64ToFile } from "../../../function/convert/base64ToFile";

const ManagerCccdContainer = (): JSX.Element => {
    const {token, user} = useAuth();
    const {isLoading, setIsLoading} = useAppContext();
    const STATUS_COMFIRM = ["Đang chờ phê duyệt!","Đã phê duyệt!"];
    const [searchParams] = useSearchParams();
    const stu_id = searchParams.get("id") || "";

    const defaultFormRef = useRef<FormDataProps | null>(null);
    const defaultImgRef = useRef<FileDataProps | null>(null);


    const [isUpdated, setIsUpdated] = useState<number>(-1);
    const [getError, setGetError] = useState<boolean>(false);

    const [formData, setFormData] = useState<FormDataProps>({
        realName: "",
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
        realName: "",
        numCccd: "",
        dateBirth: "",
        gender: "",
        address: "",
        front: "",
        back: "",
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

    // if(token === "" || user.isGuest()) return(<></>);

    useEffect(() => {
        const fetchData = async () => {
            if(!stu_id){
                setGetError(true);
                return;
            }

            try {
                const result = await API.GetCccd(token, {id: stu_id});
                console.log(result);
                setIsUpdated(result.data.confirm ? parseInt(result.data.confirm) : -1);

                // Giả sử result có dạng {form: {...}, image: {...}}
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
            setFormData({
                realName: "",
                numCccd: "",
                dateBirth: formatTimestamp(new Date(new Date().getFullYear() - 18, 0, 1)), // Ngày 01/01 của 18 năm về trước
                gender: "",
                address: ""
            });
            setImgData({
                front: undefined,
                back: undefined
            });
            console.warn("Dữ liệu mặc định chưa được khởi tạo");
        }
    };

    const handleSubmit = async () =>{
        //Hàm kiểm tra ở đây
        setIsLoading(true);
        const validate = checkValidSubmitUtils({...formData, ...imgData}, valids, setErrors);
        console.log(validate);
        if(!validate){
            setIsLoading(false);
            return;
        }

        const base64Data = await convertFileDataToBase64(imgData);
        try{
            const result = await API.UpdateCccd(token, {...formData, ...base64Data, id: stu_id});
            console.log(result);
        }catch(error: any){
            console.error(error)
        }
        setIsLoading(false);
    }

    const handleRemove = async () => {
        setIsLoading(true);
        try{
            const result = await API.RemoveCccd(token, {id: stu_id});
            console.log(result);
        }catch(error: any){
            console.error(error)
        }
        setIsLoading(false);
    }

    const handleNotAccept = async () => {
        setIsLoading(true);
        try{
            const result = await API.DeniedCccd(token, {id: stu_id});
            console.log(result);
        }catch(error: any){
            console.error(error)
        }
        setIsLoading(false);
    }

    if(getError){
        return(
            <div className="container text-center mt-5">
                <div className="alert alert-warning" role="alert">
                    <h4 className="alert-heading">Không tìm thấy CCCD!</h4>
                    <p>Thông tin xác thực của id: {stu_id} này không tồn tại hoặc bị xóa trong hệ thống.</p>
                </div>
            </div>
        );
    }

    return (
        <section className={`cccd-form-container`}>
            <h3>Xác thực CCCD: </h3>
            {isUpdated && <p className="note"></p>}
            <CccdForm
                formData={formData}
                setFormData={setFormData}
                imgData={imgData}
                setImgData={setImgData}
                errors={errors}
                setErrors={setErrors}
                isAdmin={true}
                valids={valids}
                status={isUpdated}
            />
            <div className="button-form">
                    <Button
                        type="submit"
                        className="btn-confirm"
                        onClick={handleSubmit}
                        text="Phê duyệt!"
                        disabled={isUpdated === 1 || isLoading}
                        title={isUpdated === 1 ? "CCCD này đã được phê duyệt!" : undefined}
                    />
                    <Button
                        type="button"
                        className="btn-cancel"
                        onClick={handleNotAccept}
                        text="Không phê duyệt!"
                        disabled={isUpdated === -1 || isLoading}
                        title={isUpdated === -1 ? "CCCD này đang không phê duyệt!" : undefined}
                    />
                    <Button 
                        type="button"
                        onClick={handleReset}
                        text="Khôi phục"
                        disabled={isLoading}
                    />
                    <Button
                        type="button"
                        className="btn-cancel"
                        onClick={handleRemove}
                        text="Loại bỏ!"
                        disabled={isLoading}
                    />
                </div>
        </section>
    );
};

export default React.memo(ManagerCccdContainer);