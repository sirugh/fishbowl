define([
  'jquery',
  'backbone',
  'views/ClientView',
  'views/RulesView'
], function ($, Backbone, ClientView, RulesView) {

  var AppRouter = Backbone.Router.extend({
    routes : {
      'rules' : 'rules',
      '*actions' : 'defaultAction'
    }
  });

  var initialize = function () {
    var appRouter = new AppRouter();
    var clientView = new ClientView();

    appRouter.on('route:rules', function () {
      var view = new RulesView();
      view.render();
    });

    appRouter.on('route:defaultAction', function () {
      var view = clientView;
      view.render();
    });
    Backbone.history.start();
  };

  return {
    initialize : initialize
  };
});
