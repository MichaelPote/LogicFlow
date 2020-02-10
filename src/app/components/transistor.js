define(
	[
		'jquery',
		'app/events',
		'app/images',
		'app/component',
		'app/wire',
		'app/pin',
		'app/scalablepath',
	],
	/**
	 *
	 * @param $
	 * @param Events
	 * @param Images
	 * @param {Component} Component
	 * @param {Wire} Wire
	 * @param {Pin} Pin
	 */
	function($, Events, Images, Component, Wire, Pin, ScalablePath)
	{
		const shell = new Path2D("M 0.3 0.2 v 0.6");

		const wireC = new Path2D("M 0.5 0 v 0.2 l -0.2 0.2");
		const wireB = new Path2D("M 0 0.5 h 0.3");
		const wireE = new Path2D("M 0.3 0.6 l 0.2 0.2 v 0.2");

		const arrow = new Path2D("M 0.4 0.7 l 0.03 -0.03 L 0.47 0.77 L 0.37 0.73 Z");

		const renderWithArrow = function(arrow, ctx, alpha) {
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
				ctx.fill(arrow);
		};


		class Transistor extends Component
		{

			constructor(x, y, size, parent)
			{

				let hgt = size;
				let wid = size;

				super(x, y, wid, hgt, 1, 1, parent);

				this.pins = [
					new Pin(this, 0*wid, 0.5*hgt, "b"),
					new Pin(this, 0.5*wid, 0*hgt, "c"),
					new Pin(this, 0.5*wid, 1*hgt, "e")
				];

				this.wires = [
					new Wire(ScalablePath.create(wireC, wid, hgt), [this.getPinByName("c")]),
					new Wire(ScalablePath.create(wireB, wid, hgt), [this.getPinByName("b")]),
					new Wire(ScalablePath.create(wireE, wid, hgt), [this.getPinByName("e")]),
				];



				this.wires[2].render = renderWithArrow.bind(this.wires[2], ScalablePath.create(arrow, wid, hgt));

				this.shell = ScalablePath.create(shell, wid, hgt);
			}

			renderShell(ctx, alpha)
			{
				/** @var CanvasRenderingContext2D ctx */
				ctx.globalAlpha = alpha;
				if (name.length > 0) ctx.fillText(this.name, 5, 16);
				//ctx.strokeRect(0, 0, this.width, this.height);

				ctx.stroke(this.shell);
			}
		}

		return Transistor;

});