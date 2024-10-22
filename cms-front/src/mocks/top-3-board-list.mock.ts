import {BoardListItem} from 'types/interface';
import dayjs from "dayjs";

const top3BoardListMock: BoardListItem[] = [
    {
        "boardNumber": 1,
        "title": "Test Title",
        "content" : "Test Content by Carefreelife98",
        "isSucceed": true,
        "startDt": dayjs().format('YYYY. MM. DD. HH:mm'),
        "endDt": dayjs().format('YYYY. MM. DD. HH:mm'),
        "imageWidth": 300,
        "imageHeight": 500,
        "boardTitleImage": "https://picsum.photos/152/152",
        "favoriteCount": 0,
        "commentCount": 0,
        "viewCount": 0,
        "writeDateTime": new Date().toUTCString(),
        "writerNickName": "CarefreeLife",
        "writerProfileImage": "https://picsum.photos/32/32",
    },
    // {
    //     "boardNumber": 1,
    //     "title": "Test Title",
    //     "content" : "Test Content by Carefreelife98",
    //     "startDt": dayjs().format('YYYY. MM. DD. HH:mm'),
    //     "endDt": dayjs().format('YYYY. MM. DD. HH:mm'),
    //     "boardTitleImage": null,
    //     "favoriteCount": 0,
    //     "commentCount": 0,
    //     "viewCount": 0,
    //     "writeDateTime": new Date().toUTCString(),
    //     "writerNickName": "CarefreeLife",
    //     "writerProfileImage": null,
    // },
    // {
    //     "boardNumber": 1,
    //     "title": "Test Title",
    //     "content" : "Test Content by Carefreelife98",
    //     "startDt": dayjs().format('YYYY. MM. DD. HH:mm'),
    //     "endDt": dayjs().format('YYYY. MM. DD. HH:mm'),
    //     "boardTitleImage": null,
    //     "favoriteCount": 0,
    //     "commentCount": 0,
    //     "viewCount": 0,
    //     "writeDateTime": new Date().toUTCString(),
    //     "writerNickName": "CarefreeLife",
    //     "writerProfileImage": null,
    // },
]

export default top3BoardListMock;