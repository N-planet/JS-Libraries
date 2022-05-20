manager.import(["validators/Validator.js"])

class Validators {
  /**
   * Validators Pool
   * Used for multi-field containers validation
   */
  constructor(container){
    /**
     * Initialization
     */
    this.initializeValidators(container)
		if($(container)[0].hasAttribute('new')){
			this.msgContainer = $("[alert="+$(container).attr('new')+"]")
			if(!this.msgContainer.length)
				console.log($(container).attr('new')+" alert container not found")
		}
		else{
    	this.msgContainer = $("[alert="+$(container).attr('id')+"]")
			if(!this.msgContainer.length)
				console.log($(container).attr('id')+" alert container not found")
		}
  }

  initializeValidators(container){
    /**
     * Constructing validators
     */
    this.validators = []
    function newValidator(i, input){
      let validator = Validator.new(input)
      if(validator){
        this.validators.push(validator)

        $(input).on('input', function(){
          this.showMsg(validator, validator.run())
        }.bind(this, validator))
      }
    }
    $(container).find('input').each(newValidator.bind(this))
  }

  validateAll(){
		/**
		 * All Fields Must Be Healthy
		 */
		for(let validator of this.validators){
			let err = validator.run()
			this.showMsg(validator, err)
			if(err)
				return false
		}
		return true
	}

  showMsg(validator, err){
    /**
     * Display Error
     */
		let text = validator.fieldName+" Error: "
		switch(err){
			case 1:
				text += "Required Field"
				break;
			case 2:
				text += "Min Limit is " + validator.min
				break;
			case 3:
				text += "Max Limit is " + validator.max
				break;
			case 4:
				text += "Wrong Pattern!<br>Hover Over the field to view the allowed characters"
				break;
			case 5:
				text += "Not Matching"
				break;
			default:
				text = ""
		}
		$(this.msgContainer).html(text)
	}


}