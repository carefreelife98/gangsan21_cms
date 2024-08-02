// url 을 받아서 실제 typescript 내에서 사용할 수 있는 파일 객체로 변경.
export const convertUrlToFile = async (url: string) => {
    const response = await fetch(url);
    const data = await response.blob();

    // 확장자
    const extend = url.split('.').pop();
    const fileName = url.split('/').pop();
    const meta = {type: `image/${extend}`};

    return new File([data], fileName as string, meta)
};

export const convertUrlsToFile = async (urls: string[]) => {
    const files: File[] = [];
    for (const url of urls) {
        const file = await convertUrlToFile(url);
        files.push(file);
    }
    return files;
};