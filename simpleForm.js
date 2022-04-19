manager.import(["assets/js/utils/validators.js", "assets/js/utils/ajax.js"])

class SimpleForm {
	/**
	 * class for basic form flow (validation, data extraction, and ajax requesting)
	 */
	constructor(form){
		/**
		 * Form Initialization.
		*/
		this.form = form
		this.validators = new Validators(form)
		this.ajax = new AJAX(form)
		this.submitBtn = $("[submit="+$(this.form).attr('id')+"]")
		$(this.submitBtn).attr('type', 'button')
		$(this.submitBtn).click(this.run.bind(this))
	}

	run() {
		/**
		 * run the form
		 */
		if(this.validators.validateAll())
			this.ajax.submit()
	}
	
}