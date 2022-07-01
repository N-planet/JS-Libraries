import {Validators} from "../validators/Validators.js";
import {Sender} from "./Sender.js";

class BasicForm {
	/**
	 * class for basic form flow (validation, data extraction, and ajax requesting)
	 */
	constructor(form){
		/**
		 * Form Initialization.
		*/
		this.form = form
    this.form_title = $(form).attr('id')
    if(this.form_title === undefined)
      console.log("id not found for "+this.form_title+" form")

    this.initialize()
	}

  initialize(){
    if($(this.form).attr('form_type') != 'list')
		  this.validators = new Validators(this.form)
		this.sender = new Sender(this.form)

		this.submitBtn = $("[submit="+$(this.form).attr('id')+"]")
    if(!this.submitBtn.length)
      console.log("submit btn not found for "+this.title+" form")
		$(this.submitBtn).attr('type', 'button')
		$(this.submitBtn).click(this.run.bind(this))
  }

  payload(){
    return new FormData(this.form)
  }

	run() {
		/**
		 * run the form
		 */
		if(this.validators.validateAll()){
      let form_data = this.payload()
      this.sender.send(form_data)
    }
	}
}

export {BasicForm}