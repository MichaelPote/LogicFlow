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
			this.value = 0;
			this.connections = [];

			this.edges = [];
			this.verticies = [];

			this.render = this.render.bind(this);
			this.update = this.update.bind(this);
		}

		connectTo(pin)
		{
			this.connections.push(pin);
		}

		/**
		 *
		 * @param from - Either a Pin or a Vertex.
		 * @param to - Either a Pin or a Vertex.
		 */
		addEdge(from, to)
		{
			this.edges.push({a: from, b:to});
		}

		addVertex(x,y)
		{
			this.verticies.push({x:x, y:y});
		}

		updateEdges()
		{

		}

		render(ctx, alpha)
		{
			ctx.globalAlpha = alpha;
			ctx.beginPath();
			let lastPoint = null;
			for (let i = this.edges.length-1; i >= 0; i--)
			{
				let edge = this.edges[i];
				if (lastPoint != edge.a)
				{
					ctx.moveTo(edge.a.x, edge.a.y);
				}

				ctx.lineTo(edge.b.x, edge.b.y);
				lastPoint = edge.b;

			}
			ctx.stroke();
		}

		onUpdate()
		{

		}

	}

	return Wire;

});