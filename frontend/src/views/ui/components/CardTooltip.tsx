import {JSX} from "react";
import { Link } from "react-router-dom";
import Blur from "./Blur";
import './CardTooltip.scss';

interface CardTooltipProps{
    className?: string;
    title?: string;
    des?: string;
    bgUrl?: string;
    url?: string;
}

/**
 * Component CardTooltip dùng để hiển thị thẻ hiệu ứng đặc biệt. Khi ấn sẽ chuyển sang trang khác
 * Chú ý kích thước mặc định là 100% : 100%
 * 
 * @param {CardTooltipProps} props - Các thuộc tính được truyền vào component.
 * @param {string} [props.className] - Lớp CSS bổ sung cho component (nếu có).
 * @param {string} [props.title='Tiêu đề'] - Tiêu đề hiển thị bên trong thẻ.
 * @param {string} [props.des='Ấn vào để xem thêm...'] - Nội dung mô tả ngắn gọn bên trong thẻ.
 * @param {string} [props.bgUrl=''] - URL của hình nền được sử dụng làm hình nền cho thẻ.
 * @param {string} [props.url=''] - Đường dẫn URL của thẻ
 * 
 * @returns {JSX.Element} Phần tử JSX đại diện cho thẻ CardTooltip đã được tạo.
 */
const CardTooltip = ({
    className = '', 
    title = 'Tiêu đề', 
    des = 'Ấn vào để xem thêm...', 
    bgUrl = "",
    url = ""
    }: CardTooltipProps): JSX.Element => {
    return(
        <Link to={url} 
        style={{ 
            textDecoration: "none",
            width: "100%",
            height: "100%"
        }}
        className={className}
        >
            <div
                className={`card-tooltip`}
                style={{ '--bg-url': `url("${bgUrl}")` } as React.CSSProperties}
            >
                <Blur className="card-tooltip__blur"/>
                <h3 className="title">{title}</h3>
                <p className="description">{des}</p>
            </div>
        </Link>
    );
}

export default CardTooltip;