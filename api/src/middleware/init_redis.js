const Redis = require('redis')
const client = Redis.createClient({
    host: 'localhost',
    port: 6379
})

client.on('connect', () => {
    console.log('connected to redis')
})

client.on('ready', () => {
    console.log('redis ready')
})

client.on('error', (err) => {
    console.log(err.message)
})

client.on('end', () => {
    console.log('redis disconnected')
})

process.on('SIGINT', () => {
    client.quit()
})

module.exports = client