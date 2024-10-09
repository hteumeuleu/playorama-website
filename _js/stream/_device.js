class pdDevice {

	constructor() {
		this.warning = document.querySelector('.app-warning');
		this.streamButton = document.querySelector('#app-btn-stream');
		this.webcamButton = document.querySelector('#app-btn-webcam');
		this.screenButton = document.querySelector('#app-btn-screen');
		if(!(navigator.serial && window.isSecureContext)) {
			this.streamButton.setAttribute('disabled', 'disabled');
			this.warning.style.display = 'block';
		} else {
			this.streamButton.removeAttribute('disabled');
			this.warning.remove();
		}
		this.addEvents();
	}

	addEvents() {
		this.streamButton.addEventListener('click', async() => {
			if(this.isStreaming === true) {
				this.isStreaming = false
			} else {
				this.isStreaming = true
			}
			if(this.isStreaming) {
				let device;
				navigator.usb
					.requestDevice({ filters: [{ vendorId: 0x1331, productId: 0x5740 }] })
					.then((selectedDevice) => {
						device = selectedDevice;
						console.log(device.productName); // "Playdate"
						console.log(device.manufacturerName); // "Panic Inc"
						console.log(device.usbVersionMajor, device.usbVersionMinor, device.usbVersionSubminor);
						return device.open(); // Begin a session.
					})
					.then(() => device.selectConfiguration(1))
					.then(() => { console.log(device.configuration); return device; })
					.then(() => device.claimInterface(1))
					.then(() => {
						const command = 'help\n';
						console.log(command);
						device.controlTransferOut({
							requestType: 'vendor',
							recipient: 'other',
							request: command,
							value: 0x00,
							index: 0x01
						});
					}) // Ready to receive data
					.then(() => device.transferIn(1, 64))
					.then(result => {
						console.log("result", result);
						const decoder = new TextDecoder();
						console.log('Received: ' + decoder.decode(result.data));
					})
					.then(() => device.releaseInterface(1))
					.then(() => device.close())
					.catch(error => { console.error(error); });
				// this.connect().then(() => {
				// 	app.preview.video.play()
				// 	this.streamButton.innerText = 'Stop streaming';
				// 	this.send();
				// });
			} else {
				this.streamButton.innerText = 'Start streaming';
				app.preview.video.pause()
			}
		});
		this.webcamButton.addEventListener('click', async() => {
			navigator.mediaDevices.getUserMedia({
				audio: false,
				video: {
					width: { min: 400 },
					height: { min: 240 },
					facingMode: "user",
				},
			}).then((mediaStream) => {
				const video = app.preview.video;
				video.srcObject = mediaStream;
				video.onloadedmetadata = () => {
					video.play();
				};
			}).catch((err) => {
				console.error(`${err.name}: ${err.message}`);
			});
		});
		this.screenButton.addEventListener('click', async() => {
			navigator.mediaDevices.getDisplayMedia({
				audio: false,
			}).then((mediaStream) => {
				const video = app.preview.video;
				video.srcObject = mediaStream;
				video.onloadedmetadata = () => {
					video.play();
				};
			}).catch((err) => {
				console.error(`${err.name}: ${err.message}`);
			});
		});
	}

	async connect() {
		if(this.device == null) {
			try {
				this.device = await pdusb.requestConnectPlaydate();
				if (this.device == null) {
					throw new Error('Playdate not found.');
				}
				await this.device.open();
			}
			catch(e) {
				console.error('Cannot connect to Playdate.');
			}
		}
	}

	async disconnect() {
		try {
			await this.device.close();
		}
		catch(e) {
			console.error('Cannot disconnect from Playdate.');
		}
	}

	async send() {

		if(app.stream.isStreaming) {

			try {
				const w = 400;
				const h = 240;
				const bitmap = new Uint8Array(w * h).fill(1);
				const frame = app.preview.getFrame();
				const dataRGB = frame.data;
				for (let i = 0; i < dataRGB.length; i += 4) {
					let value = dataRGB[i];
					if(value != 0) {
						value = 1;
					}
					bitmap[i/4] = value;
				}
				if(app.stream.device) {
					await app.stream.device.sendBitmapIndexed(bitmap);
				}
			}
			catch(e) {
				console.error(e.message);
			}
			setTimeout(app.stream.send, (1000 / 24));
			
		}
	}
}
