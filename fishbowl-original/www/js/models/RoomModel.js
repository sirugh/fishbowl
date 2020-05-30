define([
  'underscore',
  '../util/util',
  '../util/words',
  'models/BaseModel'
], function (_, util, words, BaseModel) {
  var Room = BaseModel.extend({
    id : util.generateRandomString(10),
    defaults : {
      round : 0,
      timePerPlayer : 30,
      wordsPerPlayer : 3,
      activeTeamIndex : 0, // 0 based (0 == team 1)
      words : [],
      teams : [
        {
          name : 'Team 1',
          score : 0,
          players : [],
          lastActivePlayerIndex : 0
        },
        {
          name : 'Team 2',
          score : 0,
          players : [],
          lastActivePlayerIndex : 0
        }
      ]
    },
    scoreWord : function () {
      var activeTeam = this.get('teams')[this.get('activeTeamIndex')];
      activeTeam.score += 1;
      activeTeam.players[activeTeam.lastActivePlayerIndex].score += 1;
    },
    skipWord : function () {
      var activeTeam = this.get('teams')[this.get('activeTeamIndex')];
      activeTeam.score -= 1;
      activeTeam.players[activeTeam.lastActivePlayerIndex].score -= 1;
    },
    setOptions : function (options) {
      this.set('timePerPlayer', options.secondsPerPlayer.selected);
      this.set('wordsPerPlayer', options.wordsPerPlayer.selected);
      this.set('difficulty', options.difficulty.selected);
      this.set('numRounds', options.rounds.selected);
    },
    startGame : function (options) {
      var teams = this.get('teams');
      var numPlayers = teams[0].players.length + teams[1].players.length;
      if(numPlayers < 2) {
        this.trigger('error', '2 players minimum.');
        throw new Error('2 players minimum');
      }
      this.setOptions(options);
      console.log('ROOM[%s] - starting game.  wpp - %s, tpp - %s, rounds - %s, diff - %s, ',
        this.id, this.get('wordsPerPlayer'), this.get('timePerPlayer'), this.get('numRounds'), this.get('difficulty'));

      var numWords = this.get('wordsPerPlayer') * numPlayers;
      var difficulty = this.get('difficulty');
      this.set( 'words', words.getWords( numWords, difficulty ) );

      _.each(this.get('teams'), function (team) {
        team.score = 0;
        team.lastActivePlayerIndex = 0;
        _.each(team.players, function (player) {
          player.score = 0;
        });
      });
      this.set('activeTeamIndex', 0);
      this.set('started', true);
      this.activePlayer = this.get('teams')[0].players[0];
      this.startRound(1);
    },

    /** Shuffle teams using current players */
    shuffleTeams : function () {
      var teams = this.get('teams');
      var players = teams[0].players.concat(teams[1].players);
      this.get('teams')[0].players = [];
      this.get('teams')[1].players = [];

      var placeOnTeam1 = true;
      var self = this;
      _.each(_.shuffle(players), function (player) {
        if (placeOnTeam1) {
          //add to team1
          self.get('teams')[0].players.push(player);
        }
        else {
          //add to team2
          self.get('teams')[1].players.push(player);
        }
        placeOnTeam1 = !placeOnTeam1;
      });

      console.log('ROOM[%s] - teams: %s', this.id, JSON.stringify(this.get('teams')));
      this.trigger('change');
    },

    getNextPlayer : function () {
      var player;
      var teams = this.get('teams');

      // flip team index
      this.set('activeTeamIndex', 1 >> this.get('activeTeamIndex') );

      var team = teams[this.get('activeTeamIndex')];
      if (team.lastActivePlayerIndex === (team.players.length - 1) ) {
        // back to first player
        team.lastActivePlayerIndex = 0;
        player = team.players[team.lastActivePlayerIndex];
      }
      else {
        // next player
        team.lastActivePlayerIndex += 1;
        player = team.players[team.lastActivePlayerIndex];
      }
      console.log('ROOM[%s] - next player: %s', this.id, player.name);
      return player;
    },

    addPlayer : function (name, teamIndex) {
      var player = {
        id : util.generateRandomString(10),
        name : name,
        score : 0
      };
      var team;
      var teams = this.get('teams');
      if (!teamIndex) {
        // no teamindex passed
        // get next team that needs player
        if(teams[0].players.length <= teams[1].players.length) {
          // add player to team 1
          team = teams[0];
        } else {
          // add player to team 2
          team = teams[1];
        }
      } else {
        team = teams[teamIndex];
      }

      var players = team.players;
      if ( _(players).findWhere( { name : player.name }) ) {
        this.trigger('error', 'Player with name ' + player.name + ' already exists on ' + team.name + '.');
        throw new Error('Player already exists');
      } else {
        players.push(player);
      }
    },

    removePlayer : function (id) {
      var teams = this.get('teams');
      var index = _(teams[0].players).findIndex({id : id});
      if (index > -1) {
        teams[0].players.splice(index, 1);
      } else {
        index = _(teams[1].players).findIndex({id : id});
        teams[1].players.splice(index, 1);
      }
    }
  });

  return Room;
});

