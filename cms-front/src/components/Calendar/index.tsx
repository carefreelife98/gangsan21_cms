import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import CalendarItem from '../../types/interface/calendar-item.interface';

interface Props {
    calenderItemList: CalendarItem[];
}

export default function Calendar({calenderItemList}: Props) {

    // event handler: 일정 내 이벤트 클릭 시 이벤트 내 속성으로 가지고 있는 게시물 url 로 이동.
    const handleEventClick = (info: any) => {
        info.jsEvent.preventDefault(); // don't let the browser navigate

        if (info.event.url) {
            window.open(info.event.url);
        }
    }

    return (
        <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin, listPlugin]}
            initialView='dayGridMonth'
            dayMaxEventRows={true}
            eventSources={calenderItemList}
            eventClick={handleEventClick}
            locale='ko'
        />
    );
}