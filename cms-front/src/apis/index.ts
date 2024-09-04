import {SignInRequestDto, SignUpRequestDto} from "./request/auth";
import axios from "axios";
import SignInResponseDto from "./response/auth/sign-in.response.dto";
import {ResponseDto} from "./response";
import {SignUpResponseDto} from "./response/auth";
import {
    GetSignInUserResponseDto,
    GetUserResponseDto,
    PatchNicknameResponseDto,
    PatchProfileImageResponseDto
} from "./response/user";
import {PatchBoardRequestDto, PostBoardRequestDto, PostCommentRequestDto} from "./request/board";
import {
    PostBoardResponseDto,
    GetBoardResponseDto,
    IncreaseViewCountResponseDto,
    GetFavoriteListResponseDto,
    GetCommentListResponseDto,
    PutFavoriteResponseDto,
    PostCommentResponseDto,
    DeleteBoardResponseDto,
    PatchBoardResponseDto,
    GetLatestBoardListResponseDto,
    GetTop3BoardListResponseDto,
    GetSearchBoardListResponseDto, GetUserBoardListResponseDto, PatchBoardSuccessToggleResponseDto
} from "./response/board";
import {GetPopularListResponseDto, GetRelationListResponseDto} from "./response/search";
import {GetCalendarItemListResponseDto} from "./response/calendar";
import {PatchNicknameRequestDto, PatchProfileImageRequestDto} from "./request/user";
import {GetSettingResponseDto} from "./response/setting";
import {PatchSettingRequestDto} from "./request/setting";
import PatchSettingResponseDto from "./response/setting/patch-setting.response.dto";
import GetHolidayItemListResponseDto from "./response/calendar/get-holiday-item-list.response.dto";
import CalendarItem from "../types/interface/calendar-item.interface";
import CalenderEvent from "../types/interface/calender-event.interface";
import {GetBoardImageUrlsResponseDto} from "./response/util";

// const DOMAIN = 'http://localhost:4000';
const DOMAIN = "http://43.201.51.14:4000";

const API_DOMAIN = `${DOMAIN}/api/v1`;

const HOLIDAY_START_DATE = '2020-01-01T00:00:00Z';
const HOLIDAY_END_DATE = '2028-01-01T00:00:00Z';

const authorization = (accessToken: string) => {
    return { headers: {Authorization: `Bearer ${accessToken}`} };
};

const SIGN_IN_URL = () => `${API_DOMAIN}/auth/sign-in;`
const SIGN_UP_URL = () => `${API_DOMAIN}/auth/sign-up`;

// 동기 함수로 처리 (작업 완료 시까지 대기하도록)
export const signInRequest = async (requestBody: SignInRequestDto) => {

    // await 을 걸지 않으면 API 호출 및 반환이 되기 전에 다음 동작으로 넘어가게 됨.
    return await axios.post(SIGN_IN_URL(), requestBody)
        .then(response => {
            const responseBody: SignInResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response.data) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });
};

// 동기 함수로 처리 (작업 완료 시까지 대기하도록)
export const signUpRequest = async (requestBody: SignUpRequestDto) => {
    const result = await axios.post(SIGN_UP_URL(), requestBody)
        .then(response => {
            const responseBody: SignUpResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response.data) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody
        });
    return result;
};

const GET_CALENDAR_ITEM_LIST_URL = () => `${API_DOMAIN}/calendar`;
const GET_GOOGLE_CALENDAR_HOLIDAY_URL = (startDt?: string | number | null, endDt?: string | number | null) =>
    `https://www.googleapis.com/calendar/v3/calendars/ko.south_korea.official%23holiday%40group.v.calendar.google.com/events?key=${process.env.REACT_APP_GOOGLE_API_KEY}&orderBy=startTime&singleEvents=true&timeMin=${startDt}&timeMax=${endDt}`;
const SETTING_URL = () => `${API_DOMAIN}/setting`

const GET_BOARD_URL = (boardNumber: number | string) => `${API_DOMAIN}/board/${boardNumber}`;
const POST_BOARD_URL = () => `${API_DOMAIN}/board`;
const PATCH_BOARD_URL = (boardNumber: number | string) => `${API_DOMAIN}/board/${boardNumber}`;
const DELETE_BOARD_UTL = (boardNumber: number | string) => `${API_DOMAIN}/board/${boardNumber}`;
const GET_LATEST_BOARD_LIST_URL = () => `${API_DOMAIN}/board/latest-list`;
const GET_TOP_3_BOARD_LIST_URL = () => `${API_DOMAIN}/board/top-3`;
const GET_SEARCH_BOARD_LIST_URL = (searchWord: string, preSearchWord: string | null) => `${API_DOMAIN}/board/search-list/${searchWord}${preSearchWord ? '/' + preSearchWord : ''}`;
const GET_USER_BOARD_LIST_URL = (email: string) => `${API_DOMAIN}/board/user-board-list/${email}`;

const GET_FAVORITE_LIST_URL = (boardNumber: number | string) => `${API_DOMAIN}/board/${boardNumber}/favorite-list`;
const PUT_FAVORITE_URL = (boardNumber: number | string) => `${API_DOMAIN}/board/${boardNumber}/favorite`

const GET_COMMENT_LIST_URL = (boardNumber: number | string) => `${API_DOMAIN}/board/${boardNumber}/comment-list`;
const POST_COMMENT_URL = (boardNumber: number | string) => `${API_DOMAIN}/board/${boardNumber}/comment`;

const INCREASE_VIEW_COUNT_URL = (boardNumber: number | string) => `${API_DOMAIN}/board/${boardNumber}/increase-view-count`;
const PATCH_BOARD_SUCCESS_TOGGLE_URL = (boardNumber: number | string) => `${API_DOMAIN}/board/${boardNumber}/success`;

// 1. 공휴일 데이터가 localStorage 에 캐싱되어 있는지 확인하고 없으면 google calendar api 호출 및 캐시 저장.
// 2. Google Calendar API: 대한민국 공휴일 데이터 추출
// 3. 기존 업무 리스트 API: 전체 업무 리스트 추출
// 4. 공휴일 데이터를 캘린더 아이템 객체로 변환 후 기존 업무 리스트 뒤에 append.
// 5. 리스트 데이터 반환.
export const getCalendarItemListRequest = async (accessToken: string) => {

    // 캐시된 데이터를 localStorage 에서 확인하는 함수
    function getCachedHolidayData(): GetHolidayItemListResponseDto | null {
        const cachedData = localStorage.getItem('__holidayData');
        if (cachedData) {
            return JSON.parse(cachedData) as GetHolidayItemListResponseDto;
        }
        return null;
    }

    // 데이터를 localStorage 에 저장하는 함수
    function cacheHolidayData(data: GetHolidayItemListResponseDto) {
        localStorage.setItem('__holidayData', JSON.stringify(data));
    }

    // google calendar api 를 통한 대한민국 공휴일 리스트 가져옴
    const getHolidayData = async () => {
        // localStorage 에서 데이터 확인
        let holidayResult = getCachedHolidayData();

        // 만약 localStorage 에 데이터가 없다면, Axios 호출
        if (!holidayResult) {
            holidayResult = await axios.get(GET_GOOGLE_CALENDAR_HOLIDAY_URL(HOLIDAY_START_DATE, HOLIDAY_END_DATE))
                .then((response) => {
                    const responseBody: GetHolidayItemListResponseDto = response.data;
                    // 데이터 가져온 후, localStorage 에 캐시
                    cacheHolidayData(responseBody);
                    return responseBody;
                })
                .catch(error => {
                    // 에러 처리 (여기서는 null을 반환)
                    return null;
                });
        }

        return holidayResult;
    };

    // 캘린더 업무 리스트 가져옴.
    const boardResult = await axios.get(GET_CALENDAR_ITEM_LIST_URL(), authorization(accessToken))
        .then(response => {
            const responseBody: GetCalendarItemListResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });

    // 구글 공휴일 캘린더 API 의 응답 (GetHolidayItemListResponseDto) 을 캘린더 객체 (CalendarItem) 로 변환. (이후 업무 캘린더 객체 리스트에 append 함)
    function transformHolidayToCalendarItem(holidayList: GetHolidayItemListResponseDto | null): CalendarItem | null {
        if (!holidayList) return null;
        const transformedList: CalenderEvent[] = holidayList?.items.map((holiday, index) => {
            const calendarItem: CalenderEvent = {
                // 기존 업무 리스트 + 공휴일 리스트 순으로 최종 데이터 가공되므로 그에 따른 id 를 인덱싱.
                // 미니 view 사용 시 각 event 의 id 를 기준으로 나타내므로 적절한 id 가공이 필요. (지렸다)
                id: (boardResult && 'calendarItemList' in boardResult) ? (index + 1 + boardResult.calendarItemList.length).toString() : index.toString(),
                title: holiday.summary,
                content: holiday.summary,
                isSucceed: false,
                imageWidth: 0,
                imageHeight: 0,
                start: holiday.start.date,
                end: holiday.start.date,
                url: '',
                editable: false
            }
            return calendarItem;
        });

        const result: CalendarItem = {
            events: transformedList,
            color: '#FF6B6B',
            textColor: 'white'
        }

        return result;
    }

    const holidayData = await getHolidayData();
    const holidayCalendarItem = transformHolidayToCalendarItem(holidayData);
    // boardResult 가 GetCalendarItemListResponseDto 타입인지 확인, ResponseDto 타입인 경우 BE Error 에러가 발생한 것이니 그대로 반환.
    if (boardResult && 'calendarItemList' in boardResult) {
        // google api 에러 없이 공휴일 정보를 가져왔을때 기존 캘린더 업무 리스트에 추가.
        if (holidayCalendarItem) {
            boardResult.calendarItemList.push(holidayCalendarItem);
        }
    }
    return boardResult;
};

export const getSettingRequest = async (accessToken: string) => {
    const result = await axios.get(SETTING_URL(), authorization(accessToken))
        .then(response => {
            const responseBody: GetSettingResponseDto = response.data;
            return responseBody;
        }).catch(error => {
            if(!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });
    return result;
};

export const patchSettingRequest = async (requestBody: PatchSettingRequestDto, accessToken: string) => {
    const result = await axios.patch(SETTING_URL(), requestBody, authorization(accessToken))
        .then(response => {
            const responseBody: PatchSettingResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if(!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });
    return result
};

export const getBoardRequest = async (boardNumber: number | string, accessToken: string) => {
    const result = await axios.get(GET_BOARD_URL(boardNumber), authorization(accessToken))
        .then(response => {
            const responseBody: GetBoardResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if(!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });
    return result;
};

export const postBoardRequest = async (requestBody: PostBoardRequestDto, accessToken: string) => {
    const result = await axios.post(POST_BOARD_URL(), requestBody, authorization(accessToken))
        .then(response => {
            const responseBody: PostBoardResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if(!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });
    return result;
};

export const patchBoardRequest = async (boardNumber: number | string, requestBody: PatchBoardRequestDto, accessToken: string) => {
    const result = await axios.patch(PATCH_BOARD_URL(boardNumber), requestBody, authorization(accessToken))
        .then(response => {
            const responseBody: PatchBoardResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });
    return result;
};

export const deleteBoardRequest = async (boardNumber: number | string, accessToken: string) => {
    const result = await axios.delete(DELETE_BOARD_UTL(boardNumber), authorization(accessToken))
        .then(response => {
            const responseBody: DeleteBoardResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });
    return result;
};

export const getLatestBoardListRequest = async () => {
    const result = await axios.get(GET_LATEST_BOARD_LIST_URL())
        .then(response => {
            const responseBody: GetLatestBoardListResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });
    return result;
};

export const getTop3BoardListRequest = async (accessToken: string) => {
    const result = await axios.get(GET_TOP_3_BOARD_LIST_URL(), authorization(accessToken))
        .then(response => {
            const responseBody: GetTop3BoardListResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });
    return result;
};

export const getSearchBoardListRequest = async (accessToken: string, searchWord:string, preSearchWord: string | null) => {
    const result = await axios.get(GET_SEARCH_BOARD_LIST_URL(searchWord, preSearchWord), authorization(accessToken))
        .then(response => {
            const responseBody: GetSearchBoardListResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });
    return result;
};

export const getUserBoardListRequest = async (accessToken: string, email: string) => {
    const result = await axios.get(GET_USER_BOARD_LIST_URL(email), authorization(accessToken))
        .then(response => {
            const responseBody: GetUserBoardListResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });
    return result;
};

export const getFavoriteListRequest = async (boardNumber: number | string) => {
    const result = await axios.get(GET_FAVORITE_LIST_URL(boardNumber))
        .then(response => {
            const responseBody: GetFavoriteListResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });
    return result;
};

export const putFavoriteRequest = async (boardNumber: number | string, accessToken: string) => {
    const result = axios.put(PUT_FAVORITE_URL(boardNumber), {}, authorization(accessToken))
        .then(response => {
            const responseBody: PutFavoriteResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if(!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });
    return result;
};

export const getCommentListRequest = async (boardNumber: number | string) => {
    const result = await axios.get(GET_COMMENT_LIST_URL(boardNumber))
        .then(response => {
            const responseBody: GetCommentListResponseDto = response.data;
            return responseBody;
        }).catch(error => {
            if (!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });
    return result;
};

export const postCommentRequest = async (boardNumber: number | string, requestBody: PostCommentRequestDto, accessToken: string) => {
    const result = await axios.post(POST_COMMENT_URL(boardNumber), requestBody, authorization(accessToken))
        .then(response => {
            const responseBody: PostCommentResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if(!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });
    return result;
};

export const increaseViewCountRequest = async (boardNumber: number | string) => {
    const result = await axios.patch(INCREASE_VIEW_COUNT_URL(boardNumber))
        .then(response => {
            const responseBody: IncreaseViewCountResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });
    return result;
};

export const patchBoardSuccessToggleRequest = async (boardNumber: number | string, accessToken: string) => {
    const result = await axios.patch(PATCH_BOARD_SUCCESS_TOGGLE_URL(boardNumber), {}, authorization(accessToken))
        .then(response => {
            const responseBody: PatchBoardSuccessToggleResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });
    return result;
};

const GET_POPULAR_LIST_URL = () => `${API_DOMAIN}/search/popular-list`;
const GET_RELATION_LIST_URL = (searchWord: string) => `${API_DOMAIN}/search/${searchWord}/relation-list`;

export const getPopularListRequest = async () => {
    const result = await axios.get(GET_POPULAR_LIST_URL())
        .then(response => {
            const responseBody: GetPopularListResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });
    return result;
};

export const getRelationListRequest = async (searchWord: string) => {
    const result = await axios.get(GET_RELATION_LIST_URL(searchWord))
        .then(response => {
            const responseBody: GetRelationListResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if (!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });
    return result;
};

const GET_SIGN_IN_USER_URL = () => `${API_DOMAIN}/user`;
const GET_USER_URL = (email: string) => `${API_DOMAIN}/user/${email}`;
const PATCH_NICKNAME_URL = () => `${API_DOMAIN}/user/nickname`;
const PATCH_PROFILE_IMAGE_URL = () => `${API_DOMAIN}/user/profile-image`;

export const getSignInUserRequest = async (accessToken: string) => {
    const result = await axios.get(GET_SIGN_IN_USER_URL(), authorization(accessToken))
        .then(response => {
            const responseBody: GetSignInUserResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if(!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });
    return result;
};

export const getUserRequest = async (accessToken: string, email: string) => {
    const result = await axios.get(GET_USER_URL(email), authorization(accessToken))
        .then(response => {
            const responseBody: GetUserResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if(!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });
    return result;
};

export const patchNickNameRequest = async (accessToken: string, requestBody: PatchNicknameRequestDto) => {
    const result = await axios.patch(PATCH_NICKNAME_URL(), requestBody, authorization(accessToken))
        .then(response => {
            const responseBody: PatchNicknameResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if(!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });
    return result;
};

export const patchProfileImageRequest = async (accessToken: string, requestBody: PatchProfileImageRequestDto) => {
    const result = await axios.patch(PATCH_PROFILE_IMAGE_URL(), requestBody, authorization(accessToken))
        .then(response => {
            const responseBody: PatchProfileImageResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if(!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });
    return result;
};

const FILE_DOMAIN = `${DOMAIN}/file`;
const FILE_UPLOAD_URL = () => `${FILE_DOMAIN}/upload`;
const GET_BOARD_IMAGE_URLS = (boardNumber: string | number) => `${FILE_DOMAIN}/urls/${boardNumber}`;
const multipartFormData = { headers: { 'Content-Type': 'multipart/form-data' }}

export const fileUploadRequest = async (data: FormData) => {
    const result = await axios.post(FILE_UPLOAD_URL(), data, multipartFormData)
        .then(response => {
            const responseBody: string = response.data;
            return responseBody;
        })
        .catch(error => {
            return null;
        });
    return result;
};

export const getBoardImageUrlsRequest = async (accessToken: string, boardNumber: string | number) => {
    const result = await axios.get(GET_BOARD_IMAGE_URLS(boardNumber), authorization(accessToken))
        .then(response => {
            const responseBody: GetBoardImageUrlsResponseDto = response.data;
            return responseBody;
        })
        .catch(error => {
            if(!error.response) return null;
            const responseBody: ResponseDto = error.response.data;
            return responseBody;
        });
    return result;
};