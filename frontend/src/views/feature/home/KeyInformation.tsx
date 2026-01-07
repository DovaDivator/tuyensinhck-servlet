import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import Card from "../../ui/components/Card";

import keyInformationData from '../../../data/keyInformationData.json';

import "./KeyInformation.scss";


const KeyInformation = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  useEffect(() => {
    if (inView) {
      const startAnimation = () => {
        const items = document.querySelectorAll(".key-information__list__item");
        items.forEach((item, index) => {
          setTimeout(() => {
            item.classList.remove("hide");
            item.classList.add("start");
          }, index*500);
        });
      };

      startAnimation();
    }
  }, [inView]);

  return (
    <div className="key-information" ref={ref}>
      <div className="key-information__list">
        {keyInformationData.map((item, index) => (
          <Card key={index} className="key-information__list__item hide">
            <h4 className="key-information__list__item-title">{item.title}</h4>
            <p className="key-information__list__item-description">{item.description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default KeyInformation;