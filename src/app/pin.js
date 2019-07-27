define(
	[
		'jquery',
		'app/events',
	],
function($, Events)
{

	class Pin
	{
		constructor(x, y, name)
		{
			this.x = x;
			this.y = y;
			this.name = name;
			this.hasName = (this.name && this.name.length > 0);
			this.value = 0;
			this.size = 5;

			this.connections = [];

			this.render = this.render.bind(this);
			this.update = this.update.bind(this);
		}

		connectTo(wire)
		{
			this.connections.push(wire);
		}

		disconnect(wire)
		{
			let found = -1;
			for (let i = this.connections.length-1; i >= 0; i--)
			{
				if (this.connections[i] == wire)
				{
					found = i;
					break;
				}
			}

			if (found > -1)
			{
				this.connections = this.connections.splice(found, 1);
			}
		}


		update()
		{
			this.value = 0;
			for (let i = this.connections.length-1; i >= 0; i--)
			{
				this.value = this.value || this.connections[i].value;
			}
			//return this.value;
		}


		render(ctx, alpha)
		{
			if (this.hasName)
			{
				ctx.fillText(this.name, this.x, this.y - 10);
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