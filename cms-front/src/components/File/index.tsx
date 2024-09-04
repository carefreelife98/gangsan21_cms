import {resizeImage} from "../../utils";
import {useEffect, useState} from "react";
import "./style.css";
import Select, {SingleValue} from "react-select";
import ResizeImageOption from "../../types/interface/resize-image-option.interface";
import {useBoardStore} from "../../stores";

const sizeOptions = [
    { label: "(정) 32 x 32", value: 1 },
    { label: "(정) 64 x 64", value: 2 },
    { label: "(정) 128 x 128", value: 3 },
    { label: "(정) 256 x 256", value: 4 },
    { label: "(직) 512 x 320", value: 5 },
    { label: "(직) 320 x 512", value: 6 },
    { label: "(정) 512 x 512", value: 7 },
    { label: "(직) 768 x 1024", value: 8 },
    { label: "(직) 1024 x 768", value: 9 },
    { label: "(정) 1024 x 1024", value: 10 },
];

const resizeOptions: ResizeImageOption[] = [
    {width: 32, height: 32},
    {width: 64, height: 64},
    {width: 128, height: 128},
    {width: 256, height: 256},
    {width: 512, height: 320},
    {width: 320, height: 512},
    {width: 512, height: 512},
    {width: 768, height: 1024},
    {width: 1024, height: 768},
    {width: 1024, height: 1024}
]


export default function ResizeImageButton() {

    // state: 선택 옵션 상태
    const [items, setItems] = useState<SingleValue<typeof sizeOptions[0]>>();
    const {imageWidth, setImageWidth} = useBoardStore();
    const {imageHeight, setImageHeight} = useBoardStore();

    const handleOption = (selections: SingleValue<typeof sizeOptions[0]>) => {
        setItems(selections);
    };

    useEffect(() => {
        if (!items) return;
        if (!items.value) return;
        if (items.value === -1) {
            setImageWidth(768);
            setImageHeight(1024);
        } else {
            setImageWidth(resizeOptions[items.value - 1].width);
            setImageHeight(resizeOptions[items.value - 1].height);
        }
    }, [items]);

    return (
        <div id='resize-image-wrapper'>
            <div className='resize-image-container'>
                <Select options={sizeOptions}
                        defaultValue={{value: -1, label: '이미지 사이즈를 선택해주세요 (기본: 768 x 1024)'}}
                        onChange={handleOption}/>
            </div>
        </div>
    );
}
