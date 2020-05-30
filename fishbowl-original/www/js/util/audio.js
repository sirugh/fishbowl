define([], function () {
  return {
    alert : function (time) {

      // HTML5 Audio
      if(window.navigator && window.navigator.vibrate) {
        // $('#beep')[0].play();
        window.navigator.vibrate(time);
      }
      // else if (window.navigator && window.navigator.notification) {
      //   //TODO use nativeAudio and play a beep.
      //   //.beep uses the default notification sound which is bad
      //   // window.navigator.notification.beep(1);
      //   window.navigator.notification.vibrate(time);
      // }
    }
  };
});
