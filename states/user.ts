import { atom } from 'recoil';

export const userState = atom({
    key: 'user',
    default: {
        nickname: '',
        email:'',
        isLogin: false,
        provider: ''
    }
});
