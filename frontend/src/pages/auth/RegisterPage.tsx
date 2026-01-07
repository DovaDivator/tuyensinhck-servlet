import React, {JSX} from 'react';
import { Helmet } from 'react-helmet-async';
import RegisterForm from '../../views/feature/register/RegisterForm';
import GuestBackground from '../../views/ui/layout/GuestBackground';

import Card from '../../views/ui/components/Card';
import './RegisterPage.scss';

const RegisterPage = (): JSX.Element => {
  return (
    <div>
      <Helmet>
        <title>Đăng ký tài khoản tuyển sinh - Web tuyển sinh</title>
      </Helmet>
      <GuestBackground delay={1000}>
          <Card className={"register-container"}>
            <figure className="register-image"></figure>
            <RegisterForm/>
          </Card>
      </GuestBackground>
    </div>
  );  
};

export default RegisterPage;