import axios from 'axios';

export const API = axios.create({
    baseURL: process.env.REACT_APP_API,
})

export const handleError = (err) => {
    if (err.response) {
        console.log(err.response.data)
        console.log(err.response.data.message)
        console.log(err.response.status)
    }
    if (err.response?.status === 401) {
         alert(err.response.data.err)
    }
    if (err.response === 404) {
        console.log('page not found')
    } else if (err.request) {
        console.error(err.request)
        console.error(err.massage)
    }
}