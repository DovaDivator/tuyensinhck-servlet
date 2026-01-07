import { useState, useEffect, JSX} from "react";
import useScrollbar from "../../../function/triggers/useScrollbar";
import { Link } from "react-router-dom";
import { useInView } from "react-intersection-observer";

import Card from '../../ui/components/Card';
import { jsxEleProps } from "../../../types/jsxElementInterfaces";

import nullImg from "../../../assets/images/null_img.jpg";
import moreImg from "../../../assets/images/Searching_img.png";
import "./NewsSection.scss";

const test = [
    {
      "image": "",
      "title": "Giới thiệu sản phẩm",
      "date": "23/04/2025",
    },
    {
      "image": "",
      "title": "Hướng dẫn sử dụng",
      "date": "22/04/2025",
    },
    {
      "image": "",
      "title": "Chính sách bảo hành",
      "date": "20/04/2025",
    },
    {
      "image": "",
      "title": "Hỗ trợ kỹ thuật",
      "date": "19/04/2025",
    }
  ];
  

const NewsSection = ({className = ""}: jsxEleProps):JSX.Element => {
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.3,
    });
    const [animationClass, setAnimationClass] = useState("hide");
    const [hasScrollbar, listRef] = useScrollbar();

    useEffect(() => {
        if (inView) {
            setAnimationClass("start");
        }
    }, [inView]);

    return (
        <section className="news-section" ref={ref}>
            <div className={`news-section__title`}>
                <h2>Tin tức</h2>
                <p>Tin nổi bật từ Nhà trường</p>
            </div>
            <div ref={listRef}
            className={`news-section__list ${animationClass} ${hasScrollbar ? "has-scrollbar" : ""}`}>
                {test.map((item, index) => (
                    <Link to="/tin-tuc" key={index}>
                        <Card className={`news-section__list__ele`} hover={true}>
                            <figure>
                                <img src={item.image === '' ? nullImg : item.image}/>
                            </figure>
                            <h4>{item.title}</h4>
                            <p>{item.date}</p>
                        </Card>
                    </Link>    
                ))}
                {className !== "news" &&
                    (<Link to="/tin-tuc">
                    <Card className={`news-section__list__ele more`} hover={true}>
                        <figure>
                            <img src={moreImg}/>
                        </figure>
                        <h5>Xem thêm...</h5>
                    </Card>
                </Link>)
                }
            </div>
        </section>
    );
}

export default NewsSection;