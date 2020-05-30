define([
  'underscore',
  'models/BaseModel'
], function (_, BaseModel) {
   var Options = BaseModel.extend({
    defaults : {
      options : {
        wordsPerPlayer : {
          name : 'Words Per Player',
          selected : 3,
          options : [2, 3, 4]
        },
        secondsPerPlayer : {
          name : 'Seconds Per Player',
          selected : 30,
          options : [20, 30, 40]
        },
        rounds : {
          name : 'Rounds',
          selected : 3,
          options : [3, 4]
        },
        difficulty : {
          name : 'Difficulty',
          selected : 'Medium',
          options : ['Easy', 'Medium', 'Hard']
        }
      }
    },
    update : function (optionName, value) {
      var options = this.get('options');
      options[optionName].selected = value;
    }
  });

  return Options;
});
