import React, { useState, useEffect, JSX } from "react";
import { useNavigate } from "react-router-dom";
import { useInView } from "react-intersection-observer";

import Button from "../../ui/input/Button";
import "./HeroSection.scss";

const HeroSection = (): JSX.Element => {
  const navigate = useNavigate();

  const BUTTON_CLASS_PHASE = ["hide", "start", "loop"];
  const [buttonAnimation, setButtonAnimation] = useState(BUTTON_CLASS_PHASE[0]);

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

    return (
        <section className="hero-section" ref={ref}>
            <div className="blur"></div>
            <div>
                <h2 className="hero-section__title">Chào mừng đến với Trang tuyển sinh</h2>
                <p className="hero-section__description">Khám phá cơ hội học tập tại ngôi trường hàng đầu của chúng tôi</p>
                <Button
                    text="Đăng ký ngay!"
                    className={buttonAnimation}
                    onClick={() => navigate("/dang-ky")}
                />
            </div>
        </section>
    );
}

export default HeroSection;