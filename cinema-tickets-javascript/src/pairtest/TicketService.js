import TicketTypes from '../../constants/TicketTypes.js';
import TicketTypeRequest from './lib/TicketTypeRequest.js';
import TicketPaymentService from '../thirdparty/paymentgateway/TicketPaymentService.js';
import InvalidPurchaseException from './lib/InvalidPurchaseException.js';

export default class TicketService {
  /**
   * Should only have private methods other than the one below.
   */
  #reservations = [];
  #totalAmountToPay;
  purchaseTickets(accountId, ...ticketTypeRequests) {
    try {
      this.#validateAccountId(accountId);
      const totalTickets = this.#calculateTotalTickets(ticketTypeRequests);
      this.#validateTotalTickets(totalTickets);
      this.#validateTicketTypes(ticketTypeRequests);
      this.#createReservations(ticketTypeRequests);
      this.#totalAmountToPay = this.#calculateTotalAmountToPay(ticketTypeRequests);
      this.#makePayment(accountId);
    } catch (error) {
      throw new InvalidPurchaseException(error.message);
    }
    // throws InvalidPurchaseException
  }

  // Private method to validate account ID
  #validateAccountId(accountId) {
    if (!Number.isInteger(accountId) || accountId <= 0) {
      throw new Error('Invalid accountId. It must be a positive integer.');
    }
  }

  #calculateTotalTickets(ticketTypeRequests) {
    return ticketTypeRequests.reduce((total, item) => total + item.noOfTicket, 0);
  }
  #getNoOfTickets(ticketTypeRequests) {
    return Object.values(TicketTypes);
  }
  #validateTotalTickets(totalTickets) {
    if (totalTickets > 25) {
      throw new Error('Cannot request more than 25 tickets.');
    }
  }

  #validateTicketTypes(ticketTypeRequests) {
    let containsDependentTicket = false; // Flag for ticket with cannotBeAlone = true
    let containsIndependentTicket = false; // Flag for ticket with cannotBeAlone = false
    ticketTypeRequests.forEach(ticket => {
      const ticketDetails = TicketTypes.find(t => t.slug === ticket.slug);
      if (!ticketDetails) {
        throw new InvalidPurchaseException(`Invalid ticket type: ${ticket.slug}`);
      }

      // Update flags based on cannotBeAlone attribute
      if (ticketDetails.cannotBeAlone) {
        containsDependentTicket = true;
      } else {
        containsIndependentTicket = true;
      }
    })
    if (containsDependentTicket && !containsIndependentTicket) {
      throw new InvalidPurchaseException('Tickets that cannot be alone (like infants) must be accompanied by another ticket.');
    }
  }

  #createReservations(ticketTypeRequests) {
    this.#reservations = ticketTypeRequests.map(request => {
      const { slug, noOfTicket } = request;
      return new TicketTypeRequest(slug, noOfTicket);
    });
  }

  #calculateTotalAmountToPay() {
    return this.#reservations.reduce((total, item) => total + (item.getNoOfTickets() * item.getPrice()), 0);
  }

  #makePayment(accountId) {
    if(this.#reservations.length < 1){
      throw new Error('No tickets found.');
    }
    let payment = new TicketPaymentService();
    payment.makePayment(accountId, this.#totalAmountToPay);
    throw new TypeError('Processing payment...');
  }

}
