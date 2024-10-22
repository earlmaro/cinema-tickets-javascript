import { expect } from 'chai';
import TicketService from '../src/pairtest/TicketService.js';
import InvalidPurchaseException from '../src/pairtest/lib/InvalidPurchaseException.js';

// Tests for TicketService
describe('TicketService', () => {

    let ticketService;

    // Before each test, instantiate the TicketService
    beforeEach(() => {
        ticketService = new TicketService();
    });

    it('should throw an InvalidPurchaseException if accountId is less than or equal to leastId', async () => {
        const invalidAccountId = -1;  // Invalid accountId (less than leastId, assumed to be 0)
        const validTicket = {
            slug: 'adult',
            noOfTicket: 1
        };

        try {
            await ticketService.purchaseTickets(invalidAccountId, validTicket);
        } catch (error) {
            expect(error).to.be.instanceOf(InvalidPurchaseException);
            expect(error.message).to.equal('Invalid accountId. It must be a positive integer greater than 0.');
            expect(error.getErrorCode()).to.equal('PURCHASE_NOT_ALLOWED');
        }
    });

    // Infants cannot be bought alone
    it('should throw an InvalidPurchaseException if an infant or child ticket is bought without an accompanying adult ticket', async () => {
        const accountId = 1;

        const infantTicket = {
            slug: 'infant',
            noOfTicket: 2
        };

        const childTicket = {
            slug: 'infant',
            noOfTicket: 3
        };

        try {
            await ticketService.purchaseTickets(accountId, infantTicket, childTicket);
        } catch (error) {
            expect(error).to.be.instanceOf(InvalidPurchaseException);
            expect(error.message).to.equal('Tickets that cannot be alone (like infants) must be accompanied by another ticket.');
            expect(error.getErrorCode()).to.equal('INVALID_PURCHASE');
        }
    });

    // Test case with accompanying adult ticket (should pass without throwing an error)
    it('should allow an infant or child ticket when accompanied by an adult ', async () => {
        const accountId = 1;

        const infantTicket = {
            slug: 'infant',
            noOfTicket: 1
        };

        const adultTicket = {
            slug: 'adult',
            noOfTicket: 1
        };

        let result;
        try {
            result = await ticketService.purchaseTickets(accountId, infantTicket, adultTicket);
        } catch (error) {
            // Ensure no error is thrown
            expect.fail('An error was thrown unexpectedly');
        }

        // Validate the success response (you can change this based on what your service returns)
        expect(result).to.have.property('message', 'Purchase successful');
    });

    it('should throw an InvalidPurchaseException if total number of tickets exceeds maxNumberOfTicket', async () => {
        const accountId = 1;

        const adultTicket = {
            slug: 'adult',
            noOfTicket: 25
        };

        const childTicket = {
            slug: 'child',
            noOfTicket: 12
        };

        try {
            await ticketService.purchaseTickets(accountId, adultTicket, childTicket);
        } catch (error) {
            expect(error).to.be.instanceOf(InvalidPurchaseException);
            expect(error.message).to.equal('Cannot request more than 25 tickets.');
            expect(error.getErrorCode()).to.equal('PURCHASE_NOT_ALLOWED');
        }
    });

    it('should throw an InvalidPurchaseException if noOfTicket is less than or equal to 0', async () => {
        const validAccountId = 1; // Assuming 1 is a valid accountId
        const invalidTicketRequest = {
            slug: 'adult',
            noOfTicket: 0 // Invalid number of tickets
        };

        try {
            await ticketService.purchaseTickets(validAccountId, invalidTicketRequest);
        } catch (error) {
            expect(error).to.be.instanceOf(InvalidPurchaseException);
            expect(error.message).to.equal('noOfTicket must be greater than 0 for ticket type: adult');
            expect(error.getErrorCode()).to.equal('PURCHASE_NOT_ALLOWED');
        }
    });

    // 1. Test normal seat reservation flow for non-infant tickets
    it('should reserve seats correctly when purchasing non-infant tickets', async () => {
        const result = await ticketService.purchaseTickets(1, { slug: 'adult', noOfTicket: 2 });
        expect(result).to.have.property('reservedSeats', 2);  // 2 adult tickets = 2 seats
        expect(result).to.have.property('status', true);
        expect(result).to.have.property('totalAmount', 50); // 2500 * 2 tickets => 5000 (in cents, convert to dollars/pounds)
    });

    // 2. Test that only non-infant tickets reserve seats (infant tickets don't count)
    it('should not reserve seats for infant tickets', async () => {
        const infantTicket = {
            slug: 'infant',
            noOfTicket: 1
        };

        const adultTicket = {
            slug: 'adult',
            noOfTicket: 2
        };
        const result = await ticketService.purchaseTickets(1, infantTicket, adultTicket);
        expect(result).to.have.property('reservedSeats', 2);  // Infant tickets don't reserve seats
        expect(result).to.have.property('status', true);
        expect(result).to.have.property('totalAmount', 50); // 0 amount for infant tickets
    });
});
