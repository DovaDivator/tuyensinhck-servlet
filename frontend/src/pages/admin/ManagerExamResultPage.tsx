import { JSX, useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';

import IndexBackground from '../../views/ui/layout/IndexBackground';

import "./ManagerExamResultPage.scss";
import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { ErrorLogProps, FormDataProps } from '../../types/FormInterfaces';
import Dropdown from '../../views/ui/input/Dropdown';
import InputField from '../../views/ui/input/InputField';
import Button from '../../views/ui/input/Button';
import ListTable from '../../views/ui/components/ListTable';
import Pagination from '../../views/ui/components/Pagination';
import { ChoiceOption } from '../../classes/ChoiceGroup';
import {getListMonGrading } from '../../api/GetMonHoc';
import { GetListTS, UpdateTS } from '../../api/GradingMgr';
import { InputOptions } from '../../classes/InputOption';
import { NumberValids } from '../../classes/NumberValids';
import { checkValidSubmitUtils } from '../../function/triggers/checkValidSubmitUtils';

const LIMIT_STUDENT = 30;

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const ManagerExamResultPage = (): JSX.Element => {
  return (
      <div>
      <Helmet>
        <title>Chấm điểm - Web tuyển sinh</title>
      </Helmet>
      <IndexBackground>
        <ManagerExamResultBody/>         
      </IndexBackground>
    </div>
    );
};

export default ManagerExamResultPage;

const ANH_XA = [
    {value: "dh", label: "Đại học"},
    {value: "cd", label: "Cao đẳng"},
    {value: "lt", label: "Liên thông"}
];

const HEADERS = {
    examId: "Mã thí sinh",
    maPhong: "Mã phòng",
    monThi: "Môn thi",
    diemInput: "Điểm",
}

const ManagerExamResultBody = (): JSX.Element => {
    const {user, token} = useAuth();
    const {setIsLoading, isLoading} = useAppContext();
    const navigate = useNavigate();

    const [listMonThi, setListMonThi] = useState<ChoiceOption[]>([]);
    const [isAllowed, setIsAllowed] = useState<boolean>(true);

    const [callData, setCallData] = useState<boolean>(true);
    const [handleData, setHandleData] = useState<boolean>(false);
    const [triggerData, setTriggerData] = useState<boolean>(false);

    const [dataError, setDataError] = useState<string>("");
    const [uniquePhongList, setUniquePhongList] = useState<{ label: string; value: string }[]>([]);

    const [page, setPage] = useState<{[key: string]: number}>({
      curNum: 1,
      totalPage: 1,
    })

    const dataRef = useRef<Object[]>([]);
    const [data, setData] = useState<Object[]>([]);
    const [filterData, setfilterData] = useState<Object[]>([]);
    const [showData, setShowData] = useState<Object[]>([]);

    const [formData, setFormData] = useState<FormDataProps>({});
    const [errors, setErrors] = useState<ErrorLogProps>({});
    const [ctrlData, setCtrlData] = useState<{[key: string]: number| null}>({});

    if(!(user.isAdmin() || user.isTeacher())) navigate("/");
    const [typeCase, setTypeCase] = useState<FormDataProps>({
        he: "dh",
        khoa: "",
        monThi: "",
        search: "",
        phong: "",
    });

    const [searchParams] = useSearchParams();
    useEffect(() => {
      const fetchGradingData = async () => {
        try {
          const result = await getListMonGrading(token);
          setListMonThi(result.data);

          const heParam = searchParams.get("he") || "dh";
          const khoaParam = searchParams.get("khoa") || "";
          const monThiParam = searchParams.get("monThi");
          const searchParam = searchParams.get("search") || "";
          const phongParam = searchParams.get("phong") || "";

          setTypeCase({
            he: heParam,
            khoa: khoaParam,
            monThi: monThiParam ?? (result.data.length > 0 ? result.data[0].value : ""),
            search: searchParam,
            phong: phongParam
          });

        } catch (err) {
          console.error(err);
        }
      }

      if (token) fetchGradingData();
    }, []);

    useEffect(() => {
      const heParam = searchParams.get("he") || "";
      const khoaParam = searchParams.get("khoa") || "";
      const monThiParam = searchParams.get("monThi") || "";

      const hasChanged =
        heParam !== typeCase.he ||
        khoaParam !== typeCase.khoa ||
        monThiParam !== typeCase.monThi;

      if (!hasChanged) return; // Không thay đổi thì không cập nhật URL

      const params = new URLSearchParams();
      params.append("he", String(typeCase.he));
      if (String(typeCase.khoa).trim() !== "" && !isNaN(Number(typeCase.khoa))) {
        params.append("khoa", String(typeCase.khoa));
      }
      params.append("monThi", String(typeCase.monThi));

      navigate(`/cham-diem?${params.toString()}`, { replace: true });
      setCallData(true);
    }, [typeCase.he, typeCase.khoa, typeCase.monThi]);


    useEffect(() => {
      const fetchData = async () => {
        setIsLoading(true);
        setDataError("");
        try {
          console.log(typeCase);
          const result = await GetListTS(token, {
            he: typeCase.he,
            khoa: typeCase.khoa,
            monThi: typeCase.monThi
          });

          // console.log(result);

          if (!result.data || Object.keys(result.data).length === 0 || !result.data.list) {
            dataRef.current = [];
          }else{
            dataRef.current = result.data.list;
          }

          const tempList: { label: string; value: string }[] = [];
          for (const item of result.data.list) {
            const exists = tempList.find(p => p.value === item.maPhong);
            if (!exists) {
              tempList.push({ label: item.maPhong, value: item.maPhong });
            }
          }
          setUniquePhongList(tempList);
          setTriggerData(true)
          setHandleData(false);
          setIsAllowed(result.data.allow);
          setData(dataRef.current);
        } catch (error) {
          console.error(error);
          setDataError("Có sự cố xảy ra");
        } finally {
          setIsLoading(false);
        }
      }

      if(callData){
        fetchData();
        setCallData(false);
      }
    }, [callData])

    useEffect(() => {
      const filtingData = () => {
        // console.log("count");
        const filtered = (data as any[])
          .map((item, index) => ({ ...item, index })) // gắn index vào từng item
          .filter(item =>
            item.examId.includes(typeCase.search) &&
            (typeCase.phong === "" || item.maPhong === typeCase.phong)
          );

        setfilterData(filtered);

      if(triggerData){
        setPage({
          curNum: 1,
          totalPage: Math.ceil(filtered.length / LIMIT_STUDENT)
        });
        setTriggerData(false);
        }
      };

      filtingData();
    }, [data, typeCase.search, typeCase.phong]);

    useEffect(() => {setTriggerData(true)},[typeCase.search, typeCase.phong])

    useEffect(() => {
      const start = (page.curNum - 1) * LIMIT_STUDENT;
      const end = Math.min(start + LIMIT_STUDENT, filterData.length);

      const temp_transfer: any[] = [];

      for (let i = start; i < end; i++) {
        const ele_data:any = filterData[i];
        const updatedEle = {
          ...ele_data,
          diemInput: (
            <InputField
              id={`item_${ele_data.index}`}
              name={`item_${ele_data.index}`}
              value={formData?.[`item_${ele_data.index}`] || ""}
              formData={formData}
              setFormData={setFormData}
              options={new InputOptions({restrict: true})}
              valids={new NumberValids({minLimit: 0, maxLimit: 10})}
              errors={errors}
              setErrors={setErrors}
              disabled={!isAllowed}
            />
          ),
        };

        temp_transfer.push(updatedEle);
      }
      setShowData(temp_transfer);
    }, [formData]);

    useEffect(() => {
  const fetchAndUpdateData = async () => {
    if (handleData) {
      await updateArrFromObj(
        formData,
        dataRef.current,
        data,
        setData,
        ctrlData,
        setCtrlData
      );
    } else {
      setCtrlData({});
    }

    setHandleData(true);

    const start = (page.curNum - 1) * LIMIT_STUDENT;
    const end = Math.min(start + LIMIT_STUDENT, filterData.length);

    const initialFormData: FormDataProps = {};
    const initialErrors: ErrorLogProps = {};

    console.log(filterData);
    for (let i = start; i < end; i++) {
      const ele_data: any = filterData[i];
      const itemKey = `item_${ele_data.index}`;
      initialFormData[itemKey] = String(ele_data.diem ?? "");
      initialErrors[itemKey] = "";
    }

    setFormData(initialFormData);
    setErrors(initialErrors);
  };

  fetchAndUpdateData();
}, [page, typeCase.search, typeCase.phong, dataRef.current]);

// useEffect(() => {
//   console.log("ctrlData đã cập nhật:", ctrlData);
// }, [ctrlData]);

  const handleReset = () => {
    setCallData(true);
  }

  const handleSubmit = async (getCtrlData: {[key: string]: number | null}) => {
    console.log(getCtrlData)
    if(Object.keys(getCtrlData).length === 0) return;
      try{
      const result = await UpdateTS(token, {data: getCtrlData, he: typeCase.he, khoa: typeCase.khoa, monThi: typeCase.monThi});
      if(result) console.log(result);
      setCallData(true);
      }catch(error: any){
        console.error(error);
      }
    }

  return (
        <div className='manager-exam-result-body'>
            <section className='manager-exam-result-header'>
                <h2 className='title'>Chấm điểm</h2>
                <p className='description'>Vui lòng chọn kỳ thi và môn thi để chấm!</p>
                <form>
                  <div className='dropdown-grid'>
                    <Dropdown
                        name="he"
                        id="he"
                        choices={ANH_XA}
                        value={String(typeCase.he)}
                        setFormData={setTypeCase}
                        label='Kỳ thi'
                    />
                    <InputField
                        type='number'
                        id="khoa"
                        name= "khoa"
                        value={typeCase.khoa}
                        formData={typeCase}
                        setFormData={setTypeCase}
                        placeholder='khoa'
                    />
                    <Dropdown
                        name="monThi"
                        id="monThi"
                        choices={listMonThi}
                        value={String(typeCase.monThi)}
                        setFormData={setTypeCase}
                        label='môn thi'
                    />
                  </div>
                  <InputField
                    name="search"
                    id="search"
                    placeholder='Tìm kiếm'
                    value={typeCase.search}
                    maxLength={70}
                    formData={typeCase}
                    setFormData={setTypeCase}
                  />
                  <Dropdown
                    name="phong"
                    id="phong"
                    choices={uniquePhongList}
                    value={String(typeCase.phong)}
                    setFormData={setTypeCase}
                    label='Phòng thi'
                    allowDefault={true}
                  />
                </form>
                <div className="button-form">
                    <Button
                        type="button"
                        className="btn-confirm"
                        onClick={async () => {
                          const getCtrlData = await updateArrFromObj(formData, dataRef.current, data, setData, ctrlData, setCtrlData);
                          await handleSubmit(getCtrlData);
                        }}
                        text="Cập nhật!"
                        disabled={isLoading}
                    />
                    <Button
                        type="button"
                        onClick={handleReset}
                        text="Khôi phục"
                        disabled={isLoading}
                    />
                </div>
            </section>
            <span className='error-message'>Lưu ý: Dữ liệu sẽ không cập nhật điểm bị nhập sai.</span>
            <section className='manager-exam-result-content'>
                <ListTable
                  struct={showData}
                  headers={HEADERS}
                  error={dataError}
                />
                <Pagination
                  curNum={page.curNum}
                  listLength={page.totalPage}
                />
            </section>
        </div>
    );
};


const updateArrFromObj = async (
  obj: FormDataProps,
  arr: any[],
  data: any[],
  setArr: React.Dispatch<React.SetStateAction<any[]>>,
  ctrlObj: {[key: string]: number | null},
  setCtrlObj: React.Dispatch<React.SetStateAction<{[key: string]: number | null}>>
): Promise<{[key: string]: number | null}> => {
  const updatedArr = [...arr];
  const updatedCtrl: {[key: string]: number| null} = { ...ctrlObj };
  let isChange = false;
  // console.log("trước")
  // console.log(obj);
  // console.log(ctrlObj);
  await sleep(100);

  for (const key in obj) {
      const index = Number(key.split('_')[1]); // Ví dụ: "mon1" từ "mon1_num"
      const diem = obj[key]; // ví dụ obj["mon1"] = 8

      let diemInt: number | null = null;
      if (diem === "") {
        diemInt = null;
      } else {
        const parsed = Number(diem);
        if (isNaN(parsed) || parsed < 0 || parsed > 10) continue;

        diemInt = Math.round(parsed * 100) / 100; // Làm tròn 2 chữ số sau dấu phẩy
      }

      if (!arr[index] || !arr[index].examId) return {};

      const examId = arr[index].examId;
      const currentDiem = arr[index].diem;

        // console.log(examId)
        // console.log(currentDiem)
        // console.log(diemInt)

      if (currentDiem !== diemInt) {
        // Nếu ctrl chưa có thì thêm mới hoặc đã có nhưng khác thì cập nhật lại
        if (!updatedCtrl.hasOwnProperty(examId) || updatedCtrl[examId] !== diemInt) {
          // console.log("cập nhật " + examId);
          updatedCtrl[examId] = diemInt;
        }
      } else {
        // Nếu điểm không thay đổi thì xóa khỏi ctrl
        if (updatedCtrl.hasOwnProperty(examId)) {
          // console.log("xóa " + examId);
          delete updatedCtrl[examId];
        }
      }

      if (data[index].diem !== diemInt){
        isChange = true;
        updatedArr[index] = {
          ...updatedArr[index],
          diem: diemInt,
        };
      }
  }

  console.log("sau")
  console.log(updatedCtrl);
  setCtrlObj(updatedCtrl);
  if(isChange) setArr(updatedArr);
  return updatedCtrl;
}


