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

		ComponentManager.addComponent(new Component(0,0,1000,1000, 1, 0.8, null));

		for (let i = 0; i <= 100; i++)
		{
			let parentIts = 0;
			let reallyFound = false;
			let x, y, wid, hgt;
			let parent = null;

			while (parentIts < 10 && !reallyFound)
			{

				let parentid = Math.floor(Math.random() * ComponentManager.components.length);
				parent = ComponentManager.components[parentid];

				let found = false;
				let iteration = 0;


				while (!found && iteration < 100)
				{
					x = Math.random() * (parent.width*0.8);
					y = Math.random() * (parent.height*0.8);

					wid = Math.random() * (parent.width-x-100) + 100;
					hgt = Math.random() * (parent.height-y-50) + 50;


						found = true;
						for (let j = 0; j < parent.children.length; j++)
						{
							let c = parent.children[j];

							if ((x + wid >= c.x) && (x <= c.x + c.width))
							{
								if ((y + hgt >= c.y) && (y <= c.y + c.height))
								{
									found = false;
								}
							}
						}
					iteration++;
				}

				reallyFound = true;
				if (iteration >= 100)
				{
					reallyFound = false;
				}
				parentIts++;
			}
			//console.log("Placed component "+i+" after "+parentIts+" different parents");

			ComponentManager.addComponent(new Component(x,y,wid,hgt, 1, 0.5, parent));
		}


/*
		let cparent = new Component(Math.random()*300 - 150, Math.random()*300 - 150, 200, 200, 1, 0.5, null);
		cparent.name = "Parent";
		let cchild1 = new Component(0, 0, 100, 100, 1, 0.5, cparent);
		cchild1.name = "Child A";
		let cchild2 = new Component(200, 200, 100, 100, 1, 0.5, cparent);
		cchild2.name = "Child B";
		let ccchild1 = new Component(0, 0, 100, 100, 1, 0.8, cchild1);
		ccchild1.name = "Child AA";
		let ccchild2 = new Component(100, 100, 100, 100, 1, 0.8, cchild1);
		ccchild2.name = "Child AB";

		ComponentManager.addComponent(cparent);
		ComponentManager.addComponent(cchild1);
		ComponentManager.addComponent(cchild2);
		ComponentManager.addComponent(ccchild1);
		ComponentManager.addComponent(ccchild2);

*/
		Renderer.start();
	});

});