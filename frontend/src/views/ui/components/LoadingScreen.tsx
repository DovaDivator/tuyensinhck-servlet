import {JSX} from 'react';
import './LoadingScreen.scss';
import loadingSpinner from '../../../assets/animation/LoadingSpinner.gif';

const LoadingScreen = (): JSX.Element => {
    return(
        <div className="loading-screen">
            <img src={loadingSpinner} alt="Loading..." className="loading-spinner" />
        </div>
    );
}

export default LoadingScreen;