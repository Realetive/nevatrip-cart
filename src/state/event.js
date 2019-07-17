export default (store) => {
  store.on('@init', () => ({ event: {} }));

  store.on('event/add', ({ event }, newEvent) => {
    return { event: { ...event, ...newEvent } };
  });
};
