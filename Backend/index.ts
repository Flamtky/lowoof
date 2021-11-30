import express from 'express';
 
const app: express.Application = express();
const port: number = 3000;

app.get('/', (req, res) => {
    res.send('Hello World, from express');
});

app.listen(port, () => console.log(`Hello world app listening on port ${port}!`))