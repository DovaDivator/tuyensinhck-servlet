import { useState, useEffect, JSX} from "react";
import { Link } from "react-router-dom";
import { useInView } from "react-intersection-observer";

import CardTooltip from '../../ui/components/CardTooltip';
import { jsxEleProps } from "../../../types/jsxElementInterfaces";

import "./UniLevelSection.scss";


const NewsSection = ({className = ""}: jsxEleProps):JSX.Element => {
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.3,
    });
    const [animationClass, setAnimationClass] = useState("hide");

    useEffect(() => {
        if (inView) {
            setAnimationClass("start");
        }
    }, [inView]);

    return (
        <section className={`uni-level-section ${className}`} ref={ref}>
            <div className={`uni-level-section__title`}>
                <h2>Cấp bậc tuyển sinh</h2>
            </div>
            <div className={`uni-level-section__lv1`}>
                <CardTooltip
                    bgUrl="../../../../src/assets/images/dai-hoc-home.jpg"
                    title="Đại học"
                    des="Khám phá hành trình học Đại học với cơ hội nghề nghiệp rộng mở!"
                    className={animationClass}
                    url="/kham-pha/he/dai-hoc"
                />
                <div className={`uni-level-section__lv2`}>
                    <CardTooltip
                        bgUrl="../../../../src/assets/images/cao-dang-home.jpg"
                        title="Cao đẳng"
                        des="Học nhanh – Làm sớm với chương trình Cao đẳng thực tiễn!"
                        className={animationClass}
                        url="/kham-pha/he/cao-dang"
                    />
                    <CardTooltip
                        bgUrl="../../../../src/assets/images/lien-thong-home.jpg"
                        title="Liên thông"
                        des="Nâng tầm bằng cấp cùng chương trình Liên thông linh hoạt!"
                        className={animationClass}
                        url="/kham-pha/he/lien-thong"
                    />
                </div>
            </div>
        </section>
    );
}

export default NewsSection;