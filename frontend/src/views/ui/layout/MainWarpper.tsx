import {JSX, ReactNode} from "react";
import { jsxEleProps } from "../../../types/jsxElementInterfaces";
import "./MainWarpper.scss";

interface MainWarpperProps extends jsxEleProps{
  children: ReactNode;
}

/**
 * Phần <main> trong bố cục của trang web
 */
const MainWarpper = ({className = "" , children}: MainWarpperProps): JSX.Element => {
  return (
    <main className={`main-wrapper ${className}`}>
      {children}
    </main>
  );
} 

export default MainWarpper;