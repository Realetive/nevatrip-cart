export default (store) => {
  store.on('@init', () => ({ session: null }));

  store.on('session/id', (state, session) => ({ session }));
};
