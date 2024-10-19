const TicketTypes = Object.freeze([
    { type: 'Adult', slug: 'adult', price: 10, cannotBeAlone: false },
    { type: 'Child', slug: 'child', price: 5, cannotBeAlone: false },
    { type: 'Infant', slug: 'infant', price: 0, cannotBeAlone: true },
]);
export default TicketTypes;