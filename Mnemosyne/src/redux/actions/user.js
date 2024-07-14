import { server } from "../store.js";
import axios from 'axios';
import { loginRequest, loginFail, loginSuccess, loadUserRequest, loadUserSuccess, loadUserFail, logoutRequest, logoutSuccess, logoutFail, registerRequest, registerSuccess, registerFail, bookNowRequest, bookNowSuccess, bookNowFail, addAdminRequest, addAdminSuccess, addAdminFail } from "../reducer/userSlicer.js";

export const login = (email, password) => async (dispatch) => {
    try {
        dispatch(loginRequest());
        const { data } = await axios.post(`${server}/login`, { email, password }, {
            headers: {
                "Content-type": "application/json"
            },
            withCredentials: true,
        });
        dispatch(loginSuccess(data));
    } catch (error) { 
        dispatch(loginFail(error.response.data.message));

    }
}

export const register = (formdata) => async (dispatch) => {
    try {
        dispatch(registerRequest());
        console.log(formdata);
        const { data } = await axios.post(`${server}/register`, formdata, {
            headers: {
                "Content-type": "application/json",
            },
            withCredentials: true,
        });
        dispatch(registerSuccess(data));
    } catch (error) { 
        dispatch(registerFail(error.response.data.message));

    }
}

export const loadUser = () => async (dispatch) => {
    try {
        dispatch(loadUserRequest());
        const { data } = await axios.get(`${server}/me`, {
            withCredentials: true,
        });
        dispatch(loadUserSuccess(data.user));
    } catch (error) { 
        dispatch(loadUserFail(error.response.data.message));

    }
}

export const logout = () => async (dispatch) => {
    try {
        dispatch(logoutRequest());
        const  {data}  = await axios.get(`${server}/logout`, {
            withCredentials: true,
        });
        dispatch(logoutSuccess(data.message));
    } catch (error) { 
        dispatch(logoutFail(error.response.data.message));

    }
}

export const bookNow = (SharingCapacity, PropertyID, Description, CheckINDate) => async (dispatch) => {
    try {
        dispatch(bookNowRequest());
        const  {data}  = await axios.post(`${server}/booknow`,{SharingCapacity, PropertyID, Description, CheckINDate}, {
            headers: {
                "Content-type": "application/json"
            },
            withCredentials: true,
        });
        dispatch(bookNowSuccess(data));
    } catch (error) { 
        dispatch(bookNowFail(error.response.data.message));
    }
}

export const addAdmin = (UserID) => async (dispatch) => {
    try {
        dispatch(addAdminRequest());
        const  {data}  = await axios.get(`${server}/admin/user/${UserID}`, {
            withCredentials: true,
        });
        dispatch(addAdminSuccess(data));
    } catch (error) { 
        dispatch(addAdminFail(error.response.data.message));
    }
}