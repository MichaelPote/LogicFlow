define(
	[
	],
	function()
	{

		const ScalablePath = {

			getScaleMatrix: function(scaleX, scaleY)
			{
				let matrix;
				if (window.hasOwnProperty('DOMMatrixReadOnly'))
				{
					matrix = new DOMMatrixReadOnly([scaleX, 0, 0, scaleY, 0, 0]);
				}
				else
				{
					matrix = document.createElementNS("http://www.w3.org/2000/svg", "svg").createSVGMatrix();
					matrix.scale(scaleX);
				}

				return matrix;
			},

			create: function(svgPath, scaleX, scaleY)
			{
				if (!(svgPath instanceof Path2D))
				{
					svgPath = new Path2D(svgPath);
				}

				let matrix = ScalablePath.getScaleMatrix(scaleX, scaleY);

				let p = new Path2D();
				p.addPath(svgPath, matrix);

				return p;
			},


		};

		return ScalablePath;

	});