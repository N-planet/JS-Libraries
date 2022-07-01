import { AJAX } from "../Ajax.js";

class Sender {
  /**
   * Class for form-api communication
   */
  constructor(form){
		this.form = form
		this.form_title = $(form).attr('id')
		this.api = $(form).attr('api')
		if(this.api === undefined)
			console.log("api destination not found for "+this.form_title+" form")
		this.type = $(form).attr('request_type') !== undefined ? $(form).attr('request_type') : 'GET'
		this.callback = window[$(form).attr('callback')]
		if(this.callback === undefined)
			console.log("callback function not determined for "+this.form_title+" form")
	}

  send(data){
		AJAX.ajax({
			url: this.api,
			type: this.type,
			data: data,
			success: function(response){
				response = JSON.parse(response)
				this.callback(response)
			}.bind(this)
		})
  }
}

export {Sender}