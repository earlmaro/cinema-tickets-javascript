import express from 'express';
import dotenv from 'dotenv';
import ticketRoute from './routes/ticketRoute.js'

// load env variables
dotenv.config({path: './config/config.env'});

const app = express();

// Body parser
app.use(express.json());
// Mount Routers
app.use('/api/v1/tickets', ticketRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} on ${PORT}`));