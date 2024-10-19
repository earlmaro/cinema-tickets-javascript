import express from 'express';
const ticketRoute = express.Router();

import * as TicketController from '../controllers/TicketController.js';

ticketRoute.get('/', TicketController.getAllTicketTypes);

ticketRoute.post('/', TicketController.reserveTickets);


export default ticketRoute;
