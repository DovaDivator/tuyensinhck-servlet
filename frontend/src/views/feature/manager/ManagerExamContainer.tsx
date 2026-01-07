import React,{JSX, useState, useEffect, useRef} from 'react';
import { parsePath, useLocation, useNavigate, useSearchParams} from "react-router-dom";
import { useAuth } from '../../../context/AuthContext';

import { jsxEleProps } from '../../../types/jsxElementInterfaces';
import './ManagerUserList.scss';
import ListTable from '../../ui/components/ListTable';
import { DataValidsProps, ErrorLogProps, FormDataProps} from '../../../types/FormInterfaces';
import InputChoice from '../../ui/input/InputChoice';
import Button from '../../ui/input/Button';
import Dropdown from '../../ui/input/Dropdown';
import { useAppContext } from '../../../context/AppContext';
import { fetchKyThi } from '../../../api/FetchKyThi';
import DatetimePicker from '../../ui/input/DatetimePicker';
import Card from '../../ui/components/Card';
import { parseFlexibleDate } from '../../../function/convert/parseFlexibleDate';
import { DateValids } from '../../../classes/DateValids';
import { fetchVietnamTime } from '../../../api/FetchVietnamTime';
import { checkValidSubmitUtils } from '../../../function/triggers/checkValidSubmitUtils';
import { UpdateOpenKyThi, UpdateOpenNgayThi } from '../../../api/KyThiEdit';
import { showToast } from '../../../alert/alertToast';

const HEADERS = {
    loaiThiLabel: "Cấp bậc",
    khoa: "Khóa thi",
    timeStart: "Thời gian mở",
    timeEnd: "Thời gian đóng",
    dateExam: "Ngày tổ chức",
    status: "Tình trạng",
    adding: "Bổ sung?"
}
const ANH_XA = [
    {value: "dh", label: "Đại học"},
    {value: "cd", label: "Cao đẳng"},
    {value: "lt", label: "Liên thông"}
];

const ANH_XA_STATUS = [
  <span className='unknown'>Không xác định</span>,
  <span className='accept'>Đã qua kỳ thi</span>,
  <span className='warning'>Trong kỳ thi</span>,
  <span className='unknown'>Chờ thi</span>,
  <span className='denied'>Đã đóng</span>,
  <span className='accept'>Đang mở</span>,
  <span className='unknown'>Chưa mở</span>,
]

const DATE_POINT = (() => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(7, 0, 0, 0);
  return d;
})();

const ManagerExamContainer = ({className = ""}: jsxEleProps): JSX.Element =>{
    const {token} = useAuth();
    const {isLoading, setIsLoading} = useAppContext();
    const navigate = useNavigate();

    const [error, setError] = useState<string>("");
    const [typeCase, setTypeCase] = useState<any>({type: ""});
    const [data, setData] = useState<Object[]>([]);
    const [statusNum, setStatusNum] = useState<number>(0);

    const [searchParams] = useSearchParams();
    useEffect(() => {
      const typeUrl = searchParams.get("type") || "";
      setTypeCase({ type: typeUrl });
    }, [searchParams]);

    const [formData, setFormData] = useState<FormDataProps>({
      timeStart: "",
      timeEnd: "",
      adding: "",
    });

    const [dateExamForm, setDateExamForm] = useState<FormDataProps>({
      dateExam: "",
    });

    const defaultFormRef = useRef<FormDataProps | null>(null);
    const defaultDateExamRef = useRef<FormDataProps | null>(null);

    const [errors, setErrors] = useState<ErrorLogProps>({
      timeStart: "",
      timeEnd: "",
      adding: "",
      dateExam: "",
    });

    const [valids, setValids] = useState<DataValidsProps>({
      timeStart: new DateValids({
        required: true,
        cons: {
          min: {
            value: DATE_POINT
          }
        },
      }),
      timeEnd: new DateValids({
        required: true,
        cons: {
          min: {
            value: "timeStart",
            dist: {
              day: 1,
            }
          }
        },
      }),
    })

    useEffect(() => {
      const statusCase = async (row : Object): Promise<number> =>{
        if(!("timeStart" in row && "timeEnd" in row)) return 0; 
          // return (<span className='unknown'>Không xác định</span>);

        const nowDate = await fetchVietnamTime();

        if("dateExam" in row){
          const dayExam = parseFlexibleDate("07:00 " + row.dateExam);
          
          const durationOne = dayExam.getTime() - nowDate.getTime();
          if(durationOne < -36 * 60 * 60 * 1000) return 1;
            // return (<span className='denied'>Đã thi xong!</span>);

          if(durationOne < 24 * 60 * 60 * 1000) return 2;
            // return (<span className='warming'>Đang trong kỳ thi</span>);

          if(durationOne < 7 * 24 * 60 * 60 * 1000) return 3;
        }

        const durationTwo = nowDate.getTime() - parseFlexibleDate(String(row.timeEnd)).getTime();
        if(durationTwo > 0) return 4;

        const durationThree = nowDate.getTime() - parseFlexibleDate(String(row.timeStart)).getTime();
        if(durationThree > 0) return 5;

        return 6;
      }

        const getData = async () => {
          setIsLoading(true);
          setError("");
    
              try {
                const result = await fetchKyThi();
                console.log(result);
                const mappedData = await Promise.all(
                  result.data.map(async (row: any) => {
                    const matched = ANH_XA.find(item => item.value === row.loaiThi);
                    const statusCaseNum = await statusCase(row);

                    return {
                      ...row,
                      loaiThiLabel: matched?.label || "Không xác định",
                      statusEffect: statusCaseNum,
                      status: ANH_XA_STATUS[statusCaseNum],
                    };
                  })
                );

                setData(mappedData);
              } catch (err) {
                console.error(err);
              } finally {
                setIsLoading(false);
              }
            };
    
            getData();
          }, [typeCase.type]);

    useEffect(() => {
      if(data.length > 0 && typeCase.type !== ""){
      const check = ANH_XA.find(item => item.value === typeCase.type);
                if (check) {
                  const item: any = data.find(row => (row as any).loaiThi === typeCase.type);

                  const formDataTemp = {
                    timeStart: item.timeStart ? item.timeStart : "",
                    timeEnd: item.timeEnd ? item.timeEnd : "",
                    adding: item.adding,
                  }

                  if(item.dateExam){
                    setValids(prev => ({
                      ...prev,
                      timeEnd: new DateValids({
                        required: true,
                        cons: {
                          min: {
                            value: "timeStart",
                            dist: {
                              day: 1,
                            }
                          },
                          max: {
                            value: parseFlexibleDate("07:00 " + item.dateExam),
                            dist: {
                              day: 6,
                            }
                          }
                        },
                      }),
                    }));
                  }

                  if([4, 5, 6].includes(item.statusEffect)){
                    const dateTimeEnd = parseFlexibleDate(item.timeEnd);
                    const duationTiming = dateTimeEnd.getTime() - new Date().getTime();

                    setValids(prev => ({
                      ...prev,
                      dateExam: new DateValids({
                        required: true,
                        cons: {
                          min: {
                            value: duationTiming > 0 ? dateTimeEnd : new Date(),
                            dist: {
                              day: 7,
                            }
                          },
                        },
                      }),
                    }));

                    const dateExamItem = {
                      dateExam: item.dateExam ? item.dateExam : "",
                    }

                    setDateExamForm(dateExamItem);
                    defaultDateExamRef.current = dateExamItem;
                  }
                  // console.log(formDataTemp)
                  setFormData(formDataTemp);
                  defaultFormRef.current = formDataTemp
                  setStatusNum(item.statusEffect ?? 0);
                }}
    }, [typeCase.type, data]);

    useEffect(() => {
      const item = ANH_XA.find(item => item.value === typeCase.type);
        if (item && searchParams.get("type") !== item.value) {
          navigate(`/quan-ly/ky-thi?type=${item.value}`);
        }
    }, [typeCase.type])

    useEffect(() => {
      if(statusNum <= 1) return;

      if(statusNum === 5){
        setValids(prev => {
          const { timeStart, ...rest } = prev;
          return rest;
        });
      }

      if(statusNum <= 3){
        setValids({});
      }

    }, [statusNum])
    
    const handleRegisterReset = () => {
        if (defaultFormRef.current) {
            setFormData(defaultFormRef.current);
        } else {
            setFormData({
              timeStart: "",
              timeEnd: "",
              adding: "",
            })
            console.warn("Dữ liệu mặc định chưa được khởi tạo");
        }
    };

    const handleStartReset = () => {
        if (defaultDateExamRef.current) {
            setDateExamForm(defaultDateExamRef.current);
        } else {
            setDateExamForm({
              dateExam: "",
            })
            console.warn("Dữ liệu mặc định chưa được khởi tạo");
        }
    };

        const handleRegisterSubmit = async () =>{
            //Hàm kiểm tra ở đây
            setIsLoading(true);
            const {dateExam, ...validSplit} = valids;
            const validate = checkValidSubmitUtils(formData, validSplit, setErrors);
            if(!validate){
              showToast('error', '', 'Vui lòng kiểm tra lại thông tin đăng nhập!');
              setIsLoading(false);
              return;
            }
            console.log(validate);
            try{
                const addingString = formData.adding instanceof Array ? formData.adding[0] : formData.adding;
                const result = await UpdateOpenKyThi(token, {...formData, adding: addingString, type: typeCase.type});
                console.log(result);
            }catch(error: any){
                console.error(error)
            }
            setIsLoading(false);
        }

        const handleStartSubmit = async () =>{
            //Hàm kiểm tra ở đây
            setIsLoading(true);
            const { dateExam } = valids;
            const validate = checkValidSubmitUtils(dateExamForm, {dateExam}, setErrors);
            if(!validate){
              showToast('error', '', 'Vui lòng kiểm tra lại thông tin đăng nhập!');
              setIsLoading(false);
              return;
            }
            console.log(validate);
            try{
                const result = await UpdateOpenNgayThi(token, {...dateExamForm, type: typeCase.type});
                console.log(result);
            }catch(error: any){
                console.error(error)
            }
            setIsLoading(false);
        }

    return (
        <section className={`manager-exam ${className}`}>
            <h2>Quản lý kỳ thi</h2>
            <ListTable
              struct={data}
              headers={HEADERS}
              error={error}
            />
            <h4>Chỉnh sửa nhanh:</h4>
            <Dropdown
                name="type"
                id="type"
                choices={ANH_XA}
                value={typeCase.type}
                setFormData={setTypeCase}
                label='Kỳ thi'
            />
            {ANH_XA.some(item => item.value === typeCase.type) && (
              <div className='form-container-ky-thi'>
              <Card className='form-ky-thi'>
              <b>Mở đăng ký</b>
              <form>
                <DatetimePicker
                  type="datetime"
                  name="timeStart"
                  id="timeStart"
                  value={String(formData.timeStart)}
                  setFormData={setFormData}
                  placeholder='Thời gian mở'
                  disabled={[2, 3, 5].includes(statusNum)}
                  errors={errors}
                  setErrors={setErrors}
                  valids={valids.timeStart}
                />
                <DatetimePicker
                  type="datetime"
                  name="timeEnd"
                  id="timeEnd"
                  value={String(formData.timeEnd)}
                  setFormData={setFormData}
                  placeholder='Thời gian đóng'
                  disabled={[2, 3].includes(statusNum)}
                  errors={errors}
                  setErrors={setErrors}
                  valids={valids.timeEnd}
                />
                <InputChoice
                  name="adding"
                  id="adding"
                  choices={[{value: 'true', label: "Bổ sung thí sinh?"}]}
                  value={formData.adding}
                  setFormData={setFormData}
                  disabled={statusNum !== 4}
                />
              </form>
              <div className="button-form">
                    <Button
                        type="button"
                        className="btn-confirm"
                        onClick={handleRegisterSubmit}
                        text="Cập nhật!"
                        disabled={isLoading || [2, 3].includes(statusNum)}
                    />
                    <Button
                        type="button"
                        className="btn-cancel"
                        onClick={handleRegisterReset}
                        text="Khôi phục"
                        disabled={isLoading}
                    />
                </div>
              </Card>
              <Card className='form-ky-thi'>
              <b>Mở kỳ thi</b>
              { [0, 1].includes(statusNum) && 
                <p className='error-message'>Bạn cần phải mở đăng ký trước!</p>
              }
              { [2, 3].includes(statusNum) && 
                <p className='error-message'>Kỳ thi đã chuẩn bị, bạn không thể thay đổi kế hoạch</p>
              }
              { [4, 5, 6].includes(statusNum) && <>
              <form>
                <DatetimePicker
                  type="date"
                  name="dateExam"
                  id="dateExam"
                  value={String(dateExamForm.dateExam)}
                  setFormData={setDateExamForm}
                  placeholder='Thời gian tổ chức'
                  disabled={[0, 1, 2, 3].includes(statusNum)}
                  errors={errors}
                  setErrors={setErrors}
                  valids={valids.dateExam}
                />
              </form>
              <div className="button-form">
                    <Button
                        type="button"
                        className="btn-confirm"
                        onClick={handleStartSubmit}
                        text="Cập nhật!"
                        disabled={isLoading || [2, 3].includes(statusNum)}
                    />
                    <Button
                        type="button"
                        className="btn-cancel"
                        onClick={handleStartReset}
                        text="Khôi phục"
                        disabled={isLoading}
                    />
                </div>
                </>}
              </Card>
              </div>
            )}
        </section>
    );
}

export default React.memo(ManagerExamContainer);

const NullJsxError = (error:string):JSX.Element => {
  console.log(error);
  return<></>;
}
