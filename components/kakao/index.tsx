import { useEffect } from "react";
import { KakaoType } from "./type";
import { LoginProps } from "@/pages";

interface ExtendedWindow extends Window {
  Kakao: KakaoType;
}
declare let window: ExtendedWindow;

const loadSdk = () => {
    return new Promise((resolve) => {
        const js: HTMLScriptElement = document.createElement("script");

        js.id = "kakao-sdk";
        js.src = "//developers.kakao.com/sdk/js/kakao.min.js";
        js.onload = resolve;

        document.body.append(js);
    });
};


export default function KakaoLogin({children, className, style, onSuccess, onFail}:LoginProps) {
  useEffect(() => {
      const kakaoInit = async (key:string) => {
          await loadSdk()
          window.Kakao?.init(key);
      }
      kakaoInit(`${process.env.NEXT_PUBLIC_KAKAO_KEY}`)
  },[])
  const clickKako = async () => {
    //카카오 로그인 구현
    try {
      window.Kakao?.Auth.login({
        success: async function (response) {
          window.Kakao?.API.request({
            url: "/v2/user/me",
            success: (profile) => {
              const result = {
                token: response.access_token,
                expires: response.expires_in,
                email: profile.kakao_account.email,
                nickname: profile.properties.nickname,
                provider: 'KAKAO'
              }
              onSuccess(result);
            },
            fail: (error) => onFail(error.error_description),
          });
        },
        fail: function (e) {
          // TODO: 로그인 실패 처리
          console.log(e);
        },
      });
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div className={className} style={style} onClick={clickKako}>{children}</div>
  )
}
