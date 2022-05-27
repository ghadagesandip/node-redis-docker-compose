const express = require('express')
const redis = require('redis')

const app = express()
const client = redis.createClient({
    url: 'redis://redis:6379'
});

client.on('error', (err) => console.log('Redis Client Error', err));
const visits = 0;



( async()=>{
await client.connect();
const re = await client.ping();
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
    await client.set('visits', newVisitCount)
    res.send('Number of visits is: ' + newVisitCount)
})

//specifying the listening port
app.listen(8081, ()=>{
    console.log('Listening on port 8081')
})