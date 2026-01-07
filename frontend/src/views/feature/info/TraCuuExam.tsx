import React, { useState, useEffect, JSX, useRef, Dispatch } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

import "./TraCuuExam.scss";
import { useAppContext } from "../../../context/AppContext";
import { getListExam } from "../../../api/StudentExam";
import { processExamListTS } from "../../../function/convert/ProcessExamListTS";
import ListTable from "../../ui/components/ListTable";
import Dropdown from "../../ui/input/Dropdown";
import { FormDataProps } from "../../../types/FormInterfaces";
import InputField from "../../ui/input/InputField";
import Button from "../../ui/input/Button";
import EditStuExamForm from "../../alertUI/EditStuExamForm";
import { alertFormReact } from "../../../alert/alertForm";
import { updateExam, deleteExam } from "../../../api/StudentExam";
import { alertBasic } from "../../../alert/alertBasic";

const CHOICES_KY_THI = [
    {value: "dh", label: "Đại học"},
    {value: "cd", label: "Cao đẳng"},
    {value: "lt", label: "Liên thông"}
];

const TraCuuExam = (): JSX.Element => {
    const {token, user} = useAuth();
    const {isLoading, setIsLoading} = useAppContext();

    const [searchParams] = useSearchParams();
    const kyThiUrl = searchParams.get("kyThi") || "";
    const khoa = searchParams.get("khoa") || "";

    const [filterForm, setFilterForm] = useState<FormDataProps>({
      kyThi: kyThiUrl,
      khoa: khoa
    });

    if(token === "" || user.isGuest()) return(<></>);
    
    const [data, setData] = useState<any[]>([]);
    const [isChange, setIsChange] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            try{
              const result = await getListExam(token, {kyThi: kyThiUrl, khoa: khoa});
              if(result.data instanceof Array){
                setData(result.data);
              }else{
                setData([]);
              }
            }catch(error: any){
              console.error(error);
            }

            setIsChange(false);
        };

        setIsLoading(true);
        if (token || isChange) fetchData();

        setIsLoading(false);
    }, [token, isChange]);

    return (
        <section className={`tra-cuu-container`}>
            <h3>Tra cứu kỳ thi</h3>
            <form>
              <span style={{fontWeight: "bold"}}>Bộ lọc:</span>
              <Dropdown
                name="kyThi"
                id="kyThi"
                label="kỳ thi"
                value={String(filterForm.kyThi)}
                setFormData={setFilterForm}
                choices={CHOICES_KY_THI}
                allowDefault={true}
              />
              <InputField
                type="number"
                name="khoa"
                id="khoa"
                value={filterForm.khoa}
                formData={filterForm}
                setFormData={setFilterForm}
                placeholder="Khóa thi"
              />
              <Button
                type="submit"
                text="Tìm kiếm"
                icon="fa-solid fa-magnifying-glass"
              />
            </form>
            {data.length === 0 &&
              <EmptyExamList/>
            }
            {data.length > 0 &&
              <div className="exam-list">
              {data.map((item, index) => (
                <>
                <section key={index}>
                  <EleKyThiInfo token={token} item={item} setIsChange={setIsChange}/>
                </section>
                {index < data.length - 1 &&
                <div style={{height: "1px", width: "100%", justifyItems: "center"}}>
                <div style={{height: "100%", width: "50%", maxWidth: "600px", backgroundColor: "gray"}}></div>
                </div>
                }
                </>
              ))}
              </div>
            }
        </section>
    );
};

export default React.memo(TraCuuExam);

const EmptyExamList = () =>{
  return(
    <div className='container text-center mt-5'>
      <div className='alert alert-warning'>
        <span>Có vẻ bạn chưa đăng ký kỳ thi này của chúng tôi...</span>
      </div>
    </div>
  );
}

const EleKyThiInfo = ({token, item, setIsChange} : {token: string, setIsChange: React.Dispatch<React.SetStateAction<boolean>>, item: Object}): JSX.Element =>{
    const itemAny = item as any;

    const HEADERS = {
      mon_thi: "Môn thi",
      dateExam: "Ngày thi",
      timeStart: "Bắt đầu",
      timeEnd: "Kết thúc",
      maPhong: "Mã phòng",
      viTri: "Địa điểm",
      diem: "Điểm",
    }

    const convertItem = processExamListTS(item);
    return(
      <>
        <div className="exam-header">
          <div className="exam-title">
            <h3>Kỳ thi {itemAny.he} khóa {itemAny.khoa}</h3>
            <span>ID thí sinh: {itemAny.examId ? itemAny.examId : ""}</span>
          </div>
          {!itemAny.examId &&
          <div className="button-group"> 
            <Button
              type="button"
              icon="fa-solid fa-pencil"
              onClick={() => EditButton({token: token, data: {typeExam: itemAny.he, idRegister: itemAny.idRegister}, setIsChange ,defaultValue: { monTC: itemAny.monTC, monNN: itemAny.monNN } })}
              className="btn-confirm"
              title="Chỉnh sửa thông tin"
            />  
            <Button
              type="button"
              icon="fa-solid fa-xmark"
              onClick={() => {
                DeleteButton({token: token, id: itemAny.idRegister, setIsChange});
              }}
              className="btn-cancel"
              title="Hủy đăng ký"
            />  
          </div>
          }
        </div>
        <div>
          <ListTable
            struct={convertItem}
            headers={HEADERS}
          />
        </div>      
      </>
    );
}

const EditButton = async ({token, data, setIsChange, defaultValue = {monTC: "", monNN: ""}}: {
  defaultValue? : FormDataProps;
  data: {[key: string]: any};
  setIsChange: React.Dispatch<React.SetStateAction<boolean>>;
  token: string;
})=> {
  // console.log(data);
  const resultAlert = await alertFormReact(EditStuExamForm, {
    defaultValue,
  }, {} ,true);
  if (!resultAlert.isConfirmed || resultAlert.value === "") return;
  try {
        const result = await updateExam(token, {
            ...data, ...resultAlert.value
        });

        alertBasic({
           icon: 'success',
           title: 'Thành công',
           message: 'Đã sửa thông tin thành công',
           timer: 5000
        }).then(() => {
          setIsChange(true); 
        });
                      
        } catch (error) {
          alertBasic({
           title: 'Lỗi',
           message: 'Không cập nhật thành công!',
        })
          console.error("Thất bại", error);
        }
}

const DeleteButton = async ({token, id, setIsChange}: {
  id: string;
  setIsChange: React.Dispatch<React.SetStateAction<boolean>>;
  token: string;
})=> {
  try {
        const result = await deleteExam(token, {
            id: id,
        });

        alertBasic({
           icon: 'success',
           title: 'Thành công',
           message: 'Đã sửa thông tin thành công',
           timer: 5000
        }).then(() => {
          setIsChange(true); 
        });
                      
        } catch (error) {
          alertBasic({
           title: 'Lỗi',
           message: 'Không cập nhật thành công!',
        })
          console.error("Thất bại", error);
        }
}