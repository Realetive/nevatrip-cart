export default (store) => {
  store.on('@init', () => ({ ticket: {} }));

  store.on('ticket/add', (state, ticket) => ({ ticket }));
};
