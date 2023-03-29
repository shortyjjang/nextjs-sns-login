import { useCallback, useEffect, useState } from "react";
import { AppleType,AppleResponseType, AppleErrorType} from "./type";
import { LoginProps } from "@/pages";
import { useRouter } from "next/router";
import dayjs from "dayjs";
interface ExtendedWindow extends Window {
    AppleID: AppleType
}
declare let window: ExtendedWindow;

const loadSdk = () => {
    return new Promise((resolve) => {
        const js: HTMLScriptElement = document.createElement("script");

        js.id = "apple-sdk";
        js.src = "//appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js";
        js.onload = resolve;

        document.body.append(js);
    });
};


export default function AppleLogin({children, className, style, onSuccess, onFail, setLogin}:LoginProps) {
    const [load, setLoad] = useState<boolean>(false)
    const router = useRouter()
    const appleInit = async () => {
        await loadSdk()
        window.AppleID?.auth({
            clientId: `${process.env.NEXT_PUBLIC_APPLE_CLIENT_KEY}`,
            scope: "name email",
            redirectURI: router.asPath,
            nonce: `${process.env.NEXT_PUBLIC_APPLE_NONCE}`,
            usePopup: true
        })
        setLoad(true)
    }
    useEffect(() => {
        if(!load) appleInit()
        document.addEventListener("AppleIDSignInOnSuccess", (data:AppleResponseType) => {
          let authorization = data.detail.authorization;
          if (authorization.code) {
            const accessToken = authorization.code;
          }
          if(data.detail.user){

          }
          onSuccess(data.detail.user ?{
            token: data.detail.authorization,
            expires: dayjs().add(30, 'minute').format('YYYY-MM-DD hh:mm:ss'),
            email: <data className="detail"></data>.email,
            nickname: profile.properties.nickname,
            provider: 'KAKAO'
          }:{
            token: data.detail.authorization,
            expires: dayjs().add(30, 'minute').format('YYYY-MM-DD hh:mm:ss'),
            email: profile.kakao_account.email,
            nickname: profile.properties.nickname,
            provider: 'KAKAO'
          } )
          setLogin('APPLE')
        });

        document.addEventListener("AppleIDSignInOnFailure", (error:AppleErrorType) => {
            onFail(error.detail.error)
        });
    },[])
    return (
        <div className={className} style={style} onClick={() => load && window.AppleID.auth.signIn()}>{children}</div>
    )
}
