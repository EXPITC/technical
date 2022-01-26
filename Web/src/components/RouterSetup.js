import React ,{useEffect,useContext} from 'react';
import jwt from 'jsonwebtoken';
//React router
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

//components
import LandingPage from '../components/LandingPage'
import Home from '../components/Home'
import Client from '../components/Client'
import ForgetPassPage from '../components/ForgetPass'

import {API, handleError} from '../config/api'
import { UserContext } from '../Context/userContext';


const RouterSetup = () => {

    const {state, dispatch} = useContext(UserContext)
    const check = async () => {
      try {
        const res = await API.get('/login')
        console.log(res)
        const verify = jwt.verify(res.data.token, process.env.REACT_APP_JWT_TOKEN);
        const { role } = verify
        console.log(verify)
        console.log(role)
        dispatch({
          status: 'login',
          payload: {...res.data,role}
        })
      } catch (err) {
        handleError(err)
      }
    }
    useEffect(() => {
      console.log('hit')
      check()
    }, [])
  const { isLogin, user } = state
  console.log(isLogin)
  let isAdmin = false
  if (user.role === 1) {
    isAdmin = true
  }
    return (
        <Router>
            <Routes>
          {isLogin ?
            <>
              {isAdmin ?
                <>
                  <Route path="/" element={<Home />} />
                </>
                :
                <>
                  <Route path="/" element={<Client />} />
                </>
              }
            </>
            :
            <>
            <Route exact path="/" element={<LandingPage />} />
            <Route exact path="/forget/password" element={<ForgetPassPage />} />
            </>
          }
            <Route path="*" element={<><h1>Error 404 </h1></>}/>
            </Routes>
    </Router>
    )
}
 

export default RouterSetup