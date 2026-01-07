import {JSX, useEffect, useState} from 'react';
import { useSearchParams } from "react-router-dom";
import { GetExamExist, insertExam } from '../../../api/StudentExam';
import { fetchListKyThi } from '../../../api/FetchKyThi';
import ExistExam from './ExistExam';
import EmptyList from './EmptyListDK';
import { ErrorLogProps, FormDataProps } from '../../../types/FormInterfaces';
import Dropdown from '../../ui/input/Dropdown';
import { DropdownValids } from '../../../classes/DrowdownValids';
import Button from '../../ui/input/Button';
import { useAppContext } from '../../../context/AppContext';
import { checkValidSubmitUtils } from '../../../function/triggers/checkValidSubmitUtils';
import { getListMonChoice } from '../../../api/GetMonHoc';
import Card from '../../ui/components/Card';
import './ExamDesign.scss';


const ExamRegisterCondition = ({token = ""}: {token: string}):JSX.Element => {
    const [jsx, setJsx] = useState<JSX.Element>(<></>)

    useEffect(() => {
        const GetData = async () => {
            try{
                const resultExam = await GetExamExist(token);
                if(!resultExam.data){
                    setJsx(<ExistExam/>);
                    return;
                }

                const resultList = await fetchListKyThi();
                if(!resultList.data || resultList.data.length === 0){
                    setJsx(<EmptyList/>);
                    return;
                }

                setJsx(<ExamRegisterContainer listDK={resultList.data} token={token}/>);

                console.log(resultList);
            }catch(error: any){
                console.error(error);
            }
        }

        if(token) GetData();
    },[token])

    return(jsx);
}

export default ExamRegisterCondition;

const ANH_XA = [
    {value: "dh", label: "Đại học"},
    {value: "cd", label: "Cao đẳng"},
    {value: "lt", label: "Liên thông"}
];

const ExamRegisterContainer = ({listDK, token}: {listDK: string[], token: string}): JSX.Element => {
    const {isLoading, setIsLoading} = useAppContext();
    const [searchParams] = useSearchParams();
    const type = searchParams.get("type") || "";

    const [dataMon, setDataMon] = useState({
        monTC: [],
        monNN: []
    })
    
    const filtered = ANH_XA.filter(item => listDK.includes(item.value));

    const [formData, setFormData] = useState<FormDataProps>({
        typeExam: type,
        monTC: "",
        monNN: "",
    })

    const [error, setError] = useState<ErrorLogProps>({
        typeExam: type,
        monTC: "",
        monNN: "",
    })

    const valids = {
        typeExam: new DropdownValids({required: true}),
        monTC: new DropdownValids({required: true}),
        monNN: new DropdownValids({required: true}),
    }

    useEffect(() => {
        setIsLoading(true);
        const getDataMon = async () => {
            try{
                const result = await getListMonChoice();;
                console.log(result)
                if(!result.data) throw new Error("Không có dữ liệu");
                setDataMon(result.data);
            }catch(error: any){
                console.error(error);
            }
        }

        getDataMon();
        setIsLoading(false);
    }, [])

    const handleReset = () =>{
        setFormData({
            typeExam: type,
            monTC: "",
            monNN: "",
        })
    }

    const handleSubmit = async () =>{
            //Hàm kiểm tra ở đây
            setIsLoading(true);
            const validate = checkValidSubmitUtils(formData, valids, setError);
            console.log(validate);
            if(!validate){
                setIsLoading(false);
                return;
            }
    
            try{
                const result = await insertExam(token, formData);
                console.log(result);
            }catch(error: any){
                console.error(error)
            }
            setIsLoading(false);
        }

    return(
    <section>
    <Card className='exam-register-container'>
        <h2>Đăng ký kỳ thi</h2>
        <form>
            <div className='label-dropdown'>
                <span>Chọn kỳ thi đang diễn ra:</span>
                <Dropdown
                    name="typeExam"
                    id="typeExam"
                    choices={Object.values(filtered)}
                    value={String(formData.typeExam)}
                    setFormData={setFormData}
                    errors={error}
                    setErrors={setError}
                    valid={valids.typeExam}
                />
            </div>
            <div className='label-dropdown'>
                <span>Môn tự chọn:</span>
                <Dropdown
                    name="monTC"
                    id="monTC"
                    choices={dataMon.monTC}
                    value={String(formData.monTC)}
                    setFormData={setFormData}
                    errors={error}
                    setErrors={setError}
                    valid={valids.monTC}
                />
            </div>
            <div className='label-dropdown'>
                <span>Môn ngoại ngữ:</span>
                <Dropdown
                    name="monNN"
                    id="monNN"
                    choices={dataMon.monNN}
                    value={String(formData.monNN)}
                    setFormData={setFormData}
                    label="môn ngoại ngữ"
                    errors={error}
                    setErrors={setError}
                    valid={valids.monNN}
                />
            </div>
        </form>
        <div className="button-form">
                    <Button
                        type="button"
                        className="btn-confirm"
                        onClick={handleSubmit}
                        text="Cập nhật!"
                        disabled={isLoading}
                    />
                    <Button
                        type="button"
                        className="btn-cancel"
                        onClick={handleReset}
                        text="Khôi phục"
                        disabled={isLoading}
                    />            
        </div>
    </Card>
    </section>
    );
}

