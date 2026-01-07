import {JSX} from 'react';

import { jsxEleProps } from '../../../types/jsxElementInterfaces';
import './IntroduceImage.scss';

interface ImageItemProps {
  url: string;
  caption: string;
}

const imgTermData: ImageItemProps[] = [
  {
    "url": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80",
    "caption": "Khung cảnh sa mạc ở Yazd, Iran"
  },
  {
    "url": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80",
    "caption": "Toàn cảnh đảo Svolvær, Na Uy"
  },
  {
    "url": "https://images.pexels.com/photos/417173/pexels-photo-417173.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    "caption": "Cảnh thành phố về đêm với ánh đèn rực rỡ"
  },
  {
    "url": "https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    "caption": "Phong cảnh núi non với hồ nước phẳng lặng"
  },
  {
    "url": "https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    "caption": "Rừng cây xanh mát giữa thiên nhiên hoang sơ"
  },
  {
    "url": "https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    "caption": "Bãi biển yên bình với cát trắng và sóng nhẹ"
  }
]


const IntroduceImage = ({className = ""}:jsxEleProps): JSX.Element =>{
    return (
        <section className={`introduce-image ${className}`}>
            <h2>Khoảnh khắc nổi bật</h2>
            <div className='introduce-image__container'>
                {imgTermData.map((item, index) => (
                    <div key={index} className={`introduce-image__item`}>
                        <img src={item.url}/>
                        <span>{item.caption}</span>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default IntroduceImage;
