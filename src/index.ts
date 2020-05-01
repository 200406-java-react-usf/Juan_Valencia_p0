import express from 'express';
import { UserRouter } from './routers/user-router'

const app = express();


app.use('/', express.json());


app.use('/users', UserRouter);
//app.use('/stats', StatsRouter);

app.listen(8080, () => {
    console.log('listening on http://localhost:' + 8080);
})