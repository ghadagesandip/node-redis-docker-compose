const express = require('express');
const cli = require('nodemon/lib/cli');
const redis = require('redis')

const port = 5000;

const app = express();
const client = redis.createClient(6379,'127.0.0.1');

client.on('error', (err) => console.log('Redis Client Error', err));
const visits = 0;

( async()=>{
await client.connect();
const re = await client.ping();
const subscriber = client.duplicate();
await subscriber.connect();

await subscriber.subscribe('channel', (message) => {
    console.log('subscribed channel message', message); // 'message'
});

console.log('ping', re)
})()

//Set initial visits
client.set('visits', 0);

app.get('/', (req, res) => {
   res.send('working')
})

//defining the root endpoint
app.get('/visits', async (req, res) => {
    console.log('hi')
    const visits = await client.get('visits');
    const newVisitCount = parseInt(visits) + 1
   
    res.send('Number of visits is: ' + newVisitCount)
})

//specifying the listening port
app.listen(port, ()=>{
    console.log('Listening on port '+port)
})