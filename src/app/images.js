define(
	[
		'jquery',
		'app/events'
	],
	function($, Events) {


		let imagesLeftToLoad = 0;


		function createImage(src)
		{
			let img = new Image();
			imagesLeftToLoad++;

			console.log("Queued ", src, ". now have ", imagesLeftToLoad, " left to load.");
			img.onload = function(){
				imagesLeftToLoad--;
				console.log("Loading ", src, " DONE ", imagesLeftToLoad, " left to load.");

				if (imagesLeftToLoad <= 0)
				{
					Events.trigger(Events.EVENT_LOADED);
				}
			};

			img.src = src;

			return img;
		}



		const Images = {
			backtile: createImage("assets/img/backtile.png"),
			backtileZO: createImage("assets/img/backtile-zoomedout.png"),
			backtileZI: createImage("assets/img/backtile-zoomedin.png"),
		};

		return Images;
});