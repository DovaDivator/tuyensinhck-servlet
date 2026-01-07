import {JSX} from 'react';

import { jsxEleProps } from '../../../types/jsxElementInterfaces';
import './IntroduceMedia.scss';

const VIDEO_URL = "https://www.youtube.com/embed/K085QD2p2f8?si=OYVNwKdKrUrLeg10";

const IntroduceMedia = ({className = ""}:jsxEleProps): JSX.Element =>{
    return (
        <section className={`introduce-media ${className}`}>
            <h2>Video giới thiệu</h2>
            <div className='introduce-media__container'>
                <iframe src={VIDEO_URL} title="YouTube video player" allow="clipboard-write; encrypted-media; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin"></iframe>
            </div>
        </section>
    );
}

export default IntroduceMedia;
