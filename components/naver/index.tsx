import { useCallback, useEffect, useState } from "react";
import { NaverType} from "./type";
import { LoginProps } from "@/pages";
import { useRouter } from "next/router";
import dayjs from "dayjs";
interface ExtendedWindow extends Window {
    naver: NaverType
}
declare let window: ExtendedWindow;

const loadSdk = () => {
    return new Promise((resolve) => {
        const js: HTMLScriptElement = document.createElement("script");

        js.id = "naver-sdk";
        js.src = "//static.nid.naver.com/js/naveridlogin_js_sdk_2.0.0.js";
        js.onload = resolve;

        document.body.append(js);
    });
};


export default function NaverLogin({children, className, style, onSuccess}:LoginProps) {
    const [initNaver, setInitNaver] = useState<boolean>(false)
    const router = useRouter()
    const naverInit = useCallback(async (key:string) => {
        await loadSdk()
        const naverLogin = new window.naver.LoginWithNaverId({
            clientId: key,
            callbackUrl: router.asPath,
            isPopup: true,
            loginButton: {
            color: "green",
            type: 1,
            height: 10,
            },
        });
        naverLogin.init();
        setInitNaver(true)
        //로그인 된 상태인지 검사
        if(!router.query.accessToken) return;
        const token = router.query.accessToken?.toString()
        naverLogin.getLoginStatus((status:any) => {
            if(status) {
                //로그인상태일때
                const email = naverLogin.user.getEmail();
                const nickname = naverLogin.user.getNickName();
                onSuccess({
                    token: token,
                    nickname: nickname,
                    email: email,
                    expires: dayjs().add(30, 'minute').format('YYYY-MM-DD hh:mm:ss'),
                    provider: 'NAVER'
                })
            }
        }) 
    },[onSuccess, router.asPath, router.query.accessToken])
    useEffect(() => {
        if(!initNaver) naverInit(`${process.env.NEXT_PUBLIC_NAVER_YES_US_CLIENT_KEY}`)
    },[initNaver, naverInit])
    useEffect(() => {
        if(router.asPath.includes('#access_token')) {
            //새창으로 로그인이 구현됐을때 새창을 닫고 원래 페이지로 리다이렉팅
            const access_token = router.asPath.replace(`/${router.pathname}#`, "").split("&")[0].split("=")[1]
            window.opener.location.href = `/${router.pathname}?accessToken=${access_token}&social=naver`;
            window.self.close();
        }
        if(router.query.social === 'naver') {
            naverInit(`${process.env.NEXT_PUBLIC_NAVER_YES_US_CLIENT_KEY}`)
        }
    },[naverInit, router.asPath, router.pathname, router.query.social])
    return (
        <div className={className} style={style}>{children}</div>
    )
}
