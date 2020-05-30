define([
  'jquery',
  'underscore',
  'hbs!templates/rules',
  'materialize'
], function ($, _, template) {
  var RulesView = Backbone.View.extend({
    el : $('#page'),
    events : {
      'click #back' : 'navigateToMain'
    },
    initialize : function () {
      // Maybe add a rules model here?
    },
    render : function () {
      document.getElementsByTagName('header')[0].classList.toggle('closed');
      this.$el.html(template());
      this.delegateEvents();
    },
    navigateToMain : function (e) {
      e.preventDefault();
      Backbone.history.navigate('', true);
    }
  });
  return RulesView;
});
