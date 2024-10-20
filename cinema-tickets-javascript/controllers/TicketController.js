import TicketService from '../src/pairtest/TicketService.js';
// import TicketTypeRequest from '../src/pairtest/lib/TicketTypeRequest.js';
import ticketTypes from '../constants/TicketTypes.js';
import InvalidPurchaseException from '../src/pairtest/lib/InvalidPurchaseException.js';

const ticketService = new TicketService();

export const getAllTicketTypes = (req, res, next) => {
    try {
        validateTicketTypes();
        res.status(200).json({
            success: true,
            message: ticketTypes
        });
    } catch (error) {
        next(error);
    }
};
export const reserveTickets = (req, res, next) => {
    try {
        validateTicketTypes();
        const { accountId, ticketTypeRequests } = req.body;

        // Basic validation: check if accountId exists and is a number
        if (!accountId) {
            throw new InvalidPurchaseException('accountId is required and must be a number', 400, 'PURCHASE_NOT_ALLOWED');
        }

        // Check if ticketTypeRequests is an array
        if (!Array.isArray(ticketTypeRequests)) {
            throw new InvalidPurchaseException('ticketTypeRequests must be an array', 400, 'PURCHASE_NOT_ALLOWED');
        }
        let data = ticketService.purchaseTickets(accountId, ...ticketTypeRequests);
        res.status(200).json({
            success: true,
            message: data
        });
    } catch (error) {
        next(error);
    }
};

const validateTicketTypes = () => {
    if (ticketTypes.length < 1) {
        throw new InvalidPurchaseException('We are unable to process your request at the moment, no active tickets found', 400, 'PURCHASE_NOT_ALLOWED');
    }
};
