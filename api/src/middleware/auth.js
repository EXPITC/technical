const { users } = require('../../models')
require("dotenv").config();
const bcrypt = require('bcrypt')
const joi = require('joi')
const jwt = require('jsonwebtoken')
const client = require('./init_redis');

exports.register = async (req, res) => {
    const schema = joi.object({
        email: joi.string().email().required(),
        password: joi.string().min(4).required(),
        name: joi.string().min(3).required(),
        role: joi.number().integer().optional(),
    })
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(401).send({
            err: error.details[0].message,
        })
    }
    try {
        const { email } = req.body
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
            console.log(valid)
        }
        console.log(valid)
        if (valid) {
            return res.status(201).send({
                status: 'failed',
                message: 'acc already exists'
            })
        }
        
        const salt = await bcrypt.genSalt(8)
        const hashPass = await bcrypt.hash(req.body.password, salt)

        const response = await users.create({
            name: req.body.name ,
            email:  email,
            password:  hashPass,
            role: 2
        })

        valid = await users.findOne({
            where: {email}
        })

        client.set(`${email}`, JSON.stringify(valid))

        const userData = {
            id: valid.id,
            email,
            role: valid.role
        }
        const {role,id } = valid
        const token = jwt.sign(userData,process.env.JWT_TOKEN)
        
        res.status(200).send({
            status: 'success',
            message: 'successfully register',
            data: {
                user: {
                    name: response.name,
                    email: email,
                    id,
                    role,
                    token,
                }
            },
            
        })
    } catch (err) {
        res.status(500).send({
            status: 'failed',
            message: 'server error: ' + err.message
        })
    }
}

exports.login = async (req, res) => {
    const schema = joi.object({
        email: joi.string().email().required(),
        password: joi.string().min(4).required(),
    })
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(401).send({
            err: error.details[0].message,
        })
    }

    try {
        
        const { email, password } = req.body
        console.log(email)
        function getValues () {
            return new Promise((resolve) => {
                client.get(`${email}`, async (error, data) => {
                    if(error) console.log(error)
                    if (data) return resolve(JSON.parse(data))
                    
                    return resolve(await users.findOne({
                        where: { email }
                    }))
                })
            })
        }
        const userAcc = await getValues()
        
        if (!userAcc) {
            return res.status(400).send({
                status: 'failed',
                message: 'email or password wrong'
            })
        }
        const valid = await bcrypt.compare(password, userAcc.password)
        if (!valid) {
            return res.status(400).send({
                status: 'failed',
                message: 'email or password wrong'
            })
        }
        const { id, name ,role } = userAcc
        const userData = {
            id,
            email,
            role
        }
        
        const token = jwt.sign(userData,process.env.JWT_TOKEN)

        res.status(200).send({
            status: 'login',
            role,
            name,
            email,
            token
        })

    }catch (err) {
        res.status(409).send({
            status: 'failed',
            message: 'server error: ' + err.message
        })
    }
}

exports.relogin = async (req, res) => {
    try {
        const data = new Promise(resolve => {
            client.get('user', (err, data) => {
                return resolve(JSON.parse(data))
            })
        })
        console.log(await data)
        const { email } = await data

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
        const userAcc = await getValues();
        const { id,name, role } = userAcc
        const userData = {
            id,
            role,
            email
        }
        
        const token = jwt.sign(userData,process.env.JWT_TOKEN)

        res.status(200).send({
            status: 'login',
            role,
            name,
            email,
            token
        })
    } catch (err) {
        res.status(500).send({
            status: 'failed',
            message: 'server error: ' + err.message
        })
    }
}

exports.passCheck = async (req, res) => {
    try {
        console.log('passCheck')
        console.log(req)
        const data = new Promise(resolve => {
            client.get('user', (err, data) => {
                return resolve(JSON.parse(data))
            })
        })
        const { email } = await data
        const {password} = await users.findOne({
            where : { email }
        })
        const valid = await bcrypt.compare(req.body.password, password)
        if (!valid) {
            return res.status(400).send({
                status: 'failed',
                message: 'password wrong'
            })
        }
        res.status(200).send({
            status: 'success',
            message: 'good to go'
        })
    } catch (err) {
        res.status(500).send({
            status: 'failed',
            message: 'server error: ' + err.message
        })
    }
}