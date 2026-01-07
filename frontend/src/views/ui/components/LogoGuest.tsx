import {JSX} from 'react';
import logo from '../../../assets/images/logo-01.png';
import './LogoGuest.scss';

const LogoGuest = (): JSX.Element => {
  return (
    <img src={logo} alt="University Logo" className="logo-guest" />
  );
}

export default LogoGuest;