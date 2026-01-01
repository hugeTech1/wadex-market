import type { ISigninUser, IAddUserParams } from "../types/auth";
import type { IHTTPResponse } from "../types/http-response";
import type { IUserData } from "../types/auth";
import httpClient from "./httpClient.service";

export const addUser = (data: IAddUserParams) => {
    const payload = {
        params: {
            site_users_uuid: data.uuid,
            site_users_email: data.email,
            site_users_name: data.name,
            site_users_password: data.password,
            site_users_reg_date: data.regDate,
            site_users_status: data.status,
            site_users_username: data.username,
        },
        context: {
            query_id: "84e36d87-d1ba-41cb-9f32-4005da3103e1",
            application_id: "bbad4bf9-cb8f-44fb-913c-fb3e5b264ae0",
        },
        control: {
            preprocess: {
                process: "passSignup",
                params: {
                    password_field: "site_users_password",
                },
            },
            postprocess: {
                process: "postStandard",
                params: {},
            },
        },
    };

    return httpClient.post<IHTTPResponse<IUserData[]>>("/datasource", payload);
};

export const signinUser = (data: ISigninUser) => {
    const payload = {
        "params": {
            "site_users_password": data.password,
            "site_users_username": data.username
        },
        "context": {
            "query_id": "200085bb-aca7-479b-9cdf-e0982328667e",
            "application_id": "bbad4bf9-cb8f-44fb-913c-fb3e5b264ae0"
        },
        "control": {
            "preprocess": {
                "process": "preStandard",
                "params": {}
            },
            "postprocess": {
                "process": "passLogin",
                "params": {
                    "password_field": "site_users_password"
                }
            }
        }
    };

    return httpClient.post<IHTTPResponse<IUserData[]>>("/datasource", payload);
};


export const editUser = (user: any, oldPassword: string, newPassword: string) => {
    const payload = {
        "params": {
            "site_users_uuid": user.site_users_uuid,
            "site_users_email": user.site_users_email,
            "site_users_name": user.site_users_name,
            "site_users_reg_date": ":NOW",
            "site_users_status": user.site_users_status || "active",
            "site_users_username": user.site_users_username,
            "site_users_password": newPassword,
            "site_users_old_password": oldPassword
        },
        "context": {
            "query_id": "667d95d1-32c6-481e-a139-6cecf6ee6542",
            "application_id": "bbad4bf9-cb8f-44fb-913c-fb3e5b264ae0"
        },
        "control": {
            "preprocess": {
                "process": "preStandard",
                "params": {}
            },
            "postprocess": {
                "process": "postStandard",
                "params": {}
            }
        }
    }

    return httpClient.post<IHTTPResponse<IUserData[]>>("/datasource", payload);
};


export const delUser = (uuid: any) => {
    const payload = {
        "params": {
            "site_users_reqdel": ":NOW",
            "site_users_uuid": uuid,
        },
        "context": {
            "query_id": "b1035b7c-ac4c-4bad-8975-9d29cc8e7a3f",
            "application_id": "bbad4bf9-cb8f-44fb-913c-fb3e5b264ae0"
        },
        "control": {
            "preprocess": {
                "process": "preStandard",
                "params": {}
            },
            "postprocess": {
                "process": "postStandard",
                "params": {}
            }
        }
    }

    return httpClient.post<IHTTPResponse<IUserData[]>>("/datasource", payload);
};

