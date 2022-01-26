const { users } = require('../../models')
const client = require('../middleware/init_redis')
const bcrypt = require('bcrypt')


exports.addUser = async (req, res) => {
    try {
        const data = req.body;
        const { email } = data;
        function getValues () {
            return new Promise((resolve) => {
                client.get(`${email}`, async (error, dataRes) => {
                    if(error) console.log(error)
                    if (dataRes != null) return resolve(JSON.parse(dataRes))
                    
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
            role:2,
            password:  hashPass,
        }, {
            attributes: {
                exclude:['password','createdAt','updatedAt']
            }
        })
        console.log(data)
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
        console.log(email)
        const userData = new Promise(resolve => {
            client.get(`${email}`, (err, data) => {
                return resolve(JSON.parse(data))
            })
        })
        console.log(await userData)
        if (await !userData) {
            const user = await users.findOne({
                where: { id },
                attributes: {
                    exclude:['password','createdAt','updatedAt']
                }
            })
            console.log(user)
            if (!user) return res.send(400).send({
                status: 'fail',
                message: 'user details found'
            })

            return res.status(200).send({
                status: 'success',
                message: 'user successfully retrieved',
                data: user
            })
        }
        res.status(200).send({
            status: 'success',
            message: 'user successfully retrieved',
            data: {
                user: await userData
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
        if (data.password) {
            console.log('hit')
            const salt = await bcrypt.genSalt(8)
            const hashPass = await bcrypt.hash(req.body.password, salt)
            await users.update({
                ...data,
                password: hashPass
            }, {
                where: { id }
            })
        } else {
            console.log('miss')
            await users.update({
                ...data,
            }, {
                where: { id }
            })
        }
        client.del(`${data.email}`)
        client.set(`${data.email}`, JSON.stringify(res))
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
        console.log(id)
        const data= req.body
        console.log(data)
        if (data.password != '') {
            const salt = await bcrypt.genSalt(8)
            const hashPass = await bcrypt.hash(req.body.password, salt)
            await users.update({
                ...data,
                password: hashPass
            }, {
                where: {id}
            })
        } else {
            let noPass = Object.fromEntries(Object.entries(data).filter(([_, v]) => v != ''));
            await users.update({
                ...noPass
            }, {
                where: {id}
            })
        }
        const response = await users.findOne({
           where: {email : data.email} 
        })
        client.del(`${data.email}`)
        client.set(`${response.email}`, JSON.stringify(response))
        // console.log(response)
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
        const salt = await bcrypt.genSalt(8)
        const hashPass = await bcrypt.hash(req.body.password, salt)
        const response = await users.update({
            password: hashPass
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
        const salt = await bcrypt.genSalt(8)
        const hashPass = await bcrypt.hash(req.body.password, salt)
        const response = await users.update({
            password: hashPass
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
// forget pass 
exports.forgotPass = async (req, res) => {
    try {
        console.log("hit")
        const { email, name } = req.body
        const response = await users.findOne({
            where: {
                email,
                name
            }
        })
        if (!response) {
            return res.status(200).send({
                status: 'failed user not found'
            })
        }
        res.status(201).send({
            status: 'pass',
            id: response.id
        })
    } catch (err) {
        res.status(409).send({
            status: 'failed',
            message: err.message
        })
    }
}
// delete #admin
exports.delUser = async (req, res) =>{
    try {
        const { id } = req.params
        const {email} = await users.findOne({
            where:{id}
        })
        await users.destroy({
            where: {id}
        })
        client.del(`${email}`)

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

exports.alluser = async (req, res) => {
    try {
        const {id} = req.params
        const response = await users.findAll({
            where : {
                role : 2
            },
            attributes: {
                exclude:['password','createdAt','updatedAt']
            }
        })

        res.send({
           response
        })
        
    } catch (err) {
        res.status(409).send({
            status: 'failed',
            message: 'server error: ' + err.message
        })
    }
}