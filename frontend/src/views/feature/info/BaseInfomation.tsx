import React, { useState, useEffect, JSX } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

import introImg from "../../../assets/images/SquareSchool.jpg";
import "./BaseInfomation.scss";
import ListTable from "../../ui/components/ListTable";
import { BasicUserInfo } from "../../../classes/BasicUserInfo";
import { getBasicUserInfo } from "../../../api/GetBasicUserInfoApi";
import { canNullUI } from "../../../function/convert/canNullUI";
import Button from "../../ui/input/Button";
import { InputValids } from "../../../classes/InputValids";
import { alertSimpleInput } from "../../../alert/alerlSimpleInput";
import { ChangeUser } from "../../../api/ChangeUser";
import { alertBasic } from "../../../alert/alertBasic";
import { showToast } from "../../../alert/alertToast";

const BaseInfomation = (): JSX.Element => {
    const {token} = useAuth();
    const friendlyNote = "Chỉ có thể cập nhật dựa trên CCCD bạn đã thêm vào!";
    const [userInfo, setUserInfo] = useState<BasicUserInfo>(new BasicUserInfo("", "", 0, "", "", "", ""));

    if(token === "") return(<></>);

        useEffect(() => {
            const fetchUser = async () => {
            if(token === "") return;
            try {
                // console.log(token);
                const data = await getBasicUserInfo(token);
                setUserInfo(data);
            } catch (error: any) {
                console.error(error);
            }
            };
    
            fetchUser();
        }, [token]);

    return (
        <section className={`base-infomation`}>
            <h3>Thông tin cá nhân</h3>
            <figure className="base-infomation__avatar">
                <img src={userInfo.getImage()} alt="Avatar" title={friendlyNote}/>
            </figure>
            <div className="base-infomation__title">
                <h3 title={friendlyNote} className="not-allow-hover">{userInfo.name}</h3>
                <span>ID: {userInfo.id}</span>
                <i>Vai trò: {userInfo.getRoleName()}</i>
            </div>
            <div className="base-infomation__contact">
                <div className="line">
                    <span><b>Email:&nbsp;</b>{userInfo.email}</span>
                    <Button
                        className="custom_info"
                        icon="fa-solid fa-pen-to-square"
                        onClick={() => ChangeInfo("email", userInfo, setUserInfo, token)}
                        title="Chỉnh sửa"
                    />
                </div>
                <div className="line">
                    <span><b>SĐT:&nbsp;</b>{canNullUI(userInfo.phone)}</span>
                    <Button
                        className="custom_info"
                        icon="fa-solid fa-pen-to-square"
                        onClick={() => ChangeInfo("số điện thoại", userInfo, setUserInfo, token)}
                        title="Chỉnh sửa"
                    />
                </div>
                <div className="line">
                    <span><b>Ngày tạo:&nbsp;</b>{userInfo.getDateString()}</span>
                </div>
            </div>
            {userInfo.isStudent() && (<>
                <div className="horizontal-lines"></div>
                <CccdInfo stu_id={userInfo.id}/>
            </>)}
            {userInfo.isStudent() && (<>
                <div className="horizontal-lines"></div>
                <NganhDKInfo stu_id={userInfo.id}/>
            </>)}
        </section>
    );
};

export default BaseInfomation;

const CccdInfo = ({stu_id = ""}: {stu_id?: string}):JSX.Element => {
    return(
        <div className="base-infomation__cccd-info">
            <h3>Thông tin Căn cước</h3>
            <div className="base-infomation__cccd-info__content">
                <span><b>Số CCCD:&nbsp;</b> </span>
                <span><b>Ngày sinh:&nbsp;</b> </span>
                <span><b>Giới tính:&nbsp;</b> </span>
                <span><b>Địa chỉ:&nbsp;</b> </span>
            </div>
            <span className="error-message">Lưu ý: Thông tin đã cập nhật sẽ không thể thay đổi được!</span>
        </div>
    );
}

const NganhDKInfo = ({stu_id = ""}: {stu_id?: string}):JSX.Element => {
    const ERROR_LOG_TABLE = "Bạn chưa đăng ký ngành học nào!";
    return(
        <div className="base-infomation__nganh-dk">
            <h3>Ngành học đã đăng ký</h3>
            <ListTable error={ERROR_LOG_TABLE}/>
        </div>
    );
}

const ChangeInfo = async (
        name: string,
        user: BasicUserInfo,  
        setUser: React.Dispatch<React.SetStateAction<BasicUserInfo>>, 
        token: string
    ): Promise<void> => {
    const inputValids = new InputValids({})
    type UserKey = "email" | "phone";
    let nameDB: UserKey = "" as UserKey;
    switch(name){
        case "email":
            inputValids.matchType = ["email"];
            inputValids.required = true;
            nameDB = "email";
            break;
        case "số điện thoại":
            inputValids.matchType = ["phone"];
            nameDB = "phone"
            break;
        default:
            console.error(`tên ${name} không xác định trong case`);
            return;

    }

    const getResult = await alertSimpleInput({title:`Thay đổi ${name}`,  valid:inputValids, inputValue: user[nameDB] });

    console.log(getResult);
    if(getResult.isConfirmed){
        if(getResult.value === user[nameDB]) return;
        try{
            const result = await ChangeUser(token, {name: nameDB, value: getResult.value});
            if(!result.success) throw new Error(result.message);
            setUser(
                new BasicUserInfo(
                    user.id,
                    user.name,
                    user.role,
                    user.avatarImg,
                    nameDB === "email" ? getResult.value : user.email,
                    nameDB === "phone" ? getResult.value : user.phone,
                    user.created_at,
                )
            );
            showToast("success", "", "Cập nhật thành công!");
        }catch(error: any){
            console.error(error);
            alertBasic({
                icon: "error",
                title: "Thông báo lỗi",
                message: error.message || "Không thể tải thông tin người dùng",
                });
        }
    }
}