
export default (store) => {
  store.on('@init', () => ({ order: {} }));

  store.on('order/add', (state, order) => ({ order }));

  store.on('order/update', (state, order) => ({ order }));
};
