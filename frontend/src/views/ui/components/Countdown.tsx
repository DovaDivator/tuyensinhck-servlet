import { JSX, useState, useEffect } from 'react';
import { jsxEleProps } from '../../../types/jsxElementInterfaces';

import './Countdown.scss';
import { fetchVietnamTime } from '../../../api/FetchVietnamTime';

interface CountdownProps extends jsxEleProps{
  timeTarget?: Date | number;
}

const Countdown = ({ className = '', timeTarget = new Date().getTime()}: CountdownProps): JSX.Element => {
  const [currentTime, setCurrentTime] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const targetDate = typeof timeTarget === 'number'
  ? timeTarget
  : timeTarget instanceof Date
    ? timeTarget.getTime()
    : new Date().getTime();

  useEffect(() => {
    let interval: number;

    fetchVietnamTime().then((vietnamTime) => {
      let now = vietnamTime.getTime();
      setCurrentTime(now);

      // Bắt đầu đếm lùi từng giây
      interval = window.setInterval(() => {
        now += 1000;
        setCurrentTime(now);
      }, 1000);
    });

    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (currentTime === null) return;

    const distance = targetDate - currentTime;

    if (distance <= 0) {
      setTimeLeft({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      });
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    setTimeLeft({ days, hours, minutes, seconds });
  }, [currentTime]);

  if(
    timeLeft.days === 0 &&
    timeLeft.hours === 0 &&
    timeLeft.minutes === 0 &&
    timeLeft.seconds === 0
  ) return(<></>);

  return (
    <div className={`countdown-container ${className}`}>
      <div className="countdown-unit">
        <span className="countdown-unit__time">{timeLeft.days}</span>
        <span className="countdown-unit__name">Ngày</span>
      </div>
      <div className="countdown-unit">
        <span className="countdown-unit__time">{timeLeft.hours}</span>
        <span className="countdown-unit__name">Giờ</span>
      </div>
      <div className="countdown-unit">
        <span className="countdown-unit__time">{timeLeft.minutes}</span>
        <span className="countdown-unit__name">Phút</span>
      </div>
      <div className="countdown-unit">
        <span className="countdown-unit__time">{timeLeft.seconds}</span>
        <span className="countdown-unit__name">Giây</span>
      </div>
    </div>
  );
};

export default Countdown;
