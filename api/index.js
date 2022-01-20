const express = require('express');
const app = express();
const port = 5000;
const router = require('./src/routers');
// const redis = require('redis')
// const client = redis.createClient()
require('./src/middleware/init_redis');

// client.set('name', 'tc')
// client.get('name', (err,val)=> {
//     if(err) console.log(err)
//     console.log(val)
// })

const cors = require('cors');

app.use(express.json());
app.use(cors());
app.use('/v1/', router)

app.listen(port, () =>{console.log(`listen port http://localhost/${port}`)})