
export type NaverType =any | {
    LoginWithNaverId: (params: {
        clientId: string;
        callbackUrl: string;
        isPopup: boolean;
        loginButton: {
            color: string;
            type: number;
            height: number;
        },
    }) => any;
    init: (...args: any[]) => void;
}