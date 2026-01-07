export const compareTime = (
    dateFrom: Date,
    dateTo: Date,
    duration: number,
    isWithin: boolean = false
): boolean => {
    const delta = dateTo.getTime() - dateFrom.getTime();
    const isOverDuration = delta >= duration;

    if (isOverDuration) return !isWithin;
    if (delta >= 0) return isWithin;
    return false
}

export function durationToMilliseconds(dist: Partial<{
    year: number;
    month: number;
    day: number;
    hour: number;
    min: number;
}>): number {
    const msPerMin = 60 * 1000;
    const msPerHour = 60 * msPerMin;
    const msPerDay = 24 * msPerHour;
    const msPerMonth = 30 * msPerDay;    // Ước lượng: 30 ngày
    const msPerYear = 365 * msPerDay;    // Ước lượng: 365 ngày

    return (dist.year ?? 0) * msPerYear +
        (dist.month ?? 0) * msPerMonth +
        (dist.day ?? 0) * msPerDay +
        (dist.hour ?? 0) * msPerHour +
        (dist.min ?? 0) * msPerMin;
}