const ticketTypes = Object.freeze([
    { type: 'Adult', slug: 'adult', price: 2500, cannotBeAlone: false },
    { type: 'Child', slug: 'child', price: 1500, cannotBeAlone: false },
    { type: 'Infant', slug: 'infant', price: 0, cannotBeAlone: true },
]);
export default ticketTypes;