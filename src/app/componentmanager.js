define(
	[
		'jquery',
		'app/events',
	],
function($, Events)
{

	const ComponentManager = {

		components: [],
		wires: [],

		addComponent: function(comp){

			this.components.push(comp);

		},

		removeComponent: function(comp){

		},

	};


	return ComponentManager;
});