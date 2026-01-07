import { JSX } from "react";

const ExistExam = (): JSX.Element => {
  return(
    <div className='container text-center mt-5'>
      <div className='alert alert-warning'>
        <h2>CẢM ƠN BẠN ĐÃ ĐĂNG KÝ KỲ THI!</h2>
        <span>Xem thông tin đăng ký của bạn <a href="/info/tra-cuu-ky-thi">tại đây</a></span>
      </div>
    </div>
  );
}

export default ExistExam;