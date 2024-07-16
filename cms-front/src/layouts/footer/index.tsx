import './style.css';

//          component: 푸터 레이아웃          //
export default function Footer() {

    //          event handler: 사이트 아이콘 버튼 클릭 이벤트 처리          //
    const onSiteIconButtonClickHandler = () => {
        window.open('https://www.gangsan21.com')
    };

    //          event handler: 네이버 블로그 아이콘 버튼 클릭 이벤트 처리          //
    const onBlogIconButtonClickHandler = () => {
        window.open('https://blog.naver.com/ghskfen347')
    };

    //          render: 푸터 레이아웃 렌더링          //
    return (
        <div id='footer'>
            <div className='footer-container'>
                <div className='footer-top'>
                    <div className='footer-logo-box'>
                        <div className='icon-box'>
                            <div className='icon logo-light-icon'></div>
                        </div>
                        <div className='footer-logo-text'>{'Gang San 21 M&A CMS'}</div>
                    </div>
                    <div className='footer-link-box'>
                        <div className='footer-email-link'>{'csm12180318@gmail.com'}</div>
                        <div className='icon-button' onClick={onSiteIconButtonClickHandler}>
                            <div className='icon site-icon' ></div>
                        </div>
                        <div className='icon-button' onClick={onBlogIconButtonClickHandler}>
                            <div className='icon naver-blog-icon'></div>
                        </div>
                    </div>
                </div>
                <div className='footer-bottom'>
                    <div className='footer-copyright'>{'© 2023 Gangsan21 M&A. All rights reserved. | Copyrighted by Carefreelife98'}</div>
                </div>
            </div>
        </div>
    );
}
