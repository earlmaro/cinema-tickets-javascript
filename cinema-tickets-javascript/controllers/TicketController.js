import TicketService from '../src/pairtest/TicketService.js';
// import TicketTypeRequest from '../src/pairtest/lib/TicketTypeRequest.js';
import TicketTypes from '../constants/TicketTypes.js';

const ticketService = new TicketService();

export const getAllTicketTypes = (req, res, next) => {
    try {
        validateTicketTypes();
        res.status(200).json({ TicketTypes });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
export const reserveTickets = (req, res, next) => {
    try {
        validateTicketTypes();
        const { accountId, ticketTypeRequests } = req.body;

        // Basic validation: check if accountId exists and is a number
        if (!accountId || !Number.isInteger(accountId)) {
            return res.status(400).json({ error: 'accountId is required and must be a number' });
        }

        // Check if ticketTypeRequests is an array
        if (!Array.isArray(ticketTypeRequests)) {
            return res.status(400).json({ error: 'ticketTypeRequests must be an array' });
        }
        ticketService.purchaseTickets(accountId, ...ticketTypeRequests);
        return;
        res.status(200).json(req.body );
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const validateTicketTypes = () => {
    if (TicketTypes.length < 1) {
        throw new TypeError('We are unable to process your order at the moment');
    }
};
