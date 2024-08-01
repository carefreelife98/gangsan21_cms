import {Board} from "../types/interface";

const boardMock: Board = {
    boardNumber: 1,
    title: '제목입니다.제목입니다.제목입니다.',
    content: '본문입니다.본문입니다.본문입니다.본문입니다.본문입니다.본문입니다.본문입니다.본문입니다.',
    boardImageList: ['https://carefreelife98.github.io/assets/images/about.jpg', 'https://newsimg.sedaily.com/2019/10/07/1VPFIGA6MW_1.jpg'],
    writeDateTime: new Date().toDateString(),
    writerEmail: 'carefreelife@qoo10.com',
    writerNickName: 'CarefreeLife98',
    writerProfileImage: 'https://www.shutterstock.com/image-vector/cute-cat-pixel-style-260nw-2138544923.jpg'
}

export default boardMock;