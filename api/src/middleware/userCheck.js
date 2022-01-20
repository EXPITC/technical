const jwt = require('jsonwebtoken');
const client = require('./init_redis')
require("dotenv").config();
const DEFAULT_EXPIRATION = 3600;

exports.token = async (req, res, next) => {
    const auth = req.header('Authorization');
    const token = auth && auth.split(' ')[1]

    if (!token) {
        return res.status(400).send({
            status: 'failed',
            messsage: 'Invalid token'
        })
    }

    try {
        
        const verify = jwt.verify(token, process.env.JWT_TOKEN)

        // res.send(verify)
        // req.user = verify;
        client.del('user')
        client.SETEX('user', DEFAULT_EXPIRATION, JSON.stringify(verify));
        next();
    } catch (err) {
        res.status(409).send({
            status: 'failed',
            message: 'server error: ' + err.message
        })
    }

}

exports.admin = async (req, res, next) => {
    try {
        
        const data = new Promise(resolve => {
            client.get('user', (err, data) => {
                return resolve(JSON.parse(data))
            })
        })
        console.log(await data)
        const { role } = await data
        console.log(role)
        if (role != 1) return res.status(400).send({
            status: 'not admin'
        })

        next();
    } catch (err) {
        res.status(409).send({
            status: 'failed',
            message: 'server error: ' + err.message
        })
    }
}

// exports.user = async (req, res, next) =>{
//     try {

//         const {role} = client.get('user', async (err) => {if(err) console.log(err)})
//         // const {role} = req.user

//         if (role != 0) return res.status(400).send({
//             status: 'not user'
//         })
        
//         next();
//     } catch (err) {
//         res.status(409).send({
//             status: 'failed',
//             message: 'server error: ' + err.message
//         })
//     }
// }