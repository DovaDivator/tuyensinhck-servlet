export const fetchVietnamTime = async (): Promise<Date> => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000); // 3 giây timeout

    try {
        const res = await fetch('https://timeapi.io/api/Time/current/zone?timeZone=Asia/Ho_Chi_Minh', {
            signal: controller.signal,
        });

        clearTimeout(timeout);

        const data = await res.json();
        return new Date(data.dateTime);
    } catch (error: any) {
        clearTimeout(timeout);

        if (error.name === 'AbortError') {
            console.error("⏰ Timeout: Không lấy được giờ sau 3 giây.");
        } else {
            console.error("❌ Lỗi khi lấy giờ Việt Nam:", error);
        }

        return new Date(); // fallback: trả về giờ hệ thống
    }
};
