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

    // load form initial data
    if($(this.form)[0].hasAttribute('load'))
      window[$(this.form).attr('load')]()

    // Toggling belongings
    this.enabled = false
    this.changed = false
    this.decision = $(this.form).find('[decision]')
    if(!this.decision.length)
      console.log("decision container not found for "+this.title+" form")
    this.toggleBtn = $(this.form).find('[toggle_enable]')
    if(!this.toggleBtn.length)
      console.log("toggle status btn not found for "+this.title+" form")
    $(this.toggleBtn).css("pointer-events", "auto")
    this.toggleBtn.click(this.toggle.bind(this))
  }

  update(){
    /**
     * Implemented in subclasses
     */
  }

  toggle(){
    if (this.enabled){
      if(this.validators === null || this.validators.validateAll())
        this.disable()
    }

    else
      this.enable();
  }

  enable(){
    /**
     * Hide Decision
     * Remove Disabled Attributes
     * Update toggleBtn
     */
    $(this.decision).addClass('hidden');
    this.enableFields() // implemented in subclass
    this.toggleBtn.html(`
      Commit&nbsp;<i class="bi bi-check2"></i>
    `)
    this.enabled = true  
  }

  disable(){
    /**
     * Disable editing
     */
    this.isChanged()

    if(!this.changed) 
      $(this.decision).addClass('hidden')
    else 
      $(this.decision).removeClass('hidden')
    this.disableFields() // implemented in subclass
    this.toggleBtn.html(`
      Edit&nbsp;<i class="bi bi-pencil"></i>
    `)
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