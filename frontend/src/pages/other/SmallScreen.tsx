import React, {JSX} from "react";
import chibiImg from "../../assets/images/SmallScreen_img.png"; // Ensure this file exists at the specified path
import "./SmallScreen.scss";

const SmallScreen = (): JSX.Element => {
    return (
          <div className="bg-small">
            <img src={chibiImg} alt="small-screen" className="img-small-screen" />
            <h6>Thiết bị quá nhỏ để hiển thị ứng dụng. Vui lòng sử dụng thiết bị có kích thước lớn hơn.</h6>
          </div>
      );
};

export default SmallScreen;