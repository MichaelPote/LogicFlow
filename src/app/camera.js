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

			sx: 0, //The position the mouse was in when clicking started.
			sy: 0,

			mx: 0, //The current position of the mouse.
			my: 0,

			canvasWidth: 0, //Width and height of the canvas.
			canvasHeight: 0,

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
			Camera.mx = Camera.sx;
			Camera.my = Camera.sy;

			//console.log("Canvas mouse down", Camera);

			Events.trigger(Events.EVENT_MOUSEDOWN, Camera);

		});

		$canvas.on('mousemove', function(e){
			Camera.mx = e.originalEvent.clientX;
			Camera.my = e.originalEvent.clientY;

			Events.trigger(Events.EVENT_MOUSEMOVE, Camera, e.originalEvent.movementX, e.originalEvent.movementY);
		});

		$canvas.on('mouseup', function(e){
			e.preventDefault();

			if (Camera.isMouseDown)
			{
				Camera.isMouseDown = false;
				Camera.isDragging = false;

				Events.trigger(Events.EVENT_MOUSEUP, Camera);
			}
		});

		$canvas.on('mouseleave', function(e){
			if (Camera.isMouseDown)
			{
				Camera.isMouseDown = false;
				Camera.isDragging = false;
				Events.trigger(Events.EVENT_MOUSEUP, Camera);
			}

		});

		$canvas.on('wheel', function(e){
			e.preventDefault();
			Events.trigger(Events.EVENT_ZOOM, Camera, e.originalEvent.deltaY);

		});

		const _resizeFunc = function(){
			Camera.canvasWidth = $canvas.width();
			Camera.canvasHeight = $canvas.height();

			Events.trigger(Events.EVENT_RESIZE, Camera, Camera.canvasWidth, Camera.canvasHeight);
		};

		$(window).resize(_.debounce(_resizeFunc, 100));

		$(document).ready(function(){
			_resizeFunc();
		});

		return Camera;
});