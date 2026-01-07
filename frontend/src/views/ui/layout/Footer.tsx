import {JSX} from 'react';

import LogoGuest from '../components/LogoGuest';
import './Footer.scss';

const Footer = (): JSX.Element =>{
    return(
        <footer>
            <div className="footer-main">
                <div className="footer-container">
                    <div className="footer-logo">
                        <LogoGuest/>
                    </div>
                    <section className="footer-social">
                        <a href="https://facebook.com" target="_blank"><i className="fa-brands fa-square-facebook"></i><div></div></a>
                        <a href="https://x.com" target="_blank"><i className="fa-brands fa-square-x-twitter"></i><div></div></a>
                        <a href="https://youtube.com" target="_blank"><i className="fa-brands fa-youtube"></i><div></div></a>
                    </section>
                </div>
                <section className="footer-contact">
                    <h3>THÔNG TIN LIÊN HỆ:</h3>
                    <p>Email: dovadivatormedia@gmail.com</p>
                    <p>SĐT: +84 942 640 743</p>
                    <p>Địa chỉ: 123 Đường ABC, Quận XXX, Hà Nội</p>
                </section>
            </div>
            <div className="footer-bottom">
                &copy; 2025 Dova Divator. All rights reserved.
            </div>
        </footer>
    );
}

export default Footer;