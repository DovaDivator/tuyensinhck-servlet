import {JSX, useState, useEffect, useContext, useRef} from "react";
import { useInView } from "react-intersection-observer";
import Card from "../../ui/components/Card";

import outstandingStuData from '../../../data/OutstandingStuData.json';

import './OutstadingStuSection.scss';
import { AppContext } from "../../../context/AppContext";

const OutstadingStuSection = (): JSX.Element =>{
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  const ANIMATION_CLASS_PHASE = ["hide", "start", "end"];
  const [animationClass, setAnimationClass] = useState(ANIMATION_CLASS_PHASE[0]);

  const WIDTH_DIVINE = 992;
  const {screenSize} = useContext(AppContext);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!inView) return;

    const items = document.querySelectorAll(".student-card");
    if (!items.length) {
      console.warn("No .student-card elements found");
      return;
    }

    // Clear any existing interval to prevent duplicates
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Large screens: Apply start animation to all cards with stagger
    if (screenSize.width > WIDTH_DIVINE) {
      items.forEach((item, index) => {
        setTimeout(() => {
          if (item) {
            item.classList.remove(ANIMATION_CLASS_PHASE[0], ANIMATION_CLASS_PHASE[2]);
            item.classList.add(ANIMATION_CLASS_PHASE[1]);
          }
        }, index * 100);
      });
    } else {
      // Small screens: Carousel with one card visible at a time
      let count = 0;
      const totalItems = items.length;

      const animateCarousel = () => {
        const index = count % totalItems;
        const preIndex = (count - 1 + totalItems) % totalItems; // Handle negative modulo

        const currentItem = items[index];
        const prevItem = items[preIndex];

        if (currentItem) {
          currentItem.classList.remove(ANIMATION_CLASS_PHASE[0], ANIMATION_CLASS_PHASE[2]);
          currentItem.classList.add(ANIMATION_CLASS_PHASE[1]);
        }

        if (prevItem) {
          prevItem.classList.remove(ANIMATION_CLASS_PHASE[0], ANIMATION_CLASS_PHASE[1]);
          prevItem.classList.add(ANIMATION_CLASS_PHASE[2]);
        }

        count++;
      };

      animateCarousel();
      intervalRef.current = setInterval(animateCarousel, 5000);
    }

    // Cleanup: Clear interval and reset classes when unmounting or inView changes
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      items.forEach((item) => {
        item.classList.remove(...ANIMATION_CLASS_PHASE);
      });
    };
  }, [inView, screenSize.width]);

    return (
        <section className="student-section">
        <h2>Học Sinh Tiêu Biểu</h2>
        <div ref={ref} className={`student-container`}>
        {outstandingStuData.map((student, index) => (
          <Card key={index} className={`student-card ${ANIMATION_CLASS_PHASE[0]}`}>
            <img src={student.avatar} />
            <h3>{student.name}</h3>
            <p>{student.class}</p>
            <p>{student.des}</p>
          </Card>
        ))}
        </div>
      </section>
    );
}

export default OutstadingStuSection;