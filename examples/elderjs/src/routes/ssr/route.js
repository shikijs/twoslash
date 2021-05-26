module.exports = {
  // this is an example of how you might create an SSR experience with Elder.js
  // This is good if you need sessions or have users logging in.
  permalink: '/dynamic/:foo/:bar/',
  all: () => [], // we set this to empty so the default is not placed.
  dynamic: true, // enables this for SSR mode.
};
