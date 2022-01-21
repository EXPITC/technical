const express = require('express')
const router = express.Router();
const {
    token,
    admin,
    user
} = require('../middleware/userCheck')
const {
    register,
    login,
    relogin

} = require('../middleware/auth')

router.post('/register', register)
router.post('/login', login)
router.get('/login', token , relogin)


const {
    addUser,
    profileMe,
    getProfile,
    updateProfile,
    updateProfileAdmin,
    forgotPass,
    updatePass,
    updatePassAdmin,
    delUser,
    alluser
} = require('../controller/user');

const {
    listRoute,
    RBAC
} = require('../controller/route')

// admin
    // post
router.post('/create/user',  addUser)
// router.post('/create/user', token, admin, addUser)
    // get
router.get('/user/:id', token, admin, getProfile)
    // patch
router.patch('/update/user/:id', updateProfileAdmin)
// router.patch('/update/user/:id', token, admin, updateProfileAdmin)
router.patch('/user/resetPass/:id',token, admin, updatePassAdmin)
    // del
router.delete('/del/user/:id', token, admin, delUser)

// all
router.get('/list/user', alluser)
router.get('/list/route', listRoute)
router.get('/list/RBAC', RBAC)
router.get('/view/profile', token, profileMe)
router.post('/pass/forgot', forgotPass)
router.patch('/pass/reset', token, updatePass)
router.patch('/view/profile/update', token, updateProfile)




module.exports = router;