export default (store) => {
  store.on('@init', () => ({ ticketCategory: {} }));

  store.on('ticketCategory/add', (state, ticketCategory) => ({ ticketCategory }));
};
