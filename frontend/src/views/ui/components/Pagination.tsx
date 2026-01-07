import React, { JSX, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from "react-router-dom";

import Button from '../input/Button';
import { jsxEleProps } from '../../../types/jsxElementInterfaces';
import "./Pagination.scss";

interface PaginationProps {
    curNum?: number;
    listLength?: number;
}

type PaginationPageProps = PaginationProps & jsxEleProps;

const useScreenWidth = (): number => {
    const [width, setWidth] = useState<number>(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return width;
};

const Pagination = ({
    curNum = 1,
    listLength = 1,
    className = ""
}: PaginationPageProps): JSX.Element => {
    const screenWidth = useScreenWidth();
    const SMALL_SCREEN_WIDTH = 480;
    let outOfLength = false;

    let currentNum = 1;
    if (curNum > 0) {
        if (curNum > listLength) {
            outOfLength = true;
            currentNum = listLength;
        } else {
            currentNum = curNum;
        }
    }

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const handleClick = (page: number) => {
        searchParams.set("page", page.toString());
        navigate(`?${searchParams.toString()}`);
    };

    const goToPage = () => {
        const input = window.prompt(`Nhập số trang: `);
        if (!input) return;

        let parsed = parseInt(input.trim());
        if (isNaN(parsed)) {
            alert(`Vui lòng nhập số nguyên hợp lệ.`);
            return;
        }

        if (parsed < 1) parsed = 1;
        if (parsed > listLength) parsed = listLength;

        if (parsed !== currentNum) {
            handleClick(parsed);
        }
    };

    if (listLength < 1) {
        console.error(`Danh sách không hợp lệ: ${listLength}`);
        return (
            <div className={`pagination ${className}`}>
                <span className="error-message">Danh sách hiển thị lỗi</span>
            </div>
        );
    }

    if (currentNum < 1 || currentNum > listLength) {
        console.error(`Vị trí phần tử sai: ${currentNum} (Tổng số lượng: ${listLength})`);
        return (
            <div className={`pagination ${className}`}>
                <span className="error-message">Danh sách hiển thị lỗi</span>
            </div>
        );
    }

    const leftCurNum: number = screenWidth < SMALL_SCREEN_WIDTH ? currentNum : currentNum < 3 ? 1 : currentNum - 2;
    const rightCurNum: number = screenWidth < SMALL_SCREEN_WIDTH ? currentNum : (listLength - currentNum) > 2 ? currentNum + 2 : listLength;

    return (
        <div className={`pagination ${className}`}>
            {currentNum > 1 && <Button text="<<" onClick={() => handleClick(1)} />}
            <Button
                text="<"
                disabled={currentNum === 1}
                {...(currentNum > 1 ? { onClick: () => handleClick(currentNum - 1) } : {})}
            />

            {leftCurNum > 1 && (
                <span onClick={goToPage}>...</span>
            )}

            {Array.from({ length: rightCurNum - leftCurNum + 1 }, (_, i) => {
                const page = i + leftCurNum;
                return (
                    <Button
                        key={page}
                        className={currentNum === page && !outOfLength ? 'current-num' : ''}
                        text={page.toString()}
                        disabled={currentNum === page && !outOfLength}
                        {...(currentNum !== page || outOfLength ? { onClick: () => handleClick(page) } : {})}
                    />
                );
            })}

            {rightCurNum < listLength && <span>...</span>}

            <Button
                text=">"
                disabled={currentNum === listLength}
                {...(currentNum < listLength ? { onClick: () => handleClick(currentNum + 1) } : {})}
            />

            {currentNum < listLength && <Button text=">>" onClick={() => handleClick(listLength)} />}
        </div>
    );
};

export default React.memo(Pagination);
