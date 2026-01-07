import {ReactNode, JSX} from "react";

import './Card.scss';

interface CardProps{
    children: ReactNode;
    className?: string;
    hover?: boolean;
}

/**
 * Component Card dùng để bọc nội dung với style tùy chỉnh vào trong 1 thẻ card
 * 
 * @param {Object} props - Các thuộc tính của component Card.
 * @param {React.ReactNode} props.children - Nội dung được render bên trong Card.
 * @param {string} [props.className] - Lớp CSS bổ sung cho Card (nếu có).
 * @param {boolean} [props.hover=false] - Nếu true, thêm class `hover` để áp dụng hiệu ứng hover.
 * 
 * @returns {JSX.Element} Thẻ div bao quanh nội dung với class `card` và các lớp CSS tùy chọn.
 */
const Card = ({children, className = '', hover = false}: CardProps): JSX.Element => {
    return(
        <div className={`card ${className} ${hover ? 'hover' : ''}`}>
            {children}
        </div>
    );
}

export default Card;