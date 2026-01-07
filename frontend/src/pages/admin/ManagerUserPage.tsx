import { JSX, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../../context/AuthContext';

import IndexBackground from '../../views/ui/layout/IndexBackground';
import ManagerUserList from '../../views/feature/manager/ManagerUserList';

import "./ManagerUserPage.scss";
import ManagerExamContainer from '../../views/feature/manager/ManagerExamContainer';

const ManagerUserPage = (): JSX.Element => {
    const navigate = useNavigate();
    const { type } = useParams();
    const [managerEle, setManagerEle] = useState<JSX.Element>(<></>);
    const [namePg, setNamePg] = useState<string>("");

      const {user} = useAuth();
      if(!user.isAdmin()) navigate("/");

    const CLASS_PAGES = ['giao-vien', 'thi-sinh', 'tai-khoan', 'ky-thi'];

    /**
     * Điều phối trang và gắn giá trị hiển thị
     */
    useEffect(() => {
        const getPageInfo = ({ type = "" }: { type?: string }): void => {
        let name = "";
        let ele = <></>;

        switch (type) {
            case CLASS_PAGES[0]:
                name = "giáo viên";
                ele = <ManagerUserList name={name} />;
                break;
            case CLASS_PAGES[1]:
                name = "thí sinh";
                ele = <ManagerUserList name={name} />;
                break;
            case CLASS_PAGES[2]:
                name = "tài khoản";
                ele = <ManagerUserList name={name} />;
                break;
            case CLASS_PAGES[3]:
                name = "kỳ thi";
                ele = <ManagerExamContainer/>;
                break;
            default:
                console.error("lỗi url " + type);
                navigate("/");
                return;
        }

        setNamePg(name);
        setManagerEle(ele);
    };
        getPageInfo({type});
    }, []);

  return (
      <div>
      <Helmet>
        <title>Quản lý {namePg} - Web tuyển sinh</title>
      </Helmet>
      <IndexBackground>
        {managerEle}         
      </IndexBackground>
    </div>
    );
};

export default ManagerUserPage;
