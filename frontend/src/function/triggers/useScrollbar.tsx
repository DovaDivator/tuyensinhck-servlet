import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook để kiểm tra có thanh cuộn ngang hay không để tùy chỉnh flex của display phù hợp
 * @returns [hasScrollbar, listRef] - Trả về trạng thái có scrollbar dưới dạng useState (boolean)
 */
const useScrollbar = (): [string, React.RefObject<HTMLDivElement |null>] => {
    const CLASS_FLEX_DIRECTION = "has-scrollbar";
    const [hasScrollbar, setHasScrollbar] = useState<string>("");
    const listRef = useRef<HTMLDivElement>(null);

    const checkScrollbar = (): void => {
        if (listRef.current) {
            const hasScroll = listRef.current.scrollWidth > listRef.current.clientWidth;
            setHasScrollbar(hasScroll ? CLASS_FLEX_DIRECTION : "");
        }
    };

    useEffect(() => {
        checkScrollbar();
        window.addEventListener("resize", checkScrollbar);
        return () => window.removeEventListener("resize", checkScrollbar);
    }, []);

    return [hasScrollbar, listRef];
};

export default useScrollbar;
