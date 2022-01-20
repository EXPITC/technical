import React,{ createContext, useReducer } from 'react'
import {API} from '../config/api'
export const UserContext = createContext(null);
const initialState = {
    isLogin: false,
    user: {},
}

const reducer = (state, action) => {
    const { status, payload } = action;
    switch (status) {
        case 'login':
            localStorage.setItem('token', payload.token)
            API.defaults.headers.common['Authorization'] = `Bearer ${payload.token}`
            return {
                isLogin: true,
                user: payload
            }
        case 'logout':
            delete API.defaults.headers.common['Authorization']
            localStorage.removeItem('token')
            return {
                isLogin: false,
                user: {}
            }
        default:
            throw new Error();
    }    
}

export const UserContextProvider = ({ children}) => {
    const [state, dispatch] = useReducer(reducer, initialState)
    return (
        < UserContext.Provider value={{ state, dispatch }} >
            {children}       
        </UserContext.Provider>
    )
}