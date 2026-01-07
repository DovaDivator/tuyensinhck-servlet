import React, { useState, JSX, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../../../context/AppContext'; // Import AppContext
import InputField from '../../ui/input/InputField';
import Button from '../../ui/input/Button';
import './LoginForm.scss';
import LogoGuest from '../../ui/components/LogoGuest';
import { checkValidSubmitUtils } from '../../../function/triggers/checkValidSubmitUtils';
import { InputOptions } from '../../../classes/InputOption';
import { InputValids } from '../../../classes/InputValids';
import { forgotPassword } from '../../../function/user-action/forgotPassword';
import { FormDataProps, ErrorLogProps, DataOptionsProps, DataValidsProps } from '../../../types/FormInterfaces';
import { useAuth } from "../../../context/AuthContext";
import { showToast } from '../../../alert/alertToast';
import { alertBasic } from '../../../alert/alertBasic';

const LoginForm = ():JSX.Element => {
  const { isLoading, setIsLoading } = useAppContext();
  const { login} = useAuth();

  const [formData, setFormData] = useState<FormDataProps>({
    username: '',
    password: ''
  });     


  const [errors, setErrors] = useState<ErrorLogProps>({
    username: '',
    password: ''
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const options: DataOptionsProps = {
    username: new InputOptions({ restrict: true }),
    password: new InputOptions({ restrict: true })
  };

  const valids: DataValidsProps = {
    username: new InputValids({ required: true, matchType: ['email', 'phone'] }),
    password: new InputValids({ minlength: 6, required: true, matchType: ['password'] })
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);
    const validResult = await checkValidSubmitUtils(formData, valids, setErrors);
    if (!validResult) {
      showToast('error', '', 'Vui lòng kiểm tra lại thông tin đăng nhập!');
      setIsSubmitting(false);
      return;
    }
    setIsLoading(true);
    try {
      const success = await login(String(formData.username), String(formData.password));

      if (success) {
        showToast('success', '', 'Đăng nhập thành công!');
      } else {
        alertBasic({
          icon: 'error',
          title: 'Đăng nhập thất bại!',
          message: 'Tên đăng nhập hoặc mật khẩu không đúng!'
        });
      }
    } catch (error) {
      alertBasic({
        icon: 'error',
        title: 'Lỗi hệ thống!',
        message: 'Không thể kết nối máy chủ hoặc đã xảy ra lỗi bất ngờ.'
      });
    } finally {
      setIsLoading(false);
      setIsSubmitting(false);
    }
  };

  return (
    <section className="login-form-container">
      <LogoGuest />
      <h1>Đăng nhập</h1>
      <form
        onSubmit={handleSubmit}
        id="login-form"
        noValidate
      >
        <InputField
          type="text"
          name="username"
          id="username"
          placeholder="Email hoặc SĐT"
          value={formData.username}
          maxLength={255}
          formData={formData}
          setFormData={setFormData}
          options={options.username}
          errors={errors}
          setErrors={setErrors}
          valids={valids.username}
          isSubmiting={isSubmitting}
        />
        <InputField
          type="password"
          name="password"
          id="password"
          placeholder="Mật khẩu"
          value={formData.password}
          maxLength={20}
          formData={formData}
          setFormData={setFormData}
          options={options.password}
          errors={errors}
          setErrors={setErrors}
          valids={valids.password}
          isSubmiting={isSubmitting}
        />
        <Button
          type="submit"
          text={isLoading ? 'Đang xác nhận...' : 'Đăng nhập'}
          disabled={isLoading}
        />
      </form>
      <Link to="/dang-ky" className="register-link">Đăng ký tài khoản sinh viên ở đây!</Link>
      <a href="" className="forgot-link" onClick={(e) => forgotPassword(e)}>Quên mật khẩu?</a>
    </section>
  );
};

export default LoginForm;