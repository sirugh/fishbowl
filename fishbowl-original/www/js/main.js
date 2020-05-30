require.config({
  paths : {
    jquery : 'lib/jquery/jquery',
    underscore : 'lib/underscore/underscore-min',
    backbone : 'lib/backbone/backbone-min',
    text : 'lib/text',
    hbs : 'lib/require-handlebars-plugin/hbs',
    materialize : 'lib/materialize/materialize',
    hammerjs : 'lib/hammer.min',
    templates : '../templates',
    models : 'models',
    views : 'views'
  },
  shim : {
    'materialize' : {
      deps : ['jquery', 'hbs'] //materialize hack
    }
  }
});
require([
  'app'
], function (App){
  App.initialize();
});
