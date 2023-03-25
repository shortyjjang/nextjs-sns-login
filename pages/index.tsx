import KakaoLogin from "@/components/kakao";
import Cookies from 'js-cookie'
import { useRecoilState } from "recoil";
import { userState } from '@/states/user'
import dayjs from 'dayjs'
import { KakaoType } from "@/components/kakao/type";

interface ExtendedWindow extends Window {
  Kakao: KakaoType;
}
declare let window: ExtendedWindow;
export type LoginType = {
  token: string;
  expires: string;
  email: string;
  nickname: string;
  provider: string;
}
export default function Home() {
  const [user, setUser] = useRecoilState(userState)
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
      </>}
    </>
  )
}
