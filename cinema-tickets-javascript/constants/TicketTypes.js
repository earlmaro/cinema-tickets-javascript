const ticketTypes = Object.freeze([
    { type: 'Adult', slug: 'adult', price: 2500, currency: 'GBP', cannotBeAlone: false },
    { type: 'Child', slug: 'child', price: 1500, currency: 'GBP', cannotBeAlone: false },
    { type: 'Infant', slug: 'infant', price: 0, currency: 'GBP', cannotBeAlone: true },
]);
export default ticketTypes;