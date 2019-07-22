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

				this.bw = 0; //Background tile width
				this.bh = 0; //Background tile height

				this.bws = 0; //Background tile width (scaled with zoom)
				this.bhs = 0; //Background tile height (scaled with zoom)

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
				this.bw = Images.backtile.naturalWidth;
				this.bh = Images.backtile.naturalHeight;

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
				let t = (time - this.lastFrameTime) / 16; //Get the timescale between this frame and an ideal 60fps (16ms per frame). t = 1 => we running at 60fps, t = 0.5 => running at 120fps. etc.

				//Is there a zoom to perform?
				if (this.zoomLevel < this.zoomTarget-0.001 || this.zoomLevel > this.zoomTarget + 0.001)
				{
					let zoomDelta = (this.zoomTarget - this.zoomLevel)*0.5*t;

					this.zoomLevel += zoomDelta;

					let oldVz = this.vz;
					this.vz = Math.pow(2,(this.zoomLevel))*0.25; //Convert linear zoomLevel value into exponential vz scale value.

					//Adjust the camera position to zoom from the point under the mouse cursor:
					this.vx += (Camera.mx/oldVz - Camera.mx/this.vz);
					this.vy += (Camera.my/oldVz - Camera.my/this.vz);

				}

				//Convert background size and camera position into camera space:
				this.bws = this.bw * this.vz;
				this.bhs = this.bh * this.vz;
				this.vxs = this.vx * this.vz;
				this.vys = this.vy * this.vz;

				//Offsets to add to the background tile:
				let boffsetx = (-this.vxs % this.bws);
				let boffsety = (-this.vys % this.bhs);

				//Draw the grid background:
				let backImg = (this.zoomLevel < 2 ? Images.backtileZO : Images.backtile); //Simple switching between two images depending on zoom level.
				if (this.bws > 0 && this.bhs > 0) //Make sure that the background size is defined before trying to divide by it.
				{
					for (let x = Math.ceil(this.width / this.bws); x >= -1; x--)
					{
						for (let y = Math.ceil(this.height / this.bhs); y >= -1; y--)
						{
							ctx.drawImage(backImg, x*this.bws + boffsetx, y*this.bhs + boffsety, this.bws, this.bhs);
						}
					}
				}

				ctx.save();
				ctx.beginPath();

				let componentsRendered = 0;

				for (let i = ComponentManager.components.length-1; i >= 0; i--)
				{
					let thisComponent = ComponentManager.components[i];

					//Transform component position into camera space:
					let componentX = (-this.vx + thisComponent.x) * this.vz;
					let componentY = (-this.vy + thisComponent.y) * this.vz;
					let componentW = thisComponent.width * this.vz;
					let componentH = thisComponent.height * this.vz;

					if (componentX >= -componentW && componentX <= this.width+componentW)
						if (componentY >= -componentH && componentY <= this.height+componentH)
						{
							//Check if the component is inside the view. Otherwise dont bother rendering it.
							ctx.setTransform(this.vz, 0, 0, this.vz, componentX, componentY);
							//ctx.fillText(componentW.toFixed(0), 10, 10);
							thisComponent.render(ctx);
							componentsRendered++;
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