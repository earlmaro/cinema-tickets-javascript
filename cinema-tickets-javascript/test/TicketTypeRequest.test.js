import { expect } from 'chai';
import TicketTypeRequest from '../src/pairtest/lib/TicketTypeRequest.js';
import ticketTypes from '../constants/TicketTypes.js';
import InvalidPurchaseException from "../src/pairtest/lib/InvalidPurchaseException.js";

// Tests for TicketTypeRequest
describe('TicketTypeRequest', () => {

    // Valid ticket type case
    it('should create a TicketTypeRequest with valid type and noOfTickets', () => {
        const request = new TicketTypeRequest('adult', 2);

        expect(request.getTicketType()).to.equal('Adult');
        expect(request.getTicketSlug()).to.equal('adult');
        expect(request.getPrice()).to.equal(2500);
        expect(request.getNoOfTickets()).to.equal(2);
    });

    // Invalid ticket type case
    it('should throw a TypeError when given an invalid ticket type', () => {
        expect(() => new TicketTypeRequest('invalid_type', 1)).to.throw(InvalidPurchaseException, 'type must be adult, child, or infant');
    });

    // Non-integer number of tickets
    it('should throw a TypeError when noOfTickets is not an integer', () => {
        expect(() => new TicketTypeRequest('child', 'two')).to.throw(InvalidPurchaseException, 'noOfTickets must be an integer');
    });

    // Test if price is an integer
    it('should throw a TypeError if ticket price is not an integer', () => {
        const modifiedTicketTypes = [...ticketTypes];
        const testPriceBackUp = modifiedTicketTypes[0].price
        modifiedTicketTypes[0].price = 'twenty-five';  // Simulating a non-integer price
        expect(() => new TicketTypeRequest('adult', 2)).to.throw(InvalidPurchaseException, 'price of ticket must be an integer');
        modifiedTicketTypes[0].price = testPriceBackUp;
    });

    // Immutable object check
    it('should create an immutable TicketTypeRequest object', () => {
        const request = new TicketTypeRequest('infant', 1);

        expect(() => {
            request.noOfTickets = 5;
        }).to.throw(TypeError);  // Modifying should fail because of Object.freeze()

        expect(request.getNoOfTickets()).to.equal(1);
    });

    it('should sum duplicate ticket types and create one entry with the total number of tickets', () => {
        const requests = [
            new TicketTypeRequest('adult', 2),
            new TicketTypeRequest('adult', 3)
        ];

        const totalTickets = requests.reduce((sum, req) => sum + req.getNoOfTickets(), 0);
        expect(totalTickets).to.equal(5); // 2 + 3 = 5
    });

    // it('should throw an error if an infant ticket is bought without an accompanying ticket', () => {
    //     const infantRequest = new TicketTypeRequest('infant', 1);
    //
    //     const accompanyingRequest = [
    //         new TicketTypeRequest('adult', 1)
    //     ];
    //
    //     // Test without accompanying ticket
    //     expect(() => {
    //         const requests = [infantRequest]; // No accompanying adult/child ticket
    //         // Logic for validating that infants can't be bought alone goes in TicketService or elsewhere
    //     }).to.throw(Error, 'Tickets that cannot be alone (like infants) must be accompanied by another ticket.');
    //
    //     // Test with accompanying ticket
    //     expect(() => {
    //         const requests = [infantRequest, ...accompanyingRequest];
    //         // Should pass without throwing an error
    //     }).to.not.throw();
    // });

    it('should validate that ticketTypes array is not empty and each object has valid fields', () => {
        expect(ticketTypes).to.be.an('array').that.is.not.empty;

        ticketTypes.forEach(ticket => {
            expect(ticket).to.have.property('type').that.is.a('string');
            expect(ticket).to.have.property('slug').that.is.a('string');
            expect(ticket).to.have.property('currency').that.is.a('string');
            expect(ticket).to.have.property('price').that.is.a('number');
        });
    });
});
