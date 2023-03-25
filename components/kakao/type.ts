import { LoginType } from "@/pages";
import React from "react";


type KakaoResponse = {
    /** 토큰 타입, bearer 로 고정 */
    token_type: string;
    /** 사용자 액세스 토큰 값 */
    access_token: string;
    /** 액세스 토큰 만료 시간(초) */
    expires_in: string;
    /** 사용자 리프레시 토큰 값 */
    refresh_token: string;
    /** 리프레시 토큰 만료 시간(초) */
    refresh_token_expires_in: number;
    /** 인증된 사용자의 정보 조회 권한 범위 */
    scope: string; // 범위가 여러 개일 경우, 공백으로 구분
}
export type KaKaoProps = {
    className?:string;
    children: React.ReactNode;
    style?: React.CSSProperties;
    onSuccess: (response: LoginType) => void;
    /** 로그인 실패 후 콜백 */
    onFail: (error: string) => void;
}
type KakaoAccount = {
    /** 프로필 정보 */
    profile: KaKaoProfile;
    /** 대표 이메일 */
    email: string;
    /** 연령대 ref: https://developers.kakao.com/docs/latest/ko/kakaologin/common#user-info */
    age_range: string;
    /** 생일, MMDD 형식 */
    birthday: string;
    /** 태어난 해, YYYY 형식 */
    birthyear: string;
    /** 성별, female/male */
    gender: "female" | "male";
    /** 전화번호. 카카오톡에 등록된 전화번호 */
    phone_number: string;
    /** 연계정보. 암호화된 이용자 확인 값 */
    ci: string;
}
type KaKaoProfile =  {
    /** 닉네임 */
    nickname: string;
    /** 프로필 이미지 URL, 640px * 640px 또는 480px * 480px */
    profile_image: string;
    /** 프로필 미리보기 이미지 URL, 110px * 110px 또는 100px * 100px */
    thumbnail_image_url: string;
    /** 사용자 동의 시 프로필 제공 가능 */
    profile_needs_agreement?: boolean;
};
type KaKaoUserInfo = {
    /** 회원번호 */
    id: number;
    /** 카카오계정 정보 */
    kakao_account: KakaoAccount;
    /** 카카오싱크 간편가입을 통해 로그인한 시각, UTC */
    synched_at: string;
    /** 서비스에 연결 완료된 시각, UTC */
    connected_at: string;
    /** JSON 추가 정보 */
    properties: KaKaoProfile
}
type KakaoError = {
    error: string;
    error_description: string;
}
type KakaoParams = {
    /** 간편 로그인 사용 여부 (default: true) */
    throughTalk?: boolean;
    /** 세션이 종료된 뒤에도 액세스 토큰을 사용할 수 있도록 로컬 스토리지에 저장합니다. (default: true)  */
    persistAccessToken?: boolean;
    /** 추가 동의 받을 항목의 키 */
    scope?: string;
    /** 로그인이 성공할 경우 토큰을 받을 콜백 함수 */
    success: (response: KakaoResponse) => void;
    /** 로그인이 실패할 경우 에러를 받을 콜백 함수 */
    fail: (error: KakaoError) => void;
}
export type KakaoType = {
    init: (...args: any[]) => void;
    Auth:  {
        login: (params: KakaoParams) => void;
        loginForm: (params: KakaoParams) => void;
        logout: (callback: () => void) => void;
        getAccessToken: () => string | null;
    };
    API: {
        request: (params: {
            url: string;
            success: (profile: KaKaoUserInfo) => void;
            fail: (error: KakaoError) => void;
        }) => void;
    };
}