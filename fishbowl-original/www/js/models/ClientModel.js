define([
  'jquery',
  'underscore',
  'models/RoomModel',
  '../util/util',
  '../util/audio'
], function ($, _, RoomModel, util, audio) {
  var Client = RoomModel.extend({
    defaults : _.extend({
      started : false,
      activePlayer : null,
      word : null,
      roundWords : [],
      DEBUG : false
    }, RoomModel.prototype.defaults),

    initialize : function () {
      if (this.get('DEBUG')) {
        this.addPlayer('short');
        this.addPlayer('player 1');
        this.addPlayer('another');
        this.addPlayer('longlonglong');
      }
    },
    startRound : function (roundNum) {
      this.set('activePlayer', this.activePlayer);
      this.set('roundWords', this.get('words'));
      this.set('round', roundNum);
      switch(roundNum) {
        case 1:
          this.set('message', 'Round 1 - Taboo');
          this.set('rule', 'Don\'t say the word!');
          break;
        case 2:
          this.set('message', 'Round over, next round: Password');
          this.set('rule', 'Only one word!');
          break;
        case 3:
          this.set('message', 'Round over, next round: Charades');
          this.set('rule', 'Act it out!');
          break;
        case 4:
          this.set('message', 'Round over, next round: Sounds');
          this.set('rule', 'Only use sounds!');
          break;
        default:
          console.log('invalid round');
      }
    },
    skipWord : function () {
      var word = this.get('word');

      // subtract points from team
      RoomModel.prototype.skipWord.apply(this);

      // don't do anything with word, but do return a word that isn't the current one
      var wordsWithout = _(this.get('roundWords')).without(word);
      if(wordsWithout.length !== 0) {
        var newWord = wordsWithout[Math.floor(Math.random() * wordsWithout.length)];
        this.set('word', newWord);
        $('.word').text(newWord);
      }
    },
    scoreWord : function () {
      var word = this.get('word');
      // word scored, so remove from possible words
      this.set( 'roundWords', _(this.get('roundWords')).without(word) );
      // add points to team
      RoomModel.prototype.scoreWord.apply(this);

      var nextWord = this.getNextWord();
      if (nextWord) {
        this.set('word', nextWord);
      } else {
        if (this.get('round') === parseInt(this.get('numRounds'))) {
          this.gameOver();
        } else {
          this.roundOver();
        }
      }
    },

    startTurn : function () {
      this.set('playerReady', true);

      var word = this.getNextWord();
      this.set('word', word);
      this.startTimer();
    },

    getNextWord : function () {
      var index = Math.floor(Math.random() * this.get('roundWords').length);
      var word = this.get('roundWords')[index];
      if(word) {
        $('.word').text(word);
      }
      return word;
    },
    gameOver : function () {
      this.endTurn();
      this.set('started', false);

      this.set('message', 'Game Over');
      this.set('rule', null);

      this.trigger('gameover');
    },
    roundOver : function () {
      this.endTurn();

      this.startRound(this.get('round') + 1);

      this.trigger('stats');
    },

    nextPlayer : function () {
      this.set('activePlayer', this.getNextPlayer());
    },

    // kill timer, flash background, vibrate, and
    endTurn : function () {
      clearInterval(this.timerObject);
      audio.alert(750);
      this.set('playerReady', false);
      this.set('word', null);
      this.set('activePlayer', null);
    },

    startTimer : function () {
      var self = this;
      var timeLeft = this.get('timePerPlayer');

      this.timerObject = setInterval(function () {
         //TODO perform this lookup elsewhere?
        var $timer = $('.timer');

        timeLeft = timeLeft - 1;
        $timer.text(timeLeft);
        // modify color
        if (timeLeft <= 10) {
          //TODO gradient black -> red as time
          //http://www.color-hex.com/color/ff0000
          $('.timer').css('color', '#ff0000');
        }
        if (timeLeft === 0 ) {
          self.endTurn();
          self.set('message', 'Time\'s up!');
          self.trigger('stats');
        }
      }, 1000);
    }
  });

  return Client;
});

