define(
	[
		'jquery',
		'app/events',
		'app/camera',
		'app/images',
		'app/componentmanager',
	],
	function($, Events, Camera, Images, ComponentManager)
	{

		const canvas = document.getElementById('canvas');
		const ctx = canvas.getContext('2d');

		let _fpscounter = 0;

		class Renderer {

			constructor(){

				this.vx = 0; //View X position
				this.vy = 0; //View Y position
				this.vz = 1; //Zoom level

				this.vxs = 0; //View X position (scaled with zoom)
				this.vys = 0; //View Y position (scaled with zoom)

				this.backTileSize = 96; //Background tile size
				this.backTileSizeScaled = 96; //Background tile width (scaled with zoom)

				this.lastFrameTime = 0;

				this.zoomTarget = 2; //The Zoom Target is where the zoomLevel always tries to move towards. Zoom Levels go from 1 = 50%, 2 = 100%, 3 = 150% ... there is no upper limit.
				this.zoomLevel = 2; //The actual current zoom level (not necessarily what the user requested). Could be interpolating between zoomTarget.

				this.width = canvas.width;
				this.height = canvas.height;
				this.fps = 0;


				this.render = this.render.bind(this);
				setInterval(this.displayFps.bind(this), 1000);


				let self = this;

				Events.on(Events.EVENT_RESIZE, function(cam){
					self.onResize();
				});

				Events.on(Events.EVENT_MOUSEMOVE, function(cam, deltaX, deltaY){

					if (cam.isMouseDown)
					{
						if (cam.mouseButtonDown == 2)
						{
							self.addViewDelta(deltaX, deltaY);
						}
					}
				});

				Events.on(Events.EVENT_ZOOM, function(cam, zoomDelta){
					self.addZoomDelta(-zoomDelta * 0.02);
				});

			}

			start()
			{
				//backTileSize is now a predefined constant, doesnt have to be taken from the image's width.
				//this.backTileSize = Images.backtile.naturalWidth;

				if (this.width == 0) this.onResize();

				window.requestAnimationFrame(this.render);
			}

			onResize() {
				canvas.width = Camera.canvasWidth;
				canvas.height = Camera.canvasHeight;
				this.width = canvas.width;
				this.height = canvas.height;

				ctx.fillStyle = "#FFFFFF";
				ctx.strokeStyle = "#FFFFFF";
				ctx.globalAlpha = 1;
				console.log("Renderer: " + this.width + "x" + this.height);
			}

			addZoomDelta(dz)
			{
				this.zoomTarget += dz;
				if (this.zoomTarget <= 1) this.zoomTarget = 1;
			}

			addViewDelta(dx, dy)
			{
				this.vx += -dx * (1 / this.vz);
				this.vy += -dy * (1 / this.vz);
			}

			render(time) {
				let t = Math.min(2.5, (time - this.lastFrameTime) / 16); //Get the timescale between this frame and an ideal 60fps (16ms per frame). t = 1 => we running at 60fps, t = 0.5 => running at 120fps. etc.

				//Is there a zoom to perform?
				//Split this if statement into a variable and an inline expression because we only need 1 variable to tell which direct we're zooming.
				let zoomingIn = this.zoomLevel < this.zoomTarget-0.001;
				if (zoomingIn || this.zoomLevel > this.zoomTarget + 0.001)
				{
					this.zoomLevel += (this.zoomTarget - this.zoomLevel)*0.5*t;

					//Prevent overshooting the mark when FPS is low:
					if (zoomingIn && this.zoomLevel > this.zoomTarget) this.zoomLevel = this.zoomTarget;
					if (!zoomingIn && this.zoomLevel < this.zoomTarget) this.zoomLevel = this.zoomTarget;

					let oldVz = this.vz;
					this.vz = Math.pow(2,(this.zoomLevel))*0.25; //Convert linear zoomLevel value into exponential vz scale value.

					//Adjust the camera position to zoom from the point under the mouse cursor:
					this.vx += (Camera.mx/oldVz - Camera.mx/this.vz);
					this.vy += (Camera.my/oldVz - Camera.my/this.vz);

				}

				let backImg = (this.zoomLevel < 2 ? Images.backtileZO : (this.zoomLevel > 4 ? Images.backtileZI : Images.backtile)); //Simple switching between two images depending on zoom level.


				//Convert background size and camera position into camera space:
				this.backTileSizeScaled = (this.backTileSize * this.vz);
				this.backTileSizeScaled = Math.round(this.backTileSizeScaled*10)/10;

				//Infinite grid resolution:
				while (this.backTileSizeScaled > 768)
				{
					this.backTileSizeScaled *= 0.5;
				}


				this.vxs = this.vx * this.vz;
				this.vys = this.vy * this.vz;

				//Offsets to add to the background tile:
				let boffsetx = (-this.vxs % this.backTileSizeScaled);
				let boffsety = (-this.vys % this.backTileSizeScaled);

				//Draw the grid background:
				for (let x = Math.ceil(this.width / this.backTileSizeScaled); x >= -1; x--)
				{
					for (let y = Math.ceil(this.height / this.backTileSizeScaled); y >= -1; y--)
					{
						ctx.drawImage(backImg, x*this.backTileSizeScaled + boffsetx, y*this.backTileSizeScaled + boffsety, this.backTileSizeScaled, this.backTileSizeScaled);
					}
				}

				ctx.save();

				let componentsRendered = 0;

				let invVz = 1 / this.vz;
				let screenWidthS = this.width*invVz;
				let screenHeightS = this.height*invVz;

				for (let i = ComponentManager.components.length-1; i >= 0; i--)
				{
					let thisComponent = ComponentManager.components[i];

					//Transform component position into camera space:
					let componentX = (-this.vx + thisComponent.globalX) * this.vz;
					let componentY = (-this.vy + thisComponent.globalY) * this.vz;
					let componentW = thisComponent.globalWidth * this.vz;
					let componentH = thisComponent.globalHeight * this.vz;
					let componentScale = thisComponent.globalScale * this.vz;
					let componentAlpha = 1;

					//Check if the component is inside the view. Otherwise dont bother rendering it.
						if (componentX >= -componentW && componentX <= this.width)
							if (componentY >= -componentH && componentY <= this.height)
							{
								if (thisComponent.parent != null && componentScale < 0.5)
								{
									componentAlpha = (componentScale-0.3) / 0.2;
								}
								if (componentAlpha > 0)
								{
									ctx.setTransform(componentScale, 0, 0, componentScale, componentX, componentY);
									//thisComponent.name = componentScale.toFixed(2);
									thisComponent.render(ctx, componentAlpha);

									componentsRendered++;
								}
						}
				}

				ctx.restore();


				//Display FPS:
				ctx.fillText(this.fps+" FPS. View X:"+this.vx.toFixed(2)+" View Y: "+this.vy.toFixed(2)+" Zoom:" + this.vz.toFixed(2) + " Components Rendered: " + componentsRendered , 10, 10);

				_fpscounter++;
				window.requestAnimationFrame(this.render);

				this.lastFrameTime = time;
			};

			displayFps()
			{

				this.fps = _fpscounter;
				_fpscounter = 0;
			}

		};

		return new Renderer();
	});