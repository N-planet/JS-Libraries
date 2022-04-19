class AJAX {
  constructor(form){
    this.form = form
    this.api = $(form).attr('api')
		this.type = $(form).attr('request_type')
		this.callback = window[$(form).attr('callback')]
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
				preloader();
			},
			success: function(response){
				response = integrityChecker(response, data)
				if(!response)
					return
        
				this.callback(response)
				
			}.bind(this),
			error: function(){
				window['reportFailure'](data)
			},
      complete: function(){
        preloader()
      }
		}

		if(data instanceof FormData){
			options.contentType = false;
			options.processData = false;
		}
		$.ajax(options)
  }
}