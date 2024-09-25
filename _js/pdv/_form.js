class pdvForm {

	constructor() {
		this.form = document.querySelector('.app-toolbar');
		this.message = document.querySelector('.app-message');
		this.addEvents();
	}

	addEvents() {
		this.form.addEventListener('change', e => {
			this.triggerFormChangeEvent();
		});

		// Scale (inside or outside)
		const radioScaleInside = document.querySelector('input[name="scale"][value="inside"]')
		const radioScaleOutside = document.querySelector('input[name="scale"][value="outside"]')
		radioScaleInside.addEventListener('change', e => {
			this.triggerFormScaleChangeEvent(e);
		});
		radioScaleOutside.addEventListener('change', e => {
			this.triggerFormScaleChangeEvent(e);
		});

		// File input
		const fileInput = document.querySelector('form input[type="file"]')
		fileInput.addEventListener('change', e => {
			this.triggerFormVideoChangeEvent();
		});

		// Dither select
		const ditherSelect = document.querySelector('#app-select-dither')
		ditherSelect.addEventListener('focus', e => {
			if(app && app.preview && app.preview.video) {
				app.preview.video.classList.remove('is-visible-on-hover');
			}
		});
		ditherSelect.addEventListener('blur', e => {
			if(app && app.preview && app.preview.video) {
				app.preview.video.classList.add('is-visible-on-hover');
			}
		});
	}

	triggerFormChangeEvent() {
		document.dispatchEvent(new CustomEvent('pdvFormChange', {
			detail: +new Date()
		}));
	}

	triggerFormScaleChangeEvent(evt) {
		document.dispatchEvent(new CustomEvent('pdvFormScaleChange', {
			bubbles: true,
			detail: evt.target.value
		}));
	}

	triggerFormVideoChangeEvent() {
		document.dispatchEvent(new CustomEvent('pdvFormVideoChange', {
			bubbles: true,
			detail: +new Date()
		}));
	}

	showMessage() {
		this.message.removeAttribute('hidden');
	}

	hideMessage() {
		this.message.setAttribute('hidden', 'hidden');
	}

	updateMessage(value) {
		this.message.querySelector('.app-message-value').innerHTML = value;
	}
}
