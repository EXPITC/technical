import React, { useState, useEffect, useContext } from 'react';
import {Container ,Navbar , Button ,Table ,Modal ,Col, Toast} from 'react-bootstrap'
import { UserContext} from '../../Context/userContext'
import {API, handleError} from '../../config/api'


const Home = () => {
    const { dispatch } = useContext(UserContext)
    const [timer, setTimer] = useState(false)
    const [notif, setNotif] = useState({
        status: 'Welcome',
        type: 'Admin',
        message: 'Welcome Back Admin'
    })
    // data form
    const [form, setForm] = useState({
        email:'',
        name: '',
        phone: '',
        password: ''
    })
    const [pass, setPass] = useState({
        password : ''
    })
    const [passOK, setPassOK] = useState(false)
    const [editId, setEditId] = useState(null)
    const handelChange = (e) => {
        console.log([e.target.name])
        console.log(e.target.value)
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }
    // data user
    const [userList, setUserList] = useState([])
    const fetch = async()=> {
        await API.get('/list/user')
            .then(res => setUserList(res.data.response))
            .catch(err => handleError(err))
    }
    useEffect(() => {
        fetch();
    },[])
    // modal
    const [showReset, setShowReset] = useState(false)
    const [show, setShow] = useState(false);
    const [showA, setShowA] = useState(true);
    const [isNew, setIsNew] = useState(false);
        // handle
    const toggleShowA = () => { setShowA(!showA); setTimer(!timer);};
    const handleClose = () => setShow(false);

    const handleShow = (state, data) => {
        setShow(true)
        switch (state) {
            case 'new': {
                setForm({
                    email: '',
                    name: '',
                    phone: '',
                    password: ''
                })
                setShowReset(false)
                setIsNew(true)
                return;
            }
            case 'edit': {
                setForm({
                    email: `${data.email}`,
                    name: `${data.name}`,
                    phone: `${data.phone}`,
                    password: ''
                })
                setShowReset(false)
                setEditId(data.id)
                setIsNew(false)
                return;
            }
            case 'oldPass': {
                setShowReset(true);
            }
        }
    };
    useEffect(() => {
        const time = setTimeout(() => setShowA(false), 2500);
        return () => clearTimeout(time);
    },[timer])
    const send = async (e, state ,id) => {
        e.preventDefault()
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const body = JSON.stringify(form)
        const dataPass = JSON.stringify(pass)
        switch (state) {
            case 'edit': return (
                await API.patch(`/update/user/${editId}` ,body , config)
                    .then(res => {
                        setNotif({
                            status: 'Success',
                            type: 'Edit',
                            message: `Successfully update on ID : ${editId} `
                        })
                        toggleShowA()
                        fetch()
                        handleClose()
                    })
                    .catch(err => {
                        setNotif({
                            status: 'Fail',
                            type: 'Edit',
                            message: `Failed update on ID : ${editId} `
                        })
                        toggleShowA()
                        handleError(err)
                    })
            )
            case 'new': return (
                await API.post('/create/user' , body ,config)
                    .then((res) => {
                        console.log(res)
                        setNotif({
                            status: 'Success',
                            type: 'New user',
                            message: `Successfully create ${res?.data?.data?.user?.response?.name || 'acc'} as new user `
                        })
                        toggleShowA()
                        fetch()
                        handleClose()
                    })
                    .catch(err => {
                        setNotif({
                            status: 'Fail',
                            type: 'New user',
                            message: `Failed create new user`
                        })
                        toggleShowA()
                        handleError(err)
                    })
            )
            case 'checkPass': return (
                await API.post('/pass/check', dataPass ,config)
                    .then(() => {
                        setNotif({
                            status: 'Pass',
                            type: 'Check Password',
                            message: `On right password ready to go...`
                        })
                        toggleShowA()
                        setPassOK(true)
                        setPass({ password: '' })
                    })
                    .catch(err => {
                        setNotif({
                            status: 'Not pass',
                            type: 'Check Password',
                            message: `Opss..., Something wrong trying to remember and try again...`
                        })
                        toggleShowA()
                        handleError(err)
                    })
            )
            case 'updatePass': return (
                await API.patch('/pass/reset' , dataPass , config)
                    .then(() => {
                        setNotif({
                            status: 'Change',
                            type: 'Reset Password',
                            message: `Your password successfully has been change`
                        })
                        toggleShowA()
                        setPassOK(false)
                        setPass({ password: '' })
                        handleClose()
                    })
                    .catch(err => {
                        setNotif({
                            status: 'Not Change',
                            type: 'Reset Password',
                            message: `Your password fail to change`
                        })
                        toggleShowA()
                        handleError(err)
                    })
            )
            case 'delete': {
                await API.delete(`/del/user/${id}`)
                    .then(() => {
                        setNotif({
                            status: 'Deleted',
                            type: 'Delete',
                            message: `Account with user ID : ${id}, has been successfully delete`
                        })
                        toggleShowA()
                        fetch()
                        handleClose()
                    })
                    .catch(err => {
                        setNotif({
                            status: 'Fail',
                            type: 'Delete',
                            message: `Account with user ID : ${id}, failed to delete`
                        })
                        toggleShowA()
                        handleError(err)
                    })
            }
        }
    }
    const logout = () => {
        dispatch({
            status: 'logout'
        })
    }
    return (
        
        <>
            <Col md={6} className="mb-2" style={{
                display: 'block',
                position: "absolute",
                zIndex: "100",
                top: 50,
                left: 10
            }}>
                <Toast show={showA} onClose={toggleShowA} bg="dark">
                <Toast.Header>
                    <img
                    src="holder.js/20x20?text=%20"
                    className="rounded me-2"
                    alt=""
                    />
                    <strong className="me-auto">{notif.status}</strong>
                    <small>{notif.type}</small>
                </Toast.Header>
                <Toast.Body className={'Dark text-white'}>{notif.message}</Toast.Body>
                </Toast>
            </Col>
            <Navbar style={{
                background: "black",
            }}>
                <Container fluid={true} >
                    <h2 style={{
                        color:"white"
                    }}>Admin Dashboard</h2>
                    <div className="d-flex gap-3" >
                        <Button variant="warning" onClick={() => handleShow('oldPass')} >Reset Password</Button>
                        <Button variant="danger" onClick={logout}>Logout</Button>
                        <Button variant="success" onClick={()=> handleShow('new')}>New User</Button>
                    </div>
                </Container>
            </Navbar>
            <Table className="mt-3 text-center">
                <thead>
                    <tr >
                        <th scope='col'>ID</th>
                        <th scope='col'>Name</th>
                        <th scope='col'>Email</th>
                        <th scope='col'>Phone</th>
                        {/* <th scope='col'>Password</th> */}
                        <th scope='col'>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {/* LOOP */}
                    {userList.map((x) => {
                        return(
                        <tr key={`${x.id}`}>
                            <td>{x.id}</td>
                            <td>{x.name}</td>
                            <td>{x.email}</td>
                            <td>{x.phone}</td>
                            {/* <td type="password">{x.password}</td> */}
                            <td className="d-flex justify-content-center gap-3 ">
                                <Button variant="info" onClick={()=> handleShow('edit',x)}>Edit</Button>
                                <Button variant="danger" onClick={(e)=>send(e,'delete',x.id)}>Delete</Button>
                            </td>
                        </tr>
                        )
                    })}
                </tbody>
            </Table>
            <>
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                    <Modal.Title>Modal heading</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <form>
                        {showReset?
                        <>
                            {passOK?
                                <>
                                    <div class="mb-3">
                                        <label for="oldPass" class="form-label" >Enter new password</label>
                                        <input type="password" id="oldPass" name="oldPass" class="form-control"
                                            onChange={(e)=> setPass({password: e.target.value})}
                                            value={pass.password}
                                        />
                                    </div>
                                </>
                                :
                                <>
                                    <div class="mb-3">
                                        <label for="newPass" class="form-label" >Enter your password</label>
                                        <input type="password" id="newPass" name="newPass" class="form-control"
                                            onChange={(e)=> setPass({password: e.target.value})}
                                            value={pass.password}
                                        />
                                    </div>
                                </>
                            }
                        </>
                        :
                        <>
                        <div class="mb-3">
                            <label for="email" class="form-label" >Email address</label>
                                <input type="email" id="email" name="email"class="form-control"
                                    onChange={handelChange}
                                    value={form.email}
                                />
                        </div>
                        <div class="mb-3">
                            <label for="name" class="form-label">Name</label>
                                <input type="name" id="name" name="name" class="form-control"
                                    onChange={handelChange}
                                    value={form.name}
                                />
                        </div>
                        <div class="mb-3">
                            <label for="phone" class="form-label">phone</label>
                                <input type="phone" id="phone" name="phone" class="form-control"
                                    onChange={handelChange}
                                    value={form.phone}
                                />
                        </div>
                        <div class="mb-3">
                            <label for="password" class="form-label">Password</label>
                                <input type="password" id="password"  name="password" class="form-control"
                                    onChange={handelChange}
                                    value={form.password}
                                />
                        </div>
                        </>
                        }
                    </form>
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    {showReset?
                        <>
                                {passOK?
                                <Button
                                    variant="warning"
                                    onClick={(e) => send(e, 'updatePass')}
                                >CHANGE</Button> 
                            :
                                <Button
                                    variant="primary"
                                    onClick={(e) => send(e, 'checkPass')}
                                >Submit</Button>
                            }
                        </>
                    :
                        <>
                                {isNew === false ?
                                <Button
                                    variant="primary"
                                    onClick={(e) => send(e, 'edit')}
                                >Save Changes</Button> 
                            :
                                <Button
                                    variant="primary"
                                    onClick={(e) => send(e, 'new')}
                                >Create New</Button>
                            }
                        </>
                    }
                    </Modal.Footer>
                </Modal>
            </>
        </>
        
    )
};


export default Home;