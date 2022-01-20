const { users } = require('../../models')
const client = require('../middleware/init_redis')
const bcrypt = require('bcrypt')


exports.addUser = async (req, res) => {
    try {
        const data = req.body;
        const { email } = data;
        function getValues () {
            return new Promise((resolve) => {
                client.get(`${email}`, async (error, data) => {
                    if(error) console.log(error)
                    if (data != null) return resolve(JSON.parse(data))
                    
                    return resolve(await users.findOne({
                        where: { email }
                    }))
                })
            })
        }
        let valid = await getValues()
        if (valid) {
            return res.status(201).send({
                status: 'failed',
                message: 'acc already exists'
            })
        }
        const salt = await bcrypt.genSalt(8)
        const hashPass = await bcrypt.hash(req.body.password, salt)

        const response = await users.create({
            ...data,
            password:  hashPass,
        }, {
            attributes: {
                exclude:['password','createdAt','updatedAt']
            }
        })
        client.set(`${email}`, JSON.stringify(response))
        res.status(200).send({
            status: 'success',
            message: 'user successfully added',
            data: {
                user: {
                    response
                }
            }
        })
    } catch (err) {
        res.status(409).send({
            status: 'failed',
            message: 'server error: ' + err.message
        })
    }
}

// view profile #user by radis
exports.profileMe = async (req, res) => {
    try {
        const data = new Promise(resolve => {
            client.get('user', (err, data) => {
                return resolve(JSON.parse(data))
            })
        })
        const { email, id } = await data
        const userData = client.get(`${email}`)
        if (!userData) {
            const user = users.findOne({
                attributes: {
                    exclude:['password','createdAt','updatedAt']
                },
                where: { id }
            })
            if (!user) return res.send(400).send({
                status: 'fail',
                message: 'user details found'
            })

            res.status(200).send({
                status: 'success',
                message: 'user successfully retrieved',
                data: {
                    user: user
                }
            })
        }
        res.status(200).send({
            status: 'success',
            message: 'user successfully retrieved',
            data: {
                user: JSON.stringify(userData)
            }
        })
    } catch (err) {
        res.status(409).send({
            status: 'failed',
            message: 'server error: ' + err.message
        })
    }
}
// view profile #admin by params id
exports.getProfile = async (req, res) => {
    try {
        const { id } = req.params
        const userData = await users.findOne({
            attributes: {
                exclude:['password','createdAt','updatedAt']
            },
            where: { id }
        })
        userData ? 
        res.status(200).send({
            status: 'success',
            message: 'user successfully retrieved',
            data: {
                user: userData
            }
        }) :
        res.status(400).send({
            status: 'fail',
            message: 'user not found',
            data: {
                user: "user details not found"
            }
        })
    } catch (err) {
        res.status(409).send({
            status: 'failed',
            message: 'server error: ' + err.message
        })
    }
}
// update profile
exports.updateProfile = async (req, res) =>{
    try {
        const user = new Promise(resolve => {
            client.get('user', (err, data) => {
                return resolve(JSON.parse(data))
            })
        })
        const { id } = await user
        const data = req.body
        const res = await users.update({
            ...data,
        }, {
            where: {id}
        })
        client.del(`${res.email}`)
        client.set(`${res.email}`, JSON.stringify(res))
        res.send({
            status: 'success',
            message: 'user successfully update' 
        })
        
    } catch (err) {
        res.status(409).send({
            status: 'failed',
            message: 'server error: ' + err.message
        })
    }
}
// update profile admin
exports.updateProfileAdmin = async (req, res) =>{
    try {
        const {id} = req.params
        const data = req.body
        const res = await users.update({
            ...data,
        }, {
            where: {id}
        })
        client.del(`${res.email}`)
        client.set(`${res.email}`, JSON.stringify(res))

        res.send({
            status: 'success',
            message: 'user successfully update' 
        })
        
    } catch (err) {
        res.status(409).send({
            status: 'failed',
            message: 'server error: ' + err.message
        })
    }
}
// reset password #admin
exports.updatePassAdmin = async (req, res) =>{
    try {
        const {id} = req.params
        const data = req.body
        const response = await users.update({
            password: data
        }, {
            where: {id}
        })
        client.del(`${response.email}`)
        client.set(`${response.email}`, JSON.stringify(response))
        res.send({
            status: 'success',
            message: 'successfully update pass' 
        })
        
    } catch (err) {
        res.status(409).send({
            status: 'failed',
            message: 'server error: ' + err.message
        })
    }
}
// reset pass user
exports.updatePass = async (req, res) =>{
    try {
        const user = new Promise(resolve => {
            client.get('user', (err, data) => {
                return resolve(JSON.parse(data))
            })
        })
        const { id } = await user
        const data  = req.body
        const response = await users.update({
            password: data
        }, {
            where: {id}
        })
        client.del(`${response.email}`)
        client.set(`${response.email}`, JSON.stringify(response))
        res.send({
            status: 'success',
            message: 'successfully update pass' 
        })
        
    } catch (err) {
        res.status(409).send({
            status: 'failed',
            message: 'server error: ' + err.message
        })
    }
}
// delete #admin
exports.delUser = async (req, res) =>{
    try {
        const {id} = req.params
        const response = await users.destroy({
            where: {id}
        })
        client.del(`${response.email}`)

        res.send({
            status: 'success',
            message: 'user successfully destroy' 
        })
        
    } catch (err) {
        res.status(409).send({
            status: 'failed',
            message: 'server error: ' + err.message
        })
    }
}