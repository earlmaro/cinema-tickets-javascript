import ticketTypes from '../../constants/TicketTypes.js';
import TicketTypeRequest from './lib/TicketTypeRequest.js';
import TicketPaymentService from '../thirdparty/paymentgateway/TicketPaymentService.js';
import SeatReservationService from '../thirdparty/seatbooking/SeatReservationService.js';
import InvalidPurchaseException from './lib/InvalidPurchaseException.js';

export default class TicketService {
  /**
   * Should only have private methods other than the one below.
   */
  #reservations = [];
  #totalAmountToPay;
  static #leastId = 0;
  static #maxNumberOfTicket = 25;
  #seats = 0;
  async purchaseTickets(accountId, ...ticketTypeRequests) {
    try {
      this.#validateAccountId(accountId);
      const totalTickets = this.#calculateTotalTickets(ticketTypeRequests);
      this.#validateTotalTickets(totalTickets);
      this.#validateTicketTypes(ticketTypeRequests);
      this.#createReservations(ticketTypeRequests);
      this.#totalAmountToPay = this.#calculateTotalAmountToPay(ticketTypeRequests);
      const paymentResult = await this.#makePayment(accountId);

      // Reserve seats if payment succeeds
      return paymentResult ? this.#finalizeReservation(accountId) : this.#handlePaymentFailure();

    } catch (error) {
      throw error;
    }
  }

  // Private method to validate account ID
  #validateAccountId(accountId) {
    if (!Number.isInteger(accountId) || accountId < TicketService.#leastId) {
      throw new InvalidPurchaseException(`Invalid accountId. It must be a positive integer greater than ${TicketService.#leastId}.`, 400, 'PURCHASE_NOT_ALLOWED');
    }
  }

  #calculateTotalTickets(ticketTypeRequests) {
    return ticketTypeRequests.reduce((total, item) => total + item.noOfTicket, 0);
  }
  #getNoOfTickets(ticketTypeRequests) {
    return Object.values(ticketTypes);
  }
  #validateTotalTickets(totalTickets) {
    if (totalTickets > TicketService.#maxNumberOfTicket) {
      throw new InvalidPurchaseException(`Cannot request more than ${TicketService.#maxNumberOfTicket} tickets.`, 400, 'PURCHASE_NOT_ALLOWED');
    }
  }

  #validateTicketTypes(ticketTypeRequests) {
    let containsDependentTicket = false; // Flag for ticket with cannotBeAlone = true
    let containsIndependentTicket = false; // Flag for ticket with cannotBeAlone = false
    ticketTypeRequests.forEach(ticket => {
      const ticketDetails = ticketTypes.find(t => t.slug === ticket.slug);
      if (!ticketDetails) {
        throw new InvalidPurchaseException(`Invalid ticket type: ${ticket.slug}`, 400, 'PURCHASE_NOT_ALLOWED');
      }

      // ensure noOfTicket is greater than 0
      ticketTypeRequests.forEach(ticketRequest => {
        if (ticketRequest.noOfTicket <= 0) {
          throw new InvalidPurchaseException(`noOfTicket must be greater than 0 for ticket type: ${ticketRequest.slug}`, 400, 'PURCHASE_NOT_ALLOWED');
        }
      });

      // Update flags based on cannotBeAlone attribute
      if (ticketDetails.cannotBeAlone) {
        containsDependentTicket = true;
      } else {
        containsIndependentTicket = true;
      }
    })
    if (containsDependentTicket && !containsIndependentTicket) {
      throw new InvalidPurchaseException('Tickets that cannot be alone (like infants) must be accompanied by an adult ticket.');
    }
  }

  #createReservations(ticketTypeRequests) {
    this.#reservations = ticketTypeRequests.map(request => {
      const { slug, noOfTicket } = request;
      this.#updateSeatCount(slug, noOfTicket);
      return new TicketTypeRequest(slug, noOfTicket);
    });
  }

  // New method to increase the seat count
  #updateSeatCount(slug, noOfTicket) {
    const ticketDetails = ticketTypes.find(t => t.slug === slug);
    if (ticketDetails && ticketDetails.type !== 'Infant') {
      this.#seats += noOfTicket;  // Increase seat count for non-infant tickets
    }
  }

  #calculateTotalAmountToPay() {
    return this.#reservations.reduce((total, item) => total + (item.getNoOfTickets() * item.getPrice()), 0);
  }

  async #makePayment(accountId) {
    if(this.#reservations.length < 1){
      throw new InvalidPurchaseException('No reservations found', 400, 'PURCHASE_NOT_ALLOWED');
    }
    let payment = new TicketPaymentService();
    // return payment.makePayment(accountId, this.#totalAmountToPay);
    return true;
  }

  #validateSeatReservation() {
    if(this.#reservations.length < 1 || this.#seats < 1){
      throw new InvalidPurchaseException('No seats to reserve or no reservations found.', 400, 'SEAT_RESERVATION_FAILED');
    }
  }

  async #finalizeReservation(accountId) {
    this.#validateSeatReservation();
    return this.#reserveSeats(accountId);
  }

  async #reserveSeats(accountId) {
    let seatReservation = new SeatReservationService();
    // return seatReservation.makePayment(accountId, this.#seats);
    return {
      message: 'Purchase successful',
      status: true,
      reservedSeats: this.#seats,
      totalAmount: this.#totalAmountToPay / 100
    };
  }

  #handlePaymentFailure() {
    return {
      message: 'Payment failed',
      status: false,
    };
  }

}
