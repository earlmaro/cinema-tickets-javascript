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
    it('should throw an InvalidPurchaseException if an infant ticket is bought without an accompanying adult or child ticket', async () => {
        const accountId = 1;

        const infantTicket = {
            slug: 'infant',
            noOfTicket: 2
        };

        try {
            await ticketService.purchaseTickets(accountId, infantTicket);
        } catch (error) {
            expect(error).to.be.instanceOf(InvalidPurchaseException);
            expect(error.message).to.equal('Tickets that cannot be alone (like infants) must be accompanied by another ticket.');
            expect(error.getErrorCode()).to.equal('INVALID_PURCHASE');
        }
    });

    // Test case with accompanying adult ticket (should pass without throwing an error)
    it('should allow an infant ticket when accompanied by an adult or child ticket', async () => {
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

});
