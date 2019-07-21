
//Set up config
requirejs.config({
	baseUrl: 'src/',
	paths: {
		jquery: 'jquery-3.4.1.min',
		backbone: 'backbone-min',
		underscore: 'underscore-min',
	},
	shims:{
		'backbone': {
			//These script dependencies should be loaded before loading
			//backbone.js
			deps: ['underscore', 'jquery'],
			//Once loaded, use the global 'Backbone' as the
			//module value.
			exports: 'Backbone'
		},
		'underscore': {
			exports: '_'
		},
	}
});


//Execute the entry point (src/app/app.js)
requirejs(['app/app']);


