import { useEffect, useState, useContext } from 'react'
import {UserContext} from '../../Context/userContext'
import { Container ,Button} from 'react-bootstrap'
import { Contain } from './ClientPage.styled'
import {API, handleError} from '../../config/api'
function Client() {
    const [user, setUser] = useState(null)
    const {dispatch} = useContext(UserContext)
    useEffect(() => {
        fetch = async () => {
            await API.get('/view/profile')
                .then(res => {
                    setUser(res.data.data?.user)
                })
                .catch(err => handleError(err))
        }
        fetch()
    },[])
    const logout = () => {
        dispatch({
            status: 'logout'
        })
    }
    return (
        <Contain>
            <Container className="d-flex justify-content-center">
                <div className="me-2 d-flex flex-column">
                    <h1>Client</h1>
                    <Button variant="danger" onClick={logout}>Logout</Button>
                </div>
                <div style={{
                        border: "1px solid black",
                        height: "100px",
                    width: 0,
                        opacity:".5"
                    }}/>
                <div className="ms-2">
                    <h3 className="d-block">Name: {user?.name}</h3>
                    <h3 className="d-block">Email: {user?.email}</h3>
                    <h3 className="d-block">Phone: {user?.phone}</h3>
                </div>
            </Container>
        </Contain>
    )
}

export default Client