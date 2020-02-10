define(
	[
		'jquery',
		'app/events',
	],
function($, Events)
{

	const ComponentManager = {

		components: [],

		topLevel: [],

		/**
		 *
		 * @param Component comp
		 * @returns {{parent}}
		 */
		addComponent: function(comp){

			this.components.push(comp);

			if (!comp.parent)
			{
				this.topLevel.push(comp);
			}

			return comp;
		},

		removeComponent: function(comp){

		},

	};


	return ComponentManager;
});