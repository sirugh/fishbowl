define([
  'jquery',
  'underscore',
  'models/OptionsModel',
  'hbs!templates/options'
], function ($, _, Model, template) {
  var OptionsView = Backbone.View.extend({
    events : {
      'change select' : 'selectOption'
    },
    initialize : function () {
      this.model = new Model();
    },
    render : function () {
      var options = this.model.toJSON();
      this.$el.html(template(options));

      // this is a terrible hack
      // because i cant figure out how to add the selected value.
      // if hbs {{equals ../selected this}} will ever work, then maybe wont have to do this
      _.each( _.keys(options.options), function (key) {
        var selectValue = options.options[key].selected;
        var selector = '#' + key + ' option[value="' + selectValue + '"]';
        $(selector)
          .attr('selected', 'selected');
      });

      this.delegateEvents();
    },
    selectOption : function (e) {
      var optionName = e.target.name;
      var selection = $(e.target).val();
      this.model.update(optionName, selection);
      this.render();
    }
  });
  return OptionsView;
});
