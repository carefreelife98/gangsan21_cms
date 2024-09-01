export default interface HolidayItem {
    // 달력에 표시되는 휴일 이름
    summary: string;
    start: {
        date: string;
    };
}