import KakaoLogin from "@/components/kakao";
import Cookies from 'js-cookie'
import { useRecoilState } from "recoil";
import { userState } from '@/states/user'
import dayjs from 'dayjs'
import { KakaoType } from "@/components/kakao/type";
import NaverLogin from "@/components/naver";
import { useState } from "react";

export type LoginProps = {
  className?:string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onSuccess: (response: LoginType) => void;
  /** 로그인 실패 후 콜백 */
  onFail?: (error: string) => void;
  setLogin?: (response: any) => void;
}
export type LoginType = {
  token: string;
  expires: string;
  email: string;
  nickname: string;
  provider: string;
}
interface ExtendedWindow extends Window {
  Kakao: KakaoType;
}
declare let window: ExtendedWindow;

export default function Home() {
  const [user, setUser] = useRecoilState(userState)
  const [login, setLogin] = useState<any>(null)
  const onLogout = () => {
    if(!user.isLogin) return;
    switch(user.provider){
      case 'KAKAO':
        window.Kakao?.Auth.logout(() => {
          setUser({
            nickname: '',
            email:'',
            isLogin: false,
            provider: ''
          })
        });
      break;
      case 'NAVER':
        login.logout();
      break;
      case 'APPLEID':
      break;
      case 'GOOGLE':
      break;
      default:
        alert('로그인하신 소셜을 찾을수 없습니다.')
      break;
    }
  }
  const onLogin = (response:LoginType) => {
    Cookies.set('accessToken',response.token, {expires : dayjs(response.expires).diff(dayjs(), 'minute') * (1/24/60)})
    setUser({
      email: response.email,
      nickname: response.nickname,
      isLogin: true,
      provider: response.provider
    })
  }
  const onFail = (error:string) => {
    alert('로그인에실패하셨습니다\n'+error)
  }
  return (
    <>
      <h1>Login</h1>
      {user.isLogin ?
        <button onClick={onLogout}>{user.provider} 로그아웃 하기</button>
      : <>
        <KakaoLogin onSuccess={onLogin} onFail={onFail} style={{background:'#fee500'}}>카카오로 로그인하기</KakaoLogin>
        <NaverLogin onSuccess={onLogin} setLogin={setLogin}></NaverLogin>
      </>}
    </>
  )
}
