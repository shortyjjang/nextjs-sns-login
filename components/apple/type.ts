export type AppleType = any | {
    auth: (params: {
        clientId: string;
        scope: string;
        redirectURI: string;
        nonce: string;
        usePopup: boolean;
    }) => any
}
export type AppleResponseType = any | {
    detail :{
        authorization: {
            code: string;
            id_token: string;
            state: string
        }
        user?: {
            email: string;
            name: {
                firstName: string;
                lastName: string;
            }
        }
    }
}
export type AppleErrorType = {
    detail: {
        error: string
    }
}