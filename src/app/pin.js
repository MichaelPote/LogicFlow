define(
	[
		'jquery',
		'app/events',
	],
function($, Events)
{

	class Pin
	{
		constructor(component, x, y, name)
		{
			this.parent = component;
			this.x = x;
			this.y = y;
			this.name = name;
			this.hasName = (this.name && this.name.length > 0);
			this.value = 0;
			this.size = 2;

			this.internalX = (1/this.parent.internalScale) * x;
			this.internalY = (1/this.parent.internalScale) * y;

			this.render = this.render.bind(this);
		}

		render(ctx, alpha)
		{
			if (this.hasName)
			{
				ctx.fillText(this.name, this.x + 5, this.y - 5);
			}

			if (this.size > 0)
			{
				ctx.globalAlpha = alpha;

				ctx.beginPath();
				ctx.arc(this.x, this.y, this.size, 0, 6.2831853); //Math.PI*2
				ctx.fill();
			}
		}

	}

	return Pin;

});