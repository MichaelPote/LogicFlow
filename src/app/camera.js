define(
	['jquery',
	'underscore',
	'backbone',
	'app/events',
	'app/renderer'],
	function($, _, Backbone, Events, Renderer) {

		const $canvas = $('#canvas');

		const Camera = _.extend({
			isMouseDown: false,
			mouseButtonDown: 0,

			isDragging: false,

			sx: 0,
			sy: 0,



		}, Backbone.Events);

		$canvas.on('contextmenu', function(e){
			e.preventDefault();
			return false;
		});

		$canvas.on('mousedown', function(e){

			e.preventDefault();

			Camera.isMouseDown = true;
			Camera.mouseButtonDown = e.originalEvent.button;
			Camera.sx = e.originalEvent.clientX;
			Camera.sy = e.originalEvent.clientY;

			//console.log("Canvas mouse down", Camera);


		});

		$canvas.on('mousemove', function(e){
			if (Camera.isMouseDown)
			{
				if (Camera.mouseButtonDown == 2)
				{
						Renderer.addViewDelta(e.originalEvent.movementX, e.originalEvent.movementY);
				}
			}
			Events.trigger(Events.EVENT_MOUSEMOVE, e.originalEvent.clientX, e.originalEvent.clientY);
		});

		$canvas.on('mouseup', function(e){
			e.preventDefault();

			Camera.isMouseDown = false;
			Camera.isDragging = false;
		});

		$canvas.on('mouseleave', function(e){
			Camera.isMouseDown = false;
			Camera.isDragging = false;
		});

		$canvas.on('wheel', function(e){
			e.preventDefault();
			Renderer.addZoomDelta(-e.originalEvent.deltaY * 0.02);
		});

		return Camera;
});