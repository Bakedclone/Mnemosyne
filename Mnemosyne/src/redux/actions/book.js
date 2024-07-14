import { server } from "../store.js";
import axios from 'axios';

import { getAllBooksFail, getAllBooksRequest, getAllBooksSuccess } from "../reducer/bookSlicer.js";

export const getAllBooks = () => async (dispatch) => {
    try {
        dispatch(getAllBooksRequest());
        const { data } = await axios.get(`${server}/getallbooks`, {
            withCredentials: true,
        });
        dispatch(getAllBooksSuccess(data));
    } catch (error) { 
        dispatch(getAllBooksFail(error.response.data.message));
    }
}