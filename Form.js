import {Validator} from Validator.js
import {ajax} from ajax.js

class Form {
	/**
	 * Class for manipulating ajax forms only
	 * Using Only one js statement, you can validate inputs, display error messages, and send the ajax request if everything is valid
	 * 
	 * How to use this library
	 * ———————————————————————
	 * Topic1: HTML structure
	 * 		Create HTML form with specific id and the desired inputs such that each input must have one attribute of three:
	 * 		1. must
	 * 		2. optional
	 * 		3. confirm="id of element to confirm" (like "retype password" field)
	 * 		must and optional inputs must have regex attribute containing the regex to be tested.
	 * 		The form must contain a <button type="button" submit> element to function (Notice the "submit" attribute)
	 * 
	 * Topic 2: JS Work
	 * create new form object and pass to it form id, api link, request type, callback function to be called on request success, and finally the html element for displaying warnings for each input in this form
	 * 
	 * 
	 */
	constructor(id, api, type, callback, msg=`<span class="msg" role="msg"></span>`){
		/**
		 * Form Initialization.
		 * @param id: id of form element
		 * @param msg: span element structure to be set after each input field
		*/
		this.#form = $("#"+id)
		this.#validators = this.#initializeValidators(msg)
		this.#ajax = new AJAX(this.#form, api, type, callback)
		this.#submit = $(this.#form).find("button[submit]")

		$(this.#submit).click(function(){
			if(this.#validateAll())
				this.#ajax.request()
		})
	}

	#initializeValidators(msg){
		/**
		 * Function creates a validator instance for every input
		 */
		let validators = []
		$(this.#form).find("input").each(function(i, input){
			validator = new Validator(input, msg)
			validators.push(validator)
		})
		return validators
	}

	#validateAll(){
		for(var validator in this.#validators){
			if(!validator.validate())
				return false
		}
		return true
	}
	
}