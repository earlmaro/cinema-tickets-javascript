/**
 * Immutable Object.
 */
import ticketTypes from '../../../constants/TicketTypes.js';
import InvalidPurchaseException from "./InvalidPurchaseException.js";
export default class TicketTypeRequest {
  #type;
  #slug;
  #price;
  #noOfTickets;
  constructor(type, noOfTickets) {
    const ticketType = ticketTypes.find(ticket => ticket.slug === type);

    if (!ticketType) {
      const availableTypes = ticketTypes.map(ticket => ticket.slug);
      throw new InvalidPurchaseException(`type must be ${availableTypes.slice(0, -1).join(', ')}, or ${availableTypes.slice(-1)}`);
    }

    if (!Number.isInteger(noOfTickets)) {
      throw new InvalidPurchaseException('noOfTickets must be an integer');
    }

    if (!Number.isInteger(ticketType.price)) {
      throw new InvalidPurchaseException('price of ticket must be an integer)');
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
