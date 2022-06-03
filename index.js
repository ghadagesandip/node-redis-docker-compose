const express = require('express')
const redis = require('redis')

const app = express()
// inside container
const client = redis.createClient({
    url: 'redis://redis:6379'
});

//outside container
// const client = redis.createClient(6379,'127.0.0.1');


client.on('error', (err) => console.log('Redis Client Error', err));

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
    await client.publish('channel', JSON.stringify({visits_count: newVisitCount}));
    res.send('Number of visits is: ' + newVisitCount)
})

//specifying the listening port
app.listen(8081, ()=>{
    console.log('Listening on port 8081')
})