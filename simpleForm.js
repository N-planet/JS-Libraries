import {Validator} from "./validators/validator.js";

export class SimpleForm {
	/**
	 * class for basic form flow (validation, data reading and ajax communication)
	*/

	constructor(form){
		/**
		 * Form Initialization.
		*/
		this.form = form
		this.validators = []
		this.initializeValidators()
		this.api = $(form).attr('api')
		this.type = "POST"
		this.callback = window[$(form).attr('callback')]
		this.submitBtn = $(this.form).find("[submit="+$(this.form).attr('id')+"]")
		$(this.submitBtn).click(this.run.bind(this))

		$(this.form).find('button:not([type=reset])').attr('type', 'button')
	}

	initializeValidators(){
		/**
		 * Function creates a validator instance for every input
		 */
		function newValidator(i, input){
			let validator = Validator.new(input)
			if(validator)
				this.validators.push(validator)
		}
		$(this.form).find('[name]').not("[list] [name]").each(newValidator.bind(this))
	}

	validateAll(){
		/**
		 * Validate all fields inside the form
		 */
		for(let validator of this.validators){
			if(validator.run())
				return false
		}
		return true
	}

	getData(){
		/**
		 * Find form data to be sent
		 */
		let form_data = new FormData(this.form);
		if($(this.form).find('input[type=file]'))
			return form_data;
		
		let data_object = {};
		form_data.forEach(function(value, key){
			data_object[key] = value;
		});
		return data_object
	}
	

	submit(data){
		/**
		 * AJAX work
		 */
		let start_instance
		let options = {
			url: this.api,
			type: this.type,
			data: data,
			beforeSend: function(){
				preloader();
			},
			success: function(response){
				preloader();

				response = integrityChecker(response, data)
				if(!response)
					return
					
				if(response.details && response.details.length){
					for(let detail of response.details){
						Swal.fire({
							title: '',
							icon: 'info',
							html: detail,
							showCloseButton: false,
							showCancelButton: false,
							focusConfirm: false,
							confirmButtonText: 'OK',
						})
					}
				}
				else if(response.status != 'success') {
					setTimeout(function(){
						  Swal.fire({
							icon: 'error',
							title: 'Oops...',
							text: response.status.split(':')[1],
							footer: ''
						}).then((willDelete) => {
							// Silence
						})
				 }, 2000);
				
				}

				if(response.status == 'success' && typeof this.update === 'function')
					this.update()
				this.callback(response)
				
			}.bind(this),
			error: function(){
				window['reportFailure']()
			}
		}
		if(data instanceof FormData){
			options.contentType = false;
			options.processData = false;
		}
		$.ajax(options)
	}

	run() {
		/**
		 * run the form
		 */
		if(this.validateAll()){
			let data = this.getData()
			this.submit(data)
		}
	}
	
}