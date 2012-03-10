// src/modules/user.js
// Module reference argument, assigned at the bottom
(function(User) {

	// ??? does this break soc
	// var app = chat.app;
	// Define a user
	// this.set({ messages: new Message.List() });
	User.Model = Backbone.Model.extend({
		urlRoot: '/users',
		idAttribute: "_id",
		initialize: function() {}
	});

	// Define a user list
	User.List = Backbone.Collection.extend({
		url: '/users',
		model: User.Model 
	});
	User.Quickview = Backbone.View.extend({
		initialize: function() {
			_.bindAll(this, "render");
			this.model.bind("change", this.render)
		},
		render: function() {
			var colorType = this.model.attributes.phase === 'black' ? 'dark' : 'light'
			  , template = _.template( $('#user_template').html(), {'data': this.model.attributes, colorClass: colorType});
			this.$el.html( template );
			return this;
		},
		events: {
			'click button[data-role="increase-day"]': 'increaseDay',
			'click button[data-role="remove-user"]': 'removeUser'
		},
		increaseDay: function() {
			var day = this.model.attributes.day
			if ( !day || typeof day != 'number' ) {
				day = 0;
			}
			day = day +1;
			this.model.attributes.day = day;
			this.model.save();
		},
		removeUser: function() {
			if ( confirm('Really remove this user?') ) {
				this.model.destroy({
					sucess: function(model, response) {
						console.log('success');
						console.log(model);
						console.log(response);
					},
					error: function(response) {
						console.log('error');
						console.log(response);	
					}
				});
			}
		}
	});
	User.Listview = Backbone.View.extend({
		initialize: function() {
			_.bindAll(this, "render");
			this.collection.bind("all", this.render);
		},
		render: function() {
			this.$el.empty();
			var els = []
			  , module = ccd.module('user');
			this.collection.each(function(item) {
				var view = new module.Quickview({model: item});
				els.push(view.render().el);
			});
			this.$el.append(els);
			return this;
		}
	});
	
	User.Joinform = Backbone.View.extend({
		events: {
			'click #join_form_join':	'submit_join',
			'click #join_form_cancel':	'cancel_join'
		},
		render: function() {
			var dialog = this.template({data:{}});
			this. myel = $(dialog).dialog({
				autoOpen: false,
				height:480,
				width: 640,
				title: 'Join CCD',
				modal: true
			});
			
			this.delegateEvents(this.events);
			return this;
		},
		initialize: function() {
			_.bindAll(this, 'render');
			this.template = _.template($("#join_form_container").html());
			this.render().el;
		},
		show: function() {
			$(this.myel).dialog( 'open' );
		},
		close: function() {
			$(this.myel).dialog( 'close' );
		},
		submit_join: function() {
			var data = {
				name: $('#join_form_name').val(),
				phase: 'black',
				day: 0
			}
			this.collection.create( data );
			$(this.myel).dialog( 'close' );
		},
		cancel_join: function() {
			$(this.myel).dialog( 'close' );		 
		}
	});


})(ccd.module("user"));
