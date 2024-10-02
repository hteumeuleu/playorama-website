---
layout: null
permalink: "/assets/js/encoder.js"
---
{% include_relative _demuxer_mp4.js %}
{% include_relative _preview.js %}
{% include_relative _form.js %}
{% include_relative _export.js %}

class pdvApp {

	constructor() {
		this.width = 400;
		this.height = 240;
		this.fps = 30;
		this.preview = new pdvPreview();
		this.form = new pdvForm();
		this.export = new pdvExport();
	}

}

document.addEventListener('DOMContentLoaded', e => {
	window.app = new pdvApp();
})
