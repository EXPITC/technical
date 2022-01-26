import { useState } from 'react'
import { Wrapper, Bg, InputSection } from '../LandingPage/LandingPage.styled';
import { Link ,useNavigate} from 'react-router-dom';
import { API, handleError } from '../../config/api';

const ForgetPass = () => {
    const navigate = useNavigate()
    const [id, setId] = useState(null)
    const [Form, setForm] = useState({
        email: '',
        name: '',
    })
    const [pass, setPass] = useState({
        password: ''
    })
    const handelChange = (e) => {
        setForm({
            ...Form,
            [e.target.name]: e.target.value
        })
    }
    const handelCheck = async (e) => {
        try {
            e.preventDefault()
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            const body = JSON.stringify(Form)
            await API.post("/user/check/forgot/pass", body, config)
                .then(res => setId(`${res.data.id}`))
                .catch(err => handleError(err))
        } catch (err) {
            handleError(err)
            if (err.response?.status === 400) {
                alert(err.response.data.message)
            }
        }
    }
    const handleReset = async (e) => {
        try {
            e.preventDefault()
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            const body = JSON.stringify(pass)
            await API.post(`/pass/forgot/${id}`, body, config)
                .then(res => navigate('/'))
                .catch(err => handleError(err))
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
            {id?
            <>
            <h2>Enter New Password</h2>
            <InputSection type="password" name="password" placeholder="password" onChange={(e)=> setPass({password: e.target.value})}/>
            <button class="btnlogin2" onClick={handleReset}>Change</button>
            </>
            :
            <>
            <h2>Forgot Password</h2>
            <InputSection type="email" name="email" placeholder="email" onChange={handelChange}/>
            <InputSection type="name" name="name" placeholder="name"  onChange={handelChange}/>
            <button class="btnlogin2" onClick={handelCheck}>Check</button>
            <Link to="/" style={{textDecoration: 'none',color:"black"}} >
                <p>Back To Login &#8594;</p>
            </Link>
            </>
            }
        </Wrapper>
        </Bg>
        </>
    )
}

export default ForgetPass