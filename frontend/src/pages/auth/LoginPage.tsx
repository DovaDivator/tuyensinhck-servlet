import React, {JSX} from 'react';
import { Helmet } from 'react-helmet-async';
import LoginForm from '../../views/feature/login/LoginForm';
import GuestBackground from '../../views/ui/layout/GuestBackground';
import MainWarpper from '../../views/ui/layout/MainWarpper';
import Card from '../../views/ui/components/Card';
import './LoginPage.scss';

const LoginPage = (): JSX.Element => {
  return (
    <div>
      <Helmet>
        <title>Đăng nhập - Web tuyển sinh</title>
      </Helmet>
      <GuestBackground delay={1000}>
          <Card className={"login-container"}>
            <figure className="login-image"></figure> 
            <LoginForm/>
          </Card>
      </GuestBackground>
    </div>
  );
};

export default LoginPage;