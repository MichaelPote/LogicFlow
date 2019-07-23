define(
	[
		'jquery',
		'app/events',
		'app/images',
	],
function($, Events, Images)
{

	class Element
	{
		constructor(x, y)
		{

			this.type = "";
			this.name = "";

			this.render = this.render.bind(this);
		}

		render(ctx, alpha, subelementAlpha)
		{

			/** @var CanvasRenderingContext2D ctx */

			ctx.beginPath();
			ctx.strokeOpacity = alpha;
			ctx.arc(0,0, 10, 0, Math.PI*2);
			ctx.stroke();
			//ctx.drawImage(Images.backtileZO, 0, 0, this.width, this.height);
		}

	}

	return Element;

});