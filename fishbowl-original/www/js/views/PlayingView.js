define([
  'jquery',
  'underscore',
  'hbs!templates/playing'
], function ($, _, template) {
  var PlayingView = Backbone.View.extend({
    el : $('#page'),
    events : {
      'click #ready' : 'startPlaying',
      'click #score' : 'scoreWord',
      'click #skip' : 'skipWord',
      'click #continue' : 'continue'
    },
    initialize : function () {
      // Maybe add a rules model here
    },
    render : function (data) {
      // document.getElementsByTagName('header')[0].classList.toggle('closed');
      this.$el.html(template(data));
      this.delegateEvents();
    }
  });
  return PlayingView;
});
