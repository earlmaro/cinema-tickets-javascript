/**
 * Immutable Object.
 */
import TicketTypes from '../../../constants/TicketTypes.js';
export default class TicketTypeRequest {
  #type;

  #noOfTickets;
  constructor(type, noOfTickets) {
    const ticketType = TicketTypes.find(ticket => ticket.slug === type);

    if (!ticketType) {
      throw new TypeError(`type must be ${this.TICKET_TYPES.slice(0, -1).join(', ')}, or ${this.TICKET_TYPES.slice(-1)}`);
    }

    if (!Number.isInteger(noOfTickets)) {
      throw new TypeError('noOfTickets must be an integer');
    }

    this.type = type;
    this.#noOfTickets = noOfTickets;

    Object.freeze(this);
  }

  getNoOfTickets() {
    return this.#noOfTickets;
  }

  // Static method to get all ticket types from TicketTypes.js
  static getAllTicketTypes() {
    return Object.values(TicketTypes);
  }
}
