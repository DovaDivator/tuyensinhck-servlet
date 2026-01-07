import {JSX, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../ui/input/Button";

const DeniedCccdList = ({caseDeny}: {caseDeny: number}): JSX.Element => {
  const navigate = useNavigate();
  const BUTTON_CLASS_PHASE = ["start", "loop"];
  const [buttonAnimation, setButtonAnimation] = useState(BUTTON_CLASS_PHASE[0]);

    useEffect(() => {
      const startLoopAnimation = () => {
          setTimeout(() => {
            setButtonAnimation(BUTTON_CLASS_PHASE[1]);
  
            setTimeout(() => {
              setButtonAnimation("");
              setTimeout(startLoopAnimation, 5000);
            }, 1250);
          }, 5000);
        };
  
        setButtonAnimation(BUTTON_CLASS_PHASE[0]);
        startLoopAnimation();
  
        return () => {};
    }, []);
    const TEXT_CCCD = ["Bạn chưa xác thực thông tin!", "Thông tin xác thực của bạn bị từ chối!"];
  if(!([0, 1].includes(caseDeny))) return <></>
  return(
    <div className='container text-center mt-5'>
      <div className='alert alert-warning'>
        <h2>{TEXT_CCCD[caseDeny]}</h2>
        <span>Vui lòng vào đây để xác thực thông tin...</span>
        <Button
          text="Xác thực!"
          className={buttonAnimation}
          onClick={() => navigate("/info/xac-thuc-cccd")}
        />
      </div>
    </div>
  );
}

export default DeniedCccdList;