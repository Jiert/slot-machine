var AppView = Backbone.View.extend({

  events: {
    'click' : 'startTheMachine'
  },

  map: ['Coffee', 'Tea', 'Espresso'],

  initialize: function(){
    _(this).bindAll('checkWin');

    // Set up roller views
    // spins is a range of available rotations. We'll pick a random number from this later
    this.firstRoller = new RollerView({
      settings: ['coffeemaker.png', 'teapot.jpg', 'espressomachine.jpg'],
      spins: [5, 10],
      el: '#first'
    });

    this.secondRoller = new RollerView({
      settings: ['coffee-filter.jpg', 'tea-strainer.jpg', 'espresso-tamper.jpg'],
      spins: [10, 15],
      el: '#second'
    });
    
    this.thirdRoller = new RollerView({
      settings: ['coffee-grounds.jpg', 'loose-tea.jpg', 'espresso-beans.jpg'],
      spins: [15, 20],
      el: '#third'
    });

    // Listen for when last roller is done
    this.listenTo(this.thirdRoller, 'finished', this.onFinish);

    // Render Views
    this.firstRoller.render();
    this.secondRoller.render();
    this.thirdRoller.render();
  },

  onFinish: function(){
    this.checkWin();
    this.$el.removeAttr('disabled');
  },

  checkWin: function(){
    // Get a list of unique counts from each view
    var unique = _([this.firstRoller.count, this.secondRoller.count, this.thirdRoller.count]).uniq();

    // If there is only one unique count, we have a winner
    if (unique.length === 1){
      $('.beverage').text(this.map[unique[0]]);
      $('#win-modal').modal();
    }
  },

  startTheMachine: function(){
    this.$el.attr('disabled', 'disabled');

    this.firstRoller.spin(0);
    this.secondRoller.spin(0);
    this.thirdRoller.spin(0);
  },

  render: function(){
    return this;
  }
});

var RollerView = Backbone.View.extend({
  count: 0,
  template: _.template('<div class="spinner-wrapper"><img class="img-responsive center item item-blur" src="img/<%= src %>"/></div>'),

  initialize: function(options){
    _(this).bindAll('removeImage', 'finished');

    this.settings = options.settings;
    this.spins = options.spins;
  },

  increment: function(){
    // Increment count or set to 0
    this.count = ++this.count % 3; 
  },

  spin: function(i){    
    // Get a random value from the spin configurations    
    var random = _.random(this.spins[0], this.spins[1]);

    setTimeout(_(function(){
      this.increment();
      this.moveImage();

      if (i < random){
        this.spin(++i);
      }
      else {
        _(this.finished).delay(150);
      }
    }).bind(this), 100);
  },

  finished: function(){
    this.trigger('finished');
  },

  moveImage: function(){
    this.$img.animate({
      marginTop: 200
    }, 50, 'swing', this.removeImage);
  },

  removeImage: function(){
    this.$img.remove();
    this.render();
  },

  render: function(spin){
    this.$el.html(this.template({
      src: this.settings[this.count]
    }));

    this.$img = this.$('img');

    return this;
  }
});

var app = new AppView({ el: '#pull' }).render()