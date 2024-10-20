/**
 * Immutable Object.
 */
import TicketTypes from '../../../constants/TicketTypes.js';
export default class TicketTypeRequest {
  #type;
  #slug;
  #price;
  #noOfTickets;
  constructor(type, noOfTickets) {
    const ticketType = TicketTypes.find(ticket => ticket.slug === type);

    if (!ticketType) {
      throw new TypeError(`type must be ${this.TICKET_TYPES.slice(0, -1).join(', ')}, or ${this.TICKET_TYPES.slice(-1)}`);
    }

    if (!Number.isInteger(noOfTickets)) {
      throw new TypeError('noOfTickets must be an integer');
    }

    if (!Number.isInteger(ticketType.price)) {
      throw new TypeError('price of ticket must be an integer)');
    }

    this.#type = ticketType.type;
    this.#slug = ticketType.slug;
    this.#price = ticketType.price;
    this.#noOfTickets = noOfTickets;

    Object.freeze(this);
  }

  getNoOfTickets() {
    return this.#noOfTickets;
  }

  getTicketType() {
    return this.#type;
  }

  getTicketSlug() {
    return this.#slug;
  }

  getPrice() {
    return this.#price;
  }
}
