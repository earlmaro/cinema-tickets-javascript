import TicketTypes from '../../constants/TicketTypes.js';
import InvalidPurchaseException from './lib/InvalidPurchaseException.js';

export default class TicketService {
  /**
   * Should only have private methods other than the one below.
   */

  #reservations = [];
  purchaseTickets(accountId, ...ticketTypeRequests) {
    try {
      this.#validateAccountId(accountId);
      const totalTickets = this.#calculateTotalTickets(ticketTypeRequests);
      console.log(totalTickets);
      // this.#validateTotalTickets(totalTickets);
      // this.#validateTicketTypes(ticketTypeRequests);
      // this.#createReservations(ticketTypeRequests);
      //
      // // Here, you might call payment or seat reservation services later
      // return { reservations: this.#reservations, totalTickets };
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
    return ticketTypeRequests.reduce((total, request) => total + this.#getNoOfTickets(), 0);
  }

  #getNoOfTickets(ticketTypeRequests) {
    return Object.values(TicketTypes);
  }

}
