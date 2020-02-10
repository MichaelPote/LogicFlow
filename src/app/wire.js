define(
	[
		'jquery',
		'app/events',
		'app/scalablepath',
	],
function($, Events, ScalablePath)
{

	class Wire
	{
		constructor(owner, svgPath, connectedPins)
		{
			this.value = 0;
			this.owner = owner;
			this.connections = (connectedPins ? connectedPins : []);

			if (svgPath instanceof Path2D)
			{
				this.path = svgPath;
			}
			else
			{
				this.path = new Path2D(svgPath);
			}

			this.render = this.render.bind(this);
		}

		connectTo(pin)
		{
			this.connections.push(pin);
		}

		render(ctx, alpha)
		{
			ctx.globalAlpha = alpha;
			if (this.value)
			{
				ctx.strokeStyle = '#e63a24';
			}
			else
			{
				ctx.strokeStyle = '#FFFFFF';
			}
			ctx.stroke(this.path);
		}

		onUpdate()
		{

		}

	}

	return Wire;

});