define([
  'underscore',
  'backbone'
], function (_, Backbone) {
   var BaseModel = Backbone.Model.extend({
    toJSON : function () {
      var self = this;
      var json = {};
      _.each(Object.keys(this.attributes), function (keyname){
        json[keyname] = self.get(keyname);
      });
      return json;
    }
  });

  return BaseModel;
});
