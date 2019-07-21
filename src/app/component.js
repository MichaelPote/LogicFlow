define(
	[
		'jquery',
		'app/events',
	],
function($, Events)
{

	class Component
	{
		constructor()
		{

			this.pins = [];
			this.width = 10;
			this.height = 10;
			this.type = "";
			this.name = "";

			this.onRender = this.onRender.bind(this);
		}

		loadFromJSON(json)
		{

		}

		onRender(ctx)
		{

		}

	}

	return Component;

});