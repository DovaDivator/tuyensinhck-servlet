import React from "react";
import { alertSimpleInput } from "../../alert/alerlSimpleInput";
import { InputValids } from "../../classes/InputValids";

export const forgotPassword = async (e: React.MouseEvent<HTMLAnchorElement>): Promise<void> => {
  e.preventDefault();
  const inputValids = new InputValids({ required: true, matchType: ['email'] })
  const getResult = await alertSimpleInput({title:'Nhập email để khôi phục mật khẩu', placeholder:"Nhập email của bạn...",  valid:inputValids });
  console.log(getResult);
};
