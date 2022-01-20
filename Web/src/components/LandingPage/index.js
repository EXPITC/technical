import React, { useState, useEffect, useContext} from 'react';
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../../Context/userContext';
import { API, handleError } from '../../config/api';


import { Wrapper , Bg , InputSection} from './LandingPage.styled';

const LandingPage = () => {
    const navigate = useNavigate()
    const {dispatch} = useContext(UserContext)
  
    const [Form, setForm] = useState({
        email: '',
        password: '',
    })
    const handelChange = (e) => {
        setForm({
            ...Form,
            [e.target.name]: e.target.value
        })
    }

    const handelLogin = async (e) => {
        try {
            e.preventDefault()
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            const body = JSON.stringify(Form)
            const response = await API.post("/login", body, config);
            if (response?.status === 200) {
                dispatch({
                    status: 'login',
                    payload: response.data
                })
                navigate('/')
            }
        } catch (err) {
            handleError(err)
            if (err.response?.status === 400) {
                alert(err.response.data.message)
            }
        }
    }
    return (
        <>
        <Bg>
        <Wrapper>
            <h2>Login</h2>
            <InputSection type="email" name="email" placeholder="email" onChange={handelChange}/>
            <InputSection type="password" name="password" placeholder="password"  onChange={handelChange}/>
            <button class="btnlogin2" onClick={handelLogin}>LOGIN</button>
        </Wrapper>
        </Bg>
        </>
    )
};

export default LandingPage;