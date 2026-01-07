import { JSX } from "react";

const WaitingComfirm = (): JSX.Element => {
  return(
    <div className='container text-center mt-5'>
      <div className='alert alert-warning'>
        <h2>THÔNG BÁO!</h2>
        <span>Thông tin của bạn vẫn đang đợi phê duyệt, vui lòng quay lại sau...</span>
      </div>
    </div>
  );
}

export default WaitingComfirm;