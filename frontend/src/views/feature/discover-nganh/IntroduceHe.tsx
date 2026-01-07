import { useState, useEffect, JSX } from "react";
import { Link } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import image from "../../../assets/images/dai-hoc-home.jpg";

import { jsxEleProps } from "../../../types/jsxElementInterfaces";
import "./IntroduceHe.scss";
import Blur from "../../ui/components/Blur";

interface IntroduceHeProps extends jsxEleProps {
    type?: string;
}

const imageMap = {
  "dai-hoc": () => import("../../../assets/images/dai-hoc-home.jpg"),
  "cao-dang": () => import("../../../assets/images/cao-dang-home.jpg"),
  "lien-thong": () => import("../../../assets/images/lien-thong-home.jpg"),
};

const IntroduceHe = ({className = "", type = ""}: IntroduceHeProps): JSX.Element => {
    const [__html, setHtml] = useState<string>("Đang tải...");
    const [name, setName] = useState<string>("");
    const [imageSrc, setImageSrc] = useState<string | null>(null);

    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.2,
    });

    const ANIMATION_CLASS_PHASE = ["hide", "start"];
    const [animationClass, setAnimationClass] = useState(ANIMATION_CLASS_PHASE[0]);

    useEffect(() => {
        if (inView) {
            setAnimationClass(ANIMATION_CLASS_PHASE[1]);
        }
    }, [inView]);

    useEffect(() => {
        /**
        * Điều phối trang và gắn giá trị hiển thị
        */
        const getPageInfo = async () => {
        switch (type) {
            case 'dai-hoc':
                setName("đại học");
                fetchTxtFile('/data/htmlHeDaiHoc.txt')
                importImage("dai-hoc-home.jpg");
                break;
            case 'cao-dang':
                setName("cao đẳng");
                setHtml("<p>Thông tin hệ cao đẳng...</p>");
                importImage("cao-dang-home.jpg");
                break;
            case 'lien-thong':
                setName("liên thông");
                setHtml("<p>Thông tin hệ liên thông...</p>");
                importImage("lien-thong-home.jpg");
                break;
            default:
                setName("Không xác định");
                console.error(`Lỗi type không hợp lệ ${type}`);
                break;
        }
        
        };

        const importImage = async (imageName: string) => {
            try {
                const module = await import(
                /* @vite-ignore */
                "../../../assets/images/" + imageName
                );
                setImageSrc(module.default);
            } catch (error) {
                console.error("Không tìm thấy ảnh:", imageName);
                setImageSrc("");
            }
        };

        const fetchTxtFile = async (link: string) => {
            let loadedHtml = "";
            const res = await fetch(link);
            loadedHtml = await res.text();
            setHtml(loadedHtml);
        }

        getPageInfo();
    }, [type]);

    return (
        <section className={`introduce-he-section ${className}`} ref={ref}>
            <div 
            className={`introduce-he-section__header`}
            style={{
                backgroundImage: imageSrc ? `url("${imageSrc}")` : "none",
            }}>
                <Blur/>
                <h2 className={`introduce-he-section__title ${animationClass}`}>
                    Giới thiệu hệ {name}
                </h2>
            </div>
            <div className="introduce-he-section__container"
                dangerouslySetInnerHTML={{__html}}
            >    
            </div>
        </section>
    );
};

export default IntroduceHe;