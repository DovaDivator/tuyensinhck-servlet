import {JSX, useEffect } from 'react';
import './InfoBackground.scss';

import Header from './Header';
import MainWarpper from './MainWarpper';
import Footer from './Footer';
import { toggleScrollAnimation } from '../../../function/triggers/toggleScrollAnimation';
import { BackgroundProps } from '../../../types/jsxElementInterfaces';


/**
 * `IndexBackground` là một layout component dành cho các chỉnh sửa thông tin
 *
 * @param {BackgroundProps} props - Thuộc tính của component.
 * @param {React.ReactNode} props.children - Nội dung được hiển thị bên trong component.
 * @param {number} [props.delay=0] - Thời gian trễ (ms) cho hiệu ứng chuyển động (scroll animation).
 * @param {string} [props.className=''] - Lớp CSS tùy chỉnh cho vùng bao ngoài.
 *
 * @returns {JSX.Element} Phần tử React được render.
 */
const IndexBackground = ({ children, delay = 0, className = "" }: BackgroundProps) => {
  useEffect(() => {
    if (delay !== 0) {
      toggleScrollAnimation('.info-background__content', delay);
    }
  }, []);

  return (
    <div className={`info-background ${className}`}>
      <div className="info-background__content">
        <Header/>
        <MainWarpper className="info">
          {children}
        </MainWarpper>
      </div>
    </div>
  );
};

export default IndexBackground;

