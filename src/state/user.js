export default (store) => {
  store.on('@init', () => ({
    user: {
      fullName: '',
      email:    '',
      phone:    '',
    },
  }));

  store.on('user/update', ({ user }, newUserData) => {
    user = user[newUserData];
  });
};
