import { JSX, ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

import logoNormal from "../../../assets/images/logo-01.png";
import logoSmall from "../../../assets/images/logo_small.png";

import Button from "../input/Button";
import "./Header.scss";
import { BasicUserTitle } from "../../../classes/BasicUserInfo";
import { showToast } from "../../../alert/alertToast";
import { useWindowWidth } from "../../../function/hook/useWindowWidth";

const SMALL_MENU_NAV = 900;

const Header = (): JSX.Element => {
  const navigate = useNavigate();
  const width = useWindowWidth(); // local hook, tránh ảnh hưởng toàn cục
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  const SmallMenu = ({ children }: { children: React.ReactNode }): ReactNode => {
    if (width < SMALL_MENU_NAV) {
      return (
        <li className="header__nav-item">
          <a>Menu</a>
          <ul className="submenu">
            {children}
          </ul>
        </li>
      );
    }
    return <>{children}</>;
  };

  return (
    <header className="header">
      <figure className="header__logo" title="Quay về trang chủ">
        <Link to="/" className="header__logo-link">
          <img
            src={switchUiLogo(width) ? logoSmall : logoNormal}
            alt="Logo"
            className="header__logo-img"
          />
        </Link>
      </figure>
      <nav className="header__nav">
        <ul className="header__nav-list">
          <SmallMenu>
            <li>
              <a>Nhà trường</a>
              <ul className={`submenu${width < SMALL_MENU_NAV ? "_r2" : ""}`}>
                <li><a href="/gioi-thieu">Giới thiệu</a></li>
                <li><a href="/tin-tuc">Tin tức</a></li>
              </ul>
            </li>
            <li>
              <a>Khám phá</a>
              <ul className={`submenu${width < SMALL_MENU_NAV ? "_r2" : ""}`}>
                <li><a href="/kham-pha/he/dai-hoc">Hệ đại học</a></li>
                <li><a href="/kham-pha/he/cao-dang">Hệ cao đẳng</a></li>
                <li><a href="/kham-pha/he/lien-thong">Hệ liên thông</a></li>
                <li><a href="#">Các ngành khác</a></li>
              </ul>
            </li>
            <li>
              <a>Thi tuyển</a>
              <ul className={`submenu${width < SMALL_MENU_NAV ? "_r2" : ""}`}>
                <li><a href="#">Thể lệ</a></li>
                <li><a href="#">Tra cứu thông tin</a></li>
                {(user.isStudent()) && <li><a href="/dang-ky-thi">Đăng ký thi</a></li>}
                {(user.isAdmin() || user.isTeacher()) && <li><a href="/cham-diem">Chấm điểm kỳ thi</a></li>}
              </ul>
            </li>
            {user.isAdmin() && (
              <li>
                <a>Quản lý</a>
                <ul className={`submenu${width < SMALL_MENU_NAV ? "_r2" : ""}`}>
                  <li><a href="/quan-ly/tai-khoan">DS Tài khoản</a></li>
                  <li><a href="/quan-ly/thi-sinh">DS Thí sinh</a></li>
                  <li><a href="/quan-ly/giao-vien">DS Giáo viên</a></li>
                  <li><a href="/quan-ly/ky-thi">Kỳ thi</a></li>
                </ul>
              </li>
            )}
            <li>
              <a>Dịch vụ</a>
              <ul className={`submenu${width < SMALL_MENU_NAV ? "_r2" : ""}`}>
                <li><a href="#">Điều khoảng dịch vụ</a></li>
                <li><a href="#">Hỏi đáp</a></li>
                <li><a href="#">Hỗ trợ</a></li>
                <li><a href="#">Về chúng tôi</a></li>
              </ul>
            </li>
          </SmallMenu>
        </ul>
        <div className="user-action">
          {user.isGuest() ? (
            <Button
              text={width < SMALL_MENU_NAV ? "" : "Đăng nhập"}
              icon="fa-solid fa-circle-user"
              className="user-action__login-btn"
              onClick={() => navigate('/dang-nhap')}
              title="Đăng nhập"
            />
          ) : (
            <div className="menu__user-container">
              <div className="user-notification-wrapper">
                <i className="fa-solid fa-bell small-icon" aria-disabled="true"></i>
                <div className="notification-notice"></div>
              </div>
              <div className={`user-menu-wrapper ${width < SMALL_MENU_NAV ? "small-nav" : "big-nav"}`}>
                {width < SMALL_MENU_NAV ? (
                  <i className="fa-solid fa-circle-user small-icon" aria-disabled="true"></i>
                ) : (
                  <UserNav user={user as BasicUserTitle} />
                )}
                <ul className="submenu">
                  {width < SMALL_MENU_NAV && <UserNav user={user as BasicUserTitle} />}
                  <li><a href="/info/thong-tin-ca-nhan">Xem hồ sơ</a></li>
                  {(user.isStudent()) && <>
                  <li><a href="/info/cap-nhat-cccd">Cập nhật CCCD</a></li>
                  <li><a href="/info/tra-cuu-ky-thi">Tra cứu kỳ thi</a></li>
                  </>}
                  <li><a href="/info/doi-mat-khau">Thay đổi mật khẩu</a></li>
                  <li><a onClick={handleLogout}>Đăng xuất</a></li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;

const switchUiLogo = (screenWidth: number): boolean =>
  screenWidth < 350 || (screenWidth < 1050 && screenWidth > 900);

const UserNav = ({ user }: { user: BasicUserTitle }): JSX.Element => (
  <div className="user-nav">
    <figure className="user-nav__avatar">
      <img src={user.getImage()} alt="Avatar" className="user-nav__avatar-img" />
    </figure>
    <section className="user-nav__info">
      <h3 className="user-nav__info-name">{user.name}</h3>
      <p className="user-nav__info-id">ID: {user.id}</p>
      <p className="user-nav__info-role">Vai trò: {user.getRoleName()}</p>
    </section>
  </div>
);
