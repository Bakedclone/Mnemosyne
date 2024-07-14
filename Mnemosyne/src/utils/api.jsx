import axios from 'axios';

const BASE_URL = "https://www.googleapis.com/books/v1/volumes";


export const fetchDataFromApi = async(url)=>{
    try{
        const {data} = await axios.get(BASE_URL + url)
        return data;
    } catch(err){
        console.log(err);
        // return err;
        throw new Error("Something went wrong!");
    }
}