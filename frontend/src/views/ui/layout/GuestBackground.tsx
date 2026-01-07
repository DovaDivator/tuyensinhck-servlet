import React, { useEffect, ReactNode, JSX } from 'react';
import Blur from '../components/Blur';
import './GuestBackground.scss';
import { toggleScrollAnimation } from '../../../function/triggers/toggleScrollAnimation';
import MainWarpper from './MainWarpper';
import { BackgroundProps } from '../../../types/jsxElementInterfaces';

/**
 * `GuestBackground` là một layout component dành cho các trang dành cho khách (guest),
 * bao gồm hiệu ứng mờ nền và một vùng nội dung ở giữa.
 *
 * @param {BackgroundProps} props - Thuộc tính của component.
 * @param {React.ReactNode} props.children - Nội dung được hiển thị bên trong component.
 * @param {number} [props.delay=0] - Thời gian trễ (ms) cho hiệu ứng chuyển động (scroll animation).
 * @param {string} [props.className=''] - Lớp CSS tùy chỉnh cho vùng bao ngoài.
 *
 * @returns {JSX.Element} Phần tử React được render.
 */
const GuestBackground = ({ children, delay = 0, className = '' }: BackgroundProps): JSX.Element => {
  useEffect(() => {
    if (delay > 0) {
      toggleScrollAnimation('.guest-background__content', delay);
    }
  }, [delay]);

  return (
    <div className={`guest-background ${className}`}>
      <Blur className={"guest-background__blur"}/>
      <div className="guest-background__content">
        <MainWarpper>
          {children}
        </MainWarpper>
      </div>
    </div>
  );
};

export default GuestBackground;
