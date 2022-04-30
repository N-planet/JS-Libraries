manager.import(["forms/ajax.js"])

class ToggleableForm {
  /**
   * Editable Form that tracks filled data and extracts changes made to it then sends it to the back-end
   */
  constructor(form){
		/**
		 * Form Initialization
		*/
		this.form = form
    this.title = $(this.form).attr('id')
    this.validators = null;
		this.ajax = new AJAX(form)
		this.submitBtn = $("[submit="+$(this.form).attr('id')+"]")
    if(!this.submitBtn.length)
      console.log("submit btn not found for "+this.title+" form")
		$(this.submitBtn).attr('type', 'button')
		$(this.submitBtn).click(this.run.bind(this))

    // Toggling belongings
    this.enabled = false
    this.changed = false
    this.decision = $(this.form).find('[decision]')
    if(!this.decision.length)
      console.log("decision container not found for "+this.title+" form")

    this.enableBtn = $(this.form).find('[enable]')
    if(!this.enableBtn.length)
      console.log("Enable Form btn not found for "+this.title+" form")

    $(this.enableBtn).css("pointer-events", "auto")
    this.enableBtn.click(this.enable.bind(this))

    this.disableBtn = $(this.form).find('[disable]')
    if(!this.disableBtn.length)
      console.log("Disable form btn not found for "+this.title+" form")
      
    $(this.disableBtn).css("pointer-events", "auto")
    this.disableBtn.click(this.disable.bind(this))  
  }

  update(){
    /**
     * Implemented in subclasses
     */
  }

  enable(){
    /**
     * Hide Decision
     * Remove Disabled Attributes
     * Update toggleBtn
     */
    $(this.decision).addClass('hidden');
    this.enableFields() // implemented in subclass
    this.enableBtn.addClass("hidden")
    this.disableBtn.removeClass("hidden")
    this.enabled = true  
  }

  disable(){
    /**
     * Disable editing
     */
    if(this.validators !== null && !this.validators.validateAll())
      return

    this.isChanged()

    if(!this.changed) 
      $(this.decision).addClass('hidden')
    else 
      $(this.decision).removeClass('hidden')
    this.disableFields() // implemented in subclass
    this.enableBtn.removeClass("hidden")
    this.disableBtn.addClass("hidden")
    this.enabled = false
  }

  isChanged(){
    /**
     * Implemented in subclasses
     */
  }

  compare(){
    /**
     * Implemented in subclasses
     */
  }

  run(){
    this.ajax.send(this.compare())
  }
}