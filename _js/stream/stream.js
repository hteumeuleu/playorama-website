---
layout: null
permalink: "/assets/js/stream.js"
---
{% include_relative _pd-usb.min.js %}
{% include_relative _preview.js %}
{% include_relative _device.js %}

class streamApp {

	constructor() {
		this.width = 400;
		this.height = 240;
		this.fps = 30;
		this.preview = new pdvPreview();
		this.stream = new pdDevice();
	}

}

document.addEventListener('DOMContentLoaded', e => {
	window.app = new streamApp();
})

window.addEventListener('beforeunload', e => {
	window.app.stream.disconnect();
})
