export default interface CalenderEvent {
    id: string;
    title: string;
    content: string;
    isSucceed: boolean;
    imageWidth: number;
    imageHeight: number;
    start: string;
    end: string;
    url: string;
    editable: boolean;
}