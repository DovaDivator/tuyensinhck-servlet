import { useState, useEffect, JSX} from "react";
import { Link } from "react-router-dom";
import { useInView } from "react-intersection-observer";

import InputFieldSearch from "../../ui/input/InputFieldSearch";
import Pagination from "../../ui/components/Pagination";
import { jsxEleProps } from "../../../types/jsxElementInterfaces";

import nullImg from "../../../assets/images/null_img.jpg";
import "./OtherNewsSection.scss";

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
  

const OtherNewsSection = ({className = ""}: jsxEleProps):JSX.Element => {
    const [searchInput, setSearchInput] = useState("");

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
        <section className={`other-news-section ${className}`} ref={ref}>
            <div className={`other-news-section__title`}>
                <h2>Các tin khác</h2>
            </div>
            <InputFieldSearch
                name={'search-news'}
                id={'search-news'}
                formData={searchInput}
                setFormData={setSearchInput}
            />
            <div className={`other-news-section__container`}>
                <div className="other-news-section__list">
                  {test.map((item, index) => (
                    <Link to="/tin-tuc" key={index}>
                        <div className={`other-news-section__list__ele ${index === test.length - 1 ? 'last' : ''}`}>
                            <figure>
                                <img src={item.image === '' ? nullImg : item.image}/>
                            </figure>
                            <div className={`content`}>
                              <h4>{item.title}</h4>
                              <p>{item.date}</p>
                            </div>
                        </div>
                    </Link>    
                ))}
                </div>
                <Pagination currentNum={2} listLength={3}/>
            </div>
        </section>
    );
}

export default OtherNewsSection;