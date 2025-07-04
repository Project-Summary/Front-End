import API from "../api";
import { ILoginData, IRegisterData } from "./interface.auth";

export default class AuthAPI {
    static login(data: ILoginData) {
        return API.post('/users/login', {email: data.email, password: data.password});
    }

    static register(data: IRegisterData) {
        return API.post('/users/register', data);
    }
    static forgotPassword(email: string) {
        return API.post(`/users/forgot-password`, { email });
    }

    static resetPassword(token: string, newPassword: string, confirmPassword: string) {
        return API.post(`/users/reset-password`, { token, newPassword , confirmPassword});
    }

    static logout() {
        return API.post('/users/logout');
    }
}