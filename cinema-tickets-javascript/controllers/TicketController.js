import TicketService from '../src/pairtest/TicketService.js';
// import TicketTypeRequest from '../src/pairtest/lib/TicketTypeRequest.js';
import TicketTypes from '../constants/TicketTypes.js';

const ticketService = new TicketService();

export const getAllTicketTypes = (req, res, next) => {
    try {
        res.status(200).json({ TicketTypes });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
export const reserveTickets = (req, res, next) => {
    try {
        const { accountId, ticketTypeRequests } = req.body;

        // Basic validation: check if accountId exists and is a number
        if (!accountId || !Number.isInteger(accountId)) {
            return res.status(400).json({ error: 'accountId is required and must be a number' });
        }

        // Check if ticketTypeRequests is an array
        if (!Array.isArray(ticketTypeRequests)) {
            return res.status(400).json({ error: 'ticketTypeRequests must be an array' });
        }
        const response = ticketService.purchaseTickets(accountId, ...ticketTypeRequests);
        return;
        res.status(200).json(req.body );
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// exports.getTicketss = (req, res, next) => {
//     try {
//         // For example, extracting accountId and ticket requests from the request body
//         const { accountId, ticketRequests } = req.body;
//
//         // Call the service to handle ticket purchase logic
//         const response = ticketService.purchaseTickets(accountId, ...ticketRequests);
//
//         // Send back the response as JSON
//         res.status(200).json(response);
//     } catch (error) {
//         // Handle any errors thrown by the service
//         res.status(400).json({ error: error.message });
//     }
// };