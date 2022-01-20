import React ,{useEffect,useContext} from 'react';
import jwt from 'jsonwebtoken';
//React router
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

//components
import LandingPage from '../components/LandingPage'
import Home from '../components/Home'

import {API, handleError} from '../config/api'
import { UserContext } from '../Context/userContext';


const RouterSetup = () => {

    const {state, dispatch} = useContext(UserContext)
    const check = async () => {
      try {
        const res = await API.get('/login')
        const verify = jwt.verify(res.data.token, process.env.REACT_APP_JWT_TOKEN);
        const {role } = verify
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
  if (user.role === 'admin') {
    isAdmin = true
  }
    return (
        <Router>
            <Routes>
          {isLogin ?
            <>
              <Route path="/" element={<Home/>}/>
             </>
            :
            <Route exact path="/" element={<LandingPage />} />}
                <Route path="*" element={<><h1>Error 404 </h1></>}/>
            </Routes>
    </Router>
    )
}
 

export default RouterSetup