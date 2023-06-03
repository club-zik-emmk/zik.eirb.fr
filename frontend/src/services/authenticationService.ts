import axios, {AxiosResponse} from 'axios';
import axiosInstance from "../axiosInstance";

function authenticateUser(ticket: string) {
    return new Promise((resolve, reject) => {
        // @ts-ignore
        axiosInstance.get(`api/v1/auth?ticket=${ticket}`, { withCredentials: true })
            .then((response: AxiosResponse<any>) => {
                if (!response.data.success) {
                    reject(response.data.error.message);
                    return;
                }

                resolve(response.data.user);
            })
            .catch(error => {
                reject(error);
            });
    });
}

function logoutUser() {
    return new Promise((resolve, reject) => {
        // @ts-ignore
        axiosInstance.get(`api/v1/logout`, { withCredentials: true })
            .then((response: AxiosResponse<any>) => {
                if (!response.data.success) {
                    reject(response.data);
                    return;
                }

                resolve({});
            })
            .catch(error => {
                reject(error);
            });
    });
}

export {authenticateUser, logoutUser};