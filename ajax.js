class AJAX {
	constructor(form){
	this.form = form
	this.api = $(form).attr('api')
	this.type = $(form).attr('request_type')
	this.preloader = typeof preloader == "function" ? window['preloader'] : AJAX.preloader.bind(this)
	this.reportFailure = typeof reportFailure == "function" ? reportFailure : AJAX.reportFailure
	this.integrityChecker = typeof integrityChecker == "function" ? intergrityChecker : AJAX.integrityChecker
	this.callback = window[$(form).attr('callback')]
	}

	static preloader(){
		/**
		 * TODO
		 */
		let loader = $(this.form).find('span.form-loading')
		if(loader.length)
			$(loader).remove()
		else 
			$(this.form).append(`
				<span class="form-loading">Loading ...</span>
			`)
	}

	static reportFailure(){
		alert("Something Went Wrong!")
	}

	static integrityChecker(response, data){
		return response
	}

	getData(){
		/**
		 * Collect the filled data in the suitable data structure
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

	submit(){
		/**
		 * Send filled data
		 */
		let data = this.getData()
		this.send(data)
	}

  	send(data){
		let options = {
			url: this.api,
			type: this.type,
			data: data,
			beforeSend: function(){
				this.preloader();
			}.bind(this),
			success: function(response){
				response = this.integrityChecker(response, data)
				if(!response)
					return
        
				this.callback(response)
				
			}.bind(this),
			error: function(){
				this.reportFailure()
			}.bind(this),
			complete: function(){
				this.preloader();
			}.bind(this)
		}

		if(data instanceof FormData){
			options.contentType = false;
			options.processData = false;
		}
		$.ajax(options)
  	}
}