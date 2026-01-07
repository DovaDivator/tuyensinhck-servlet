import {JSX} from 'react';
import { jsxEleProps } from '../../../types/jsxElementInterfaces';
import "./Blur.scss";

const Blur = ({className = ""}: jsxEleProps): JSX.Element => {
    return (
        <div className={`blur ${className}`}></div>
    )
}

export default Blur;