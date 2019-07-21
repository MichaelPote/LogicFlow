define(
	[
		'jquery',
		'app/events',
		'app/renderer',
		'app/camera',
	],
function($, Events, Renderer, Camera)
{

	Events.on(Events.EVENT_LOADED, function(){
		Renderer.start();
	});

});