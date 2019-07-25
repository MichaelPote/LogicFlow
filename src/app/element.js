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
		constructor(x, y, wid, hgt, scale, internalScale, parent)
		{

			this.x = x;
			this.y = y;
			this.width = wid; //Width and height of this element.
			this.height = hgt;
			this.scale = scale;
			this.internalScale = internalScale;

			this.globalX = 0;
			this.globalY = 0;
			this.globalWidth = 0;
			this.globalHeight = 0;
			this.globalScale = 1;
			this.globalInternalScale = 1;

			this.type = "";
			this.name = "";

			this.setParent(parent);

			this.render = this.render.bind(this);
		}

		setParent(parent)
		{
			this.parent = parent;

			this.updateGlobalPosition();
		}

		updateGlobalPosition()
		{
			if (this.parent)
			{
				this.globalScale = this.parent.globalInternalScale * this.scale;
				this.globalX = this.parent.globalX + this.x * this.globalScale;
				this.globalY = this.parent.globalY + this.y * this.globalScale;
				this.globalWidth = this.width * this.globalScale;
				this.globalHeight = this.height * this.globalScale;
				this.globalInternalScale = this.internalScale * this.globalScale;
			}
			else
			{
				this.globalScale = this.scale;
				this.globalX = this.x * this.globalScale;
				this.globalY = this.y * this.globalScale;
				this.globalWidth = this.width * this.globalScale;
				this.globalHeight = this.height * this.globalScale;
				this.globalInternalScale = this.internalScale * this.globalScale;
			}
		}

		render(ctx, alpha)
		{

			/** @var CanvasRenderingContext2D ctx */

			ctx.beginPath();
			ctx.strokeOpacity = alpha;
			//ctx.arc(0,0, Math.min(this.width, this.height) * 0.5, 0, Math.PI*2);
			//ctx.stroke();
			ctx.strokeRect(this.globalX, this.globalY, this.globalWidth, this.globalHeight);
		}

	}

	return Element;

});