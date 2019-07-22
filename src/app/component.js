define(
	[
		'jquery',
		'app/events',
		'app/images',
	],
function($, Events, Images)
{

	class Component
	{
		constructor(x, y)
		{

			this.x = x; //Postion in the world
			this.y = y;
			this.width = 10; //Width and height of this component.
			this.height = 10;

			this.type = "";
			this.name = "";

			this.render = this.render.bind(this);
		}

		render(ctx)
		{
			/** @var CanvasRenderingContext2D ctx */
			//ctx.strokeStyle = "#FFF";
			//ctx.strokeWidth = 2;

			ctx.strokeRect(0, 0, this.width, this.height);
			//ctx.drawImage(Images.backtileZO, 0, 0, this.width, this.height);

		}

	}

	return Component;

});