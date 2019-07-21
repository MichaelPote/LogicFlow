define(
	[
		'jquery',
		'app/events',
		'app/images'
	],
	function($, Events, Images)
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

				this.mx = 0; //Mouse position X
				this.my = 0; //Mouse position Y

				this.lastFrameTime = 0;

				this.zoomTarget = 3;
				this.zoomLevel = 3;

				this.width = canvas.width;
				this.height = canvas.height;
				this.fps = 0;


				this.render = this.render.bind(this);
				setInterval(this.displayFps.bind(this), 1000);

				$(window).resize(this.onResize.bind(this));

				let self = this;
				Events.on(Events.EVENT_MOUSEMOVE, function(x,y){
					self.mx = x;
					self.my = y;
				});

			}

			start()
			{
				this.bw = Images.backtile.naturalWidth;
				this.bh = Images.backtile.naturalHeight;

				this.onResize();
				ctx.strokeStyle = '#FF0000';
				ctx.clearRect(0, 0, ctx.width, ctx.height);
				window.requestAnimationFrame(this.render);

			}

			onResize() {
				canvas.width = $(canvas).width();
				canvas.height = $(canvas).height();
				this.width = canvas.width;
				this.height = canvas.height;

				console.log("Renderer: " + this.width + "x" + this.height);
			}

			addZoomDelta(dz)
			{
				this.zoomTarget += dz;
				if (this.zoomTarget <= 1) this.zoomTarget = 1;
			}

			addViewDelta(dx, dy)
			{
				this.vx += dx * (1 / this.vz);
				this.vy += dy * (1 / this.vz);
			}

			render(time) {
				let t = (time - this.lastFrameTime) / 16; //Get the timescale between this frame and an ideal 60fps (16ms per frame). 1 = running at 60fps, 0.5 = running at 120fps.

				//Is there a zoom to perform?
				if (this.zoomLevel < this.zoomTarget-0.001 || this.zoomLevel > this.zoomTarget + 0.001)
				{
					let zoomDelta = (this.zoomTarget - this.zoomLevel)*0.5*t;

					this.zoomLevel += zoomDelta;

					let oldVz = this.vz;
					this.vz = Math.pow(2,(this.zoomLevel))*0.25; //Convert linear zoomLevel value into exponential vz scale value.

					this.vx += this.mx*oldVz/this.vz - this.mx;
					this.vy += this.my*oldVz/this.vz - this.my;


					/*
					this.vz += zoomDelta;
					if (zoomDelta > 0)
					{

						//TODO: Fix the zooming to center the vx and vy while zooming.
						this.vx -= zoomDelta * this.width*(1/this.vz) * 0.5;
						this.vy -= zoomDelta * this.height*(1/this.vz) * 0.5;
					}
					 */
				}

				this.bws = this.bw * this.vz;
				this.bhs = this.bh * this.vz;
				this.vxs = this.vx * this.vz;
				this.vys = this.vy * this.vz;

				let boffsetx = (this.vxs % this.bws);
				let boffsety = (this.vys % this.bhs);

				//Draw the grid background:
				let backImg = (this.zoomLevel < 2 ? Images.backtileZO : Images.backtile);
				if (this.bws > 0 && this.bhs > 0)
				{
					for (let x = Math.ceil(this.width / this.bws); x >= -1; x--)
					{
						for (let y = Math.ceil(this.height / this.bhs); y >= -1; y--)
						{
							ctx.drawImage(backImg, x*this.bws + boffsetx, y*this.bhs + boffsety, this.bws, this.bhs);
						}
					}
				}


				//ctx.clearRect(0,0,50,30);
				ctx.fillText(this.fps+" FPS. Vz = " + this.vz, 10, 10);

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