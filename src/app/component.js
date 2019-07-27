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
		constructor(x, y, wid, hgt, scale, internalScale, parent)
		{
			super(x, y, wid, hgt, scale, internalScale, parent);

			this.children = []; //Elements inside this component.

			this.pins = []; //Array of Pins
			this.wires = []; //Array of Wires

			this.type = "Component";
			this.name = "";

			this.render = this.render.bind(this);
		}

		setParent(parent)
		{
			super.setParent(parent);
			if (parent != null && parent instanceof Component)
			{
				parent.children.push(this);
			}
		}

		/**
		 * Draws the shell/shape of the component (not it's children or pins or wires.)
		 *
		 * @param ctx
		 * @param alpha
		 */
		renderShell(ctx, alpha)
		{
			/** @var CanvasRenderingContext2D ctx */
			ctx.globalAlpha = alpha;
			ctx.fillText(this.name, 5, 16);
			ctx.strokeRect(0, 0, this.width, this.height);
		}

		/**
		 * Renders the component's shell, pins and wires.
		 * NOTE: All drawing commands are done with the top left corner of the component being coordinates 0,0.
		 *
		 * @param ctx - CanvasRenderingContext2D
		 * @param alpha - 0..1 - Fades the component itself and children (if they are being drawn)
		 */
		render(ctx, alpha)
		{
			/** @var CanvasRenderingContext2D ctx */

			for (let i = this.wires.length-1; i >= 0; i--)
			{
				this.wires[i].render(ctx, alpha);
			}
			for (let i = this.pins.length-1; i >= 0; i--)
			{
				this.pins[i].render(ctx, alpha);
			}

			this.renderShell(ctx, alpha);


		}

	}

	return Component;

});