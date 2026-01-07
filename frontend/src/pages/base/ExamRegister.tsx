import { JSX, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

import IndexBackground from '../../views/ui/layout/IndexBackground';

import "./ExamRegister.scss";
import { useAuth } from '../../context/AuthContext';
import { GetConfirmCccd } from '../../api/StudentCccd';
import DeniedCccdList from '../../views/feature/ExamRegister/DeniedCccdList';
import WaitingComfirm from '../../views/feature/ExamRegister/WaitingConfirm';
import ExamRegisterCondition from '../../views/feature/ExamRegister/ExamRegisterCondition';
import { useNavigate } from 'react-router-dom';

const ManagerCccdPage = (): JSX.Element => {
  const {token, user} = useAuth();
  const [jsx, setJsx] = useState<JSX.Element>(<></>)
  const navigate = useNavigate();
  if(!user.isStudent()) navigate("/");

  useEffect(() => {
    const fetchDataCase = async () => {
      try{
        const result = await GetConfirmCccd(token);
        console.log(result);
        if(!result.success) throw new Error("Lỗi trả về dữ liệu");

        switch(result.data){
          case -3000:
            setJsx(<DeniedCccdList caseDeny={0}/>);
            break;
          case -1:
            setJsx(<DeniedCccdList caseDeny={1}/>);
            break;
          case 0:
            setJsx(<WaitingComfirm/>);
            break;
          case 1:
            setJsx(<ExamRegisterCondition token={token}/>);
            break;
          default:
            throw new Error("Mã không khớp " + result.data);
        }
      }catch(error: any){
        console.error(error);
      }
    }

    fetchDataCase()
  }, [])

  return (
      <div>
      <Helmet>
        <title>Đăng ký thi - Web tuyển sinh</title>
      </Helmet>
      <IndexBackground>
        {jsx}
      </IndexBackground>
    </div>
    );
};

export default ManagerCccdPage;

