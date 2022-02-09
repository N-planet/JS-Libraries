class AJAX {
    constructor(form, api, type, callback){
        this.#form = form
        this.#api = api
        this.#type = type
        this.#callback = callback
    }

    request(){
		let form_data = new FormData(this.#form);
		let data_object = {};
		form_data.forEach(function(value, key){
		  data_object[key] = value;
		});

		$.ajax({
			url: this.#api,
			type: this.#type,
			contentType: false,
			processData: false,
			data: JSON.stringify(data_object),
			success: function(response){
				this.#callback(response);
			}
		})
    }
}