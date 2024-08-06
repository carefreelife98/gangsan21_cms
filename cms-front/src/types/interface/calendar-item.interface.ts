import CalenderEvent from "./calender-event.interface";

export default interface CalendarItem {
    events: CalenderEvent[];
    color: string;
    textColor: string;
}