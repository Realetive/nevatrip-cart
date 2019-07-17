
export default (store) => {
  store.on('@init', () => ({ product: null }));

  store.on('product/add', (state, product) => ({ product }));
};
