import { JSX } from "react";

const EmptyList = (): JSX.Element => {
  return(
    <div className='container text-center mt-5'>
      <div className='alert alert-warning'>
        <h2>Tiếc thật!</h2>
        <span>Hiện tại chưa có kỳ thi nào đang mở, vui lòng quay lại sau...</span>
      </div>
    </div>
  );
}

export default EmptyList;