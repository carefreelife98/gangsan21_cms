import {Outlet, useLocation} from "react-router-dom";
import Footer from "../footer";
import Header from "../Header";
import {AUTH_PATH} from "../../constants";

//         component: 레이아웃          //
export default function Container() {

    //         state: 현재 페이지의 path name 상태          //
    const {pathname} = useLocation();

    //         component: 레이아웃 렌더링          //
    return (
        <>
            <Header/>
            <Outlet/>
            {pathname !== AUTH_PATH() && <Footer/> /* 인증 페이지가 아닌 경우 푸터 노출 */ }
        </>
    );
};
