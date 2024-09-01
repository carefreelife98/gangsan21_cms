export default interface CalenderEvent {
    id: string;
    title: string;
    content: string;
    isSucceed: boolean;
    start: string;
    end: string;
    url: string;
    editable: boolean;
}