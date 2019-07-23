define(
	[
		'jquery',
		'app/events',
		'app/images',
		'app/element',
	],
function($, Events, Images, Element)
{

	class Component extends Element
	{
		constructor(x, y, wid, hgt)
		{
			super(x, y);

			this.width = wid; //Width and height of this component.
			this.height = hgt;

			this.internalScale = 0.5; //How scaled down the child components are compared to the parent's scale level.

			this.children = []; //Elements inside this component.

			this.pins = []; //Array of pins

			this.type = "";
			this.name = "";

			this.render = this.render.bind(this);
		}

		/**
		 * Draws the shell/shape of the component (not it's children or pins)
		 *
		 * @param ctx
		 * @param alpha
		 */
		renderShell(ctx, alpha)
		{
			/** @var CanvasRenderingContext2D ctx */
			ctx.strokeOpacity = alpha;
			ctx.strokeRect(0, 0, this.width, this.height);
		}

		/**
		 * Renders the component and all it's child elements.
		 * NOTE: All drawing commands are done with the top left corner of the component being coordinates 0,0.
		 *
		 * @param ctx - CanvasRenderingContext2D
		 * @param alpha - 0..1 - Fades the component itself and children (if they are being drawn)
		 * @param childrenAlpha - 0..1 - Fades the children 0 == Dont render any children.
		 */
		render(ctx, alpha, childrenAlpha)
		{
			/** @var CanvasRenderingContext2D ctx */

			this.renderShell(ctx, alpha);

			if (childrenAlpha >= 0.01)
			{
				ctx.save();
				ctx.scale(this.internalScale, this.internalScale);

				for (let i = this.children.length; i >= 0 ;i--)
				{
					this.children[i].render(ctx, childrenAlpha, 0);
				}

				ctx.restore();
			}
		}

	}

	return Component;

});