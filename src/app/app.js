define(
	[
		'jquery',
		'app/events',
		'app/renderer',
		'app/camera',
		'app/component',
		'app/componentmanager',
	],
function($, Events, Renderer, Camera, Component, ComponentManager)
{

	Events.on(Events.EVENT_LOADED, function(){

		for (let i = 0; i <= 10000; i++)
		{
			ComponentManager.addComponent(new Component(Math.random()*3000 - 1500, Math.random()*3000 - 1500));
		}

		Renderer.start();
	});

});