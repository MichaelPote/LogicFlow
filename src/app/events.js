define(
	['jquery',
	'underscore',
	'backbone'],
	function($, _, Backbone) {

		let Events = _.extend({

			EVENT_LOADED: "loaded",
			EVENT_MOUSEMOVE: 'onmousemove',
			EVENT_MOUSEDOWN: 'onmousedown',
			EVENT_MOUSEUP: 'onmouseup',
			EVENT_ZOOM: 'onzoom',

		},
		Backbone.Events);


		return Events;
});