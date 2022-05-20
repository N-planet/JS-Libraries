class ToggleableForm {
  /**
   * Editable Form that tracks filled data and extracts changes made to it then sends it to the back-end
   */
  constructor(form){
		/**
		 * Form Initialization
		*/
		this.form = form
    this.type = $(form).attr('form_type')
    this.title = $(this.form).attr('id')

    // Toggling belongings
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

  enable(){
    /**
     * Hide Decision
     * Remove Disabled Attributes
     * Update toggleBtn
     */
    $(this.decision).addClass('hidden');

    // Enabling editable forms
    $(this.form).find('[name]').each(function(i, input){
      $(input).removeAttr('disabled')
      if($(input).attr('type') == 'file')
        $(input).next().removeAttr('disabled')
    })

    // Enabling list forms
    if(this.type == 'list'){
      for(let list of this.lists)
        list.showActions()
    }
      
    this.enableBtn.addClass("hidden")
    this.disableBtn.removeClass("hidden")
    this.enabled = true  
  }

  isChanged(){
    let changed = false

    if(this.type == 'editable'){
      $(this.form).find('[name]:not([essential])').each(function(i, input){
        let original = this.originals[$(input).attr('name')]
        let val
        if($(input).attr('type') == 'file'){
          let name = $(input).attr('name')
          val = $("[track="+name+"]").html()
        }
        else
          val = $(input).val()
  
        if(original != val) {
          changed = true
          return false; // Exit Loop
        }
      }.bind(this));
    }
    else if(this.type == 'list'){
      for(let list of this.lists)
        if(list.isChanged()){
          changed = true
          break;
        }
    }

    return changed
  }

  disable(){
    /**
     * Disable editing
     */
    if(this.isChanged()) // payload() is implemented in the subclasses
      $(this.decision).removeClass('hidden');
    else
      $(this.decision).addClass('hidden'); 

    // Disabling editable forms
    $(this.form).find('[name]').each(function(i, input){
      $(input).attr('disabled', 'disabled')
      if($(input).attr('type') == 'file')
        $(input).next().attr('disabled', 'disabled')
    })

    // Disabling list forms
    if(this.type == 'list'){
      for(let list of this.lists)
        list.hideActions()
    }

    this.enableBtn.removeClass("hidden")
    this.disableBtn.addClass("hidden")
    this.enabled = false
  }
  
}