import {JSX, useState, useEffect} from "react";
import { useInView } from "react-intersection-observer";
import { useParams, useNavigate, Link} from "react-router-dom";
import { Helmet } from "react-helmet-async";
import InfoBackground from "../../views/ui/layout/InfoBackground";
import "./InfoPage.scss";
import SwitchPasswordForm from "../../views/feature/info/SwitchPasswordForm";
import BaseInfomation from "../../views/feature/info/BaseInfomation";
import { useAuth } from "../../context/AuthContext";
import CccdEdit from "../../views/feature/info/CccdEdit";
import { BasicUserTitle } from "../../classes/BasicUserInfo";
import TraCuuExam from "../../views/feature/info/TraCuuExam";

const CLASS_PAGE = "info";
const CLASS_PAGE_GROUPS: Record<string, string[]> = {
  allUser: ['thong-tin-ca-nhan', 'doi-mat-khau'],
  studentCase: ['cap-nhat-cccd', 'tra-cuu-ky-thi'],
  teacherCase: [],
  adminCase: []
};

const COMPONENT_MAP:Record<string, JSX.Element> ={
  'thong-tin-ca-nhan': <BaseInfomation />,
  'doi-mat-khau': <SwitchPasswordForm />,
  'cap-nhat-cccd': <CccdEdit/>,
  'tra-cuu-ky-thi': <TraCuuExam/>
}

const PAGE_LABELS:Record<string, String> ={
  'thong-tin-ca-nhan': 'Thông tin cá nhân',
  'doi-mat-khau': 'Thay đổi mật khẩu',
  'cap-nhat-cccd': 'Cập nhật CCCD',
  'tra-cuu-ky-thi': 'Tra cứu kỳ thi',
}

const InfoPage = (): JSX.Element => {
    const navigate = useNavigate();
    const { type } = useParams();
    const {user} = useAuth();
    const [errorLink, setErrorLink] = useState<boolean>(false);
    
    const isAccessible = (type: string, user: BasicUserTitle): boolean => {
      if (CLASS_PAGE_GROUPS.allUser.includes(type)) return true;
      if (CLASS_PAGE_GROUPS.studentCase.includes(type)) return user.isStudent();
      if (CLASS_PAGE_GROUPS.teacherCase.includes(type)) return user.isTeacher(); // giả sử có method
      if (CLASS_PAGE_GROUPS.adminCase.includes(type)) return user.isAdmin();     // giả sử có method
      return false;
    };

    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.2,
    });

    useEffect(() => {
    if (errorLink) {
      navigate('/info/thong-tin-ca-nhan');
    }
  }, [errorLink]);

    const ANIMATION_CLASS_PHASE = ["hide", "start"];
    const [animationClass, setAnimationClass] = useState(ANIMATION_CLASS_PHASE[0]);

    useEffect(() => {
        if (inView) {
            setAnimationClass(ANIMATION_CLASS_PHASE[1]);
        }
    }, [inView]);

    const LeftMenu = (): JSX.Element =>{
      return(
        <div className="left-menu">
          <ul>
            <li className={type === CLASS_PAGE_GROUPS.allUser[0] ? "active" : ""}>
              <Link to="/info/thong-tin-ca-nhan">{PAGE_LABELS['thong-tin-ca-nhan']}</Link>
            </li>
            {user.isStudent() &&
              CLASS_PAGE_GROUPS.studentCase.map((page) => {
                if (!(page in COMPONENT_MAP)) return null; // Bỏ qua nếu không có component
                return (
                  <li key={page} className={type === page ? "active" : ""}>
                    <Link to={`/info/${page}`}>{PAGE_LABELS[page]}</Link>
                  </li>
                );
              })}
            <li className={type === CLASS_PAGE_GROUPS.allUser[1] ? "active" : ""}>
              <Link to="/info/doi-mat-khau">{PAGE_LABELS['doi-mat-khau']}</Link>
            </li>
          </ul>
        </div>
      )
    }

    const RightContent = (): JSX.Element =>{
      if(user.isGuest()) return(<></>);
      const page = type || '';
        if (isAccessible(page, user) && COMPONENT_MAP[page]) {
          return COMPONENT_MAP[page];
        }
        setErrorLink(true);
        return(<></>);
    }

    return (
        <div>
      <Helmet>
        <title>Cá nhân - Web tuyển sinh</title>
      </Helmet>
      <InfoBackground>
          <LeftMenu/>
          <div ref={ref} className={`right-side ${animationClass}`}>
            <RightContent/>
          </div>
      </InfoBackground>
    </div>
    );
};

export default InfoPage;