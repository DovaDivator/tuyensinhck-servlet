import React, { useState, useEffect, JSX } from "react";
import { useNavigate } from "react-router-dom";
import { useInView } from "react-intersection-observer";

import { jsxEleProps } from "../../../types/jsxElementInterfaces";

import Button from "../../ui/input/Button";
import Countdown from "../../ui/components/Countdown";

import "./BoDemLichThi.scss";
import { fetchKyThi } from "../../../api/FetchKyThi";
import { fetchVietnamTime } from "../../../api/FetchVietnamTime";
import { parseFlexibleDate } from "../../../function/convert/parseFlexibleDate";

interface BoDemLichThiProps extends jsxEleProps {
    type?: string;
}

const BoDemLichThi = ({className = "", type = ""}: BoDemLichThiProps): JSX.Element => {
  const navigate = useNavigate();

  const FORM_LIST = [
    "Thời gian mở kỳ thi sẽ điễn ra sau:",
    "Kỳ thi đã mở, hãy tham gia ngay!",
    "Kỳ thi đã đóng, cảm ơn bạn đã quan tâm!",
  ]

  const BUTTON_CLASS_PHASE = ["hide", "start", "loop"];
  const [buttonAnimation, setButtonAnimation] = useState(BUTTON_CLASS_PHASE[0]);
  const [time, setTime] = useState<any>({
    statusNum: 2,
  });

  const { ref, inView } = useInView({
    triggerOnce: true, 
    threshold: 0.3,
  });

  useEffect(() => {
    if (inView) {
      const startLoopAnimation = () => {
        setTimeout(() => {
          setButtonAnimation(BUTTON_CLASS_PHASE[2]);

          setTimeout(() => {
            setButtonAnimation("");
            setTimeout(startLoopAnimation, 5000);
          }, 1250);
        }, 5000);
      };

      setButtonAnimation(BUTTON_CLASS_PHASE[1]);
      startLoopAnimation();

      return () => {};
    }
  }, [inView]);

  useEffect(() => { 
    const fetchData = async () => {
      try{
        const result = await fetchKyThi(type);
        if(result.data.length === 0) throw new Error("Dữ liệu rỗng!");

        const item = result.data[0];
        if(!("timeStart" in item && "timeEnd" in item)) throw new Error("Dữ liệu bị thiếu");

        const timeNow = await fetchVietnamTime();
        if((timeNow.getTime() - parseFlexibleDate(item.timeStart).getTime()) < 0){
          setTime({
            statusNum: 0,
            target: item.timeStart
          });
          return;
        }

        if((timeNow.getTime() - parseFlexibleDate(item.timeEnd).getTime()) < 0){
          setTime({
            statusNum: 1,
            target: item.timeEnd
          });
          return;
        }

      }catch(error: any){
        setTime({statusNum: 2});
        console.error(error);
      }
    }

    if(type) fetchData();
  }, [type])

    return (
        <section className={`bodemlichthi ${className}`} ref={ref}>
            <div className="blur"></div>
            <div>
                <h2 className="bodemlichthi__title">Thời gian mở kỳ thi</h2>
                <p className="bodemlichthi__description">{FORM_LIST[time.statusNum]}</p>
                {([0, 1].includes(time.statusNum)) && (
                  <Countdown timeTarget={time.target}/>
                )}
                {(time.statusNum === 1) && (
                <Button
                    text="Đăng ký ngay!"
                    className={buttonAnimation}
                    onClick={() => navigate("/dang-ky")}
                />
                )}
            </div>
        </section>
    );
}

export default BoDemLichThi;