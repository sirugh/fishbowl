define([
  'jquery',
  'underscore',
  'hbs!templates/client',
  'hbs!templates/stats',
  'models/ClientModel',
  'views/OptionsView',
  'views/PlayingView',
  'materialize'
], function ($, _, clientView, statView, Model, OptionsView, PlayingView) {
  var ClientView = Backbone.View.extend({
    el : $('#page'),
    events : {
      'click #add-player-button' : 'addPlayer',
      'keypress #name-form-field' : 'keyPress',
      'click #start-button' : 'startGame',
      'click #go-button' : 'startTurn',
      'click #skip' : 'skipWord',
      'click #score' : 'scoreWord',
      'click #continue' : 'nextPlayer',
      'click #shuffle' : 'shuffleTeams',
      'click .remove-player' : 'removePlayer'
    },
    initialize : function () {
      var self = this;
      this.model = new Model();
      this.listenTo(this.model, 'rerender', this.render);
      this.listenTo(this.model, 'stats', this.renderStats);
      this.listenTo(this.model, 'time over', this.renderStats);
      this.listenTo(this.model, 'gameover', this.renderStats);
      this.listenTo(this.model, 'round over', this.renderStats);
      this.listenTo(this.model, 'error', this.renderError);

      this.optionsView = new OptionsView();
      this.playingView = new PlayingView();

      $('#rules').on('click', function () {
        self.renderRules();
      });
    },
    renderRules : function () {
      Backbone.history.navigate('rules', true);
    },
    renderStats : function () {
      var template = statView;
      this.$el.html(template(this.model.toJSON()));
      this.attachListeners();
    },
    renderError : function (errorMsg) {
      var template = clientView;
      this.$el.html(
        template( _.extend(this.model.toJSON(), {errorMessage : errorMsg} )
      ));
      this.renderOptions();
      this.attachListeners();
    },
    render : function () {
      var template = clientView;
      this.$el.html(template(this.model.toJSON()));
      this.renderOptions();
      if(this.model.get('started')){
        this.renderPlaying();
      }
      this.attachListeners();
      var $header = $('header');
      if ($header.css('max-height') === '0px' && this.model.get('started') === false) {
        document.getElementsByTagName('header')[0].classList.toggle('closed');
      }
    },
    renderPlaying : function () {
      this.playingView.$el = this.$('.playing-container');
      this.playingView.render(this.model.toJSON());
    },
    renderOptions : function () {
      this.optionsView.$el = this.$('.options-container');
      this.optionsView.render();
    },
    attachListeners : function () {
      // anything we want to vibrate on press goes in here
      // if (window.navigator && window.navigator.vibrate) {
      //   _.each(['.remove-player'], function (selector) {
      //     $(selector).on('touchstart', function () {
      //       window.navigator.vibrate(20);
      //     })
      //   });
      // }
    },
    keyPress : function (e) {
      var code = e.keyCode || e.which;
      if (code === 13) {
        if(this.addPlayer(e)) {
          this.render();
        }
      }
    },
    addPlayer : function (e) {
      e.preventDefault();

      var $input = $('#name-form-field');
      var name = $input.val();
      //TODO validate/sanitize $input
      if (_.isEmpty(name)){
        this.renderError('Name cannot be empty!');
        $('#name-form-field').addClass('invalid');
        return;
      }
      try {
        this.model.addPlayer(name);
        this.render();
      } catch (error) {
        console.log(error);
      }
      $input.val('');
    },
    removePlayer : function (e) {
      e.preventDefault();
      var id = e.target.dataset.id;
      this.model.removePlayer(id);
      this.render();
    },
    shuffleTeams : function (e) {
      e.preventDefault();
      this.model.shuffleTeams();
      this.render();
    },
    startGame : function (e) {
      e.preventDefault();
      try {
        this.model.startGame(this.optionsView.model.toJSON().options);
        this.render();
        document.getElementsByTagName('header')[0].classList.toggle('closed');
        $('.player-ready').fadeToggle();
      } catch (err) {
        this.renderError('2 players minimum!');
      }
    },
    startTurn : function (e) {
      e.preventDefault();
      this.model.startTurn();
      this.render();
      $('.word').fadeIn('fast');
    },
    scoreWord : function (e) {
      e.preventDefault();
      $('.word').css('display', 'none');
      this.model.scoreWord();
      $('.word').fadeIn('fast');
    },
    skipWord : function (e) {
      e.preventDefault();
      $('.word').css('display', 'none');
      this.model.skipWord();
      $('.word').fadeIn('fast');
    },
    nextPlayer : function (e) {
      e.preventDefault();
      this.model.nextPlayer();
      this.render();
      $('.player-ready').fadeIn();
    }
  });

  return ClientView;
});
