define([], function () {
  return {
    generateRandomString : function (len) {
      var length = len || 5;
      return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, length).toUpperCase();
    }
  };
});
