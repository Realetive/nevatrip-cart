export default (store) => {
  store.on('@init', () => ({ direction: {} }));

  store.on('direction/add', (state, direction) => ({ direction }));
};
