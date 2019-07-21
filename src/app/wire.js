define(
	[
		'jquery',
		'app/events',
	],
function($, Events)
{

	class Wire
	{
		constructor()
		{
			this.pinA = null;
			this.pinB = null;

			this.onRender = this.onRender.bind(this);
		}

		onRender(ctx)
		{

		}

	}

	return Component;

});