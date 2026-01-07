import React, { useState, useEffect, JSX } from "react";
import { Link } from "react-router-dom";
import { useInView } from "react-intersection-observer";

import introImg from "../../../assets/images/SquareSchool.jpg";
import IntroduceText from "./IntroduceText";
import { jsxEleProps } from "../../../types/jsxElementInterfaces";
import "./IntroduceSection.scss";

const IntroduceSection = ({className = ""}: jsxEleProps): JSX.Element => {
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const ANIMATION_CLASS_PHASE = ["hide", "start"];
    const [animationClass, setAnimationClass] = useState(ANIMATION_CLASS_PHASE[0]);

    useEffect(() => {
        if (inView) {
            setAnimationClass(ANIMATION_CLASS_PHASE[1]);
        }
    }, [inView]);

    return (
        <section className={`introduce-section ${className}`} ref={ref}>
            <div className="introduce-section__control">
                <figure className={`introduce-section__image ${animationClass}`}>
                    <img src={introImg} alt="ảnh giới thiệu"/>
                </figure>
                <div className={`introduce-section__limited ${animationClass}`}>
                    <div className={`introduce-section__limited__text`}>
                        <IntroduceText />
                    </div>
                    {className === "home" && (
                        <Link to="/gioi-thieu" className="introduce-section__limited__link">
                            <span>&gt;&gt;&nbsp;Xem thêm...</span>
                        </Link>
                    )}
                </div>
            </div>
        </section>
    );
};

export default IntroduceSection;