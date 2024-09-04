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

interface ImgSize {
    width: number;
    height: number;
}
export const resizeImage = async (url: string, target: ImgSize): Promise<string> => {
    const img = new Image();
    img.src = url;

    return new Promise((res, rej) => {
        try {
            img.onload = () => {
                const canvas = document.createElement("canvas");
                const resizingCtx = canvas.getContext("2d")!;

                canvas.width = target.width;
                canvas.height = target.height;

                resizingCtx.drawImage(
                    img,
                    0,
                    0,
                    img.width,
                    img.height,
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );

                const url = canvas.toDataURL("image/jpg");

                res(url);
            };
        } catch (e) {
            rej(e);
        }
    });
};