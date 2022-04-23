manager.import(["validators.js", "ajax.js"])

class EditableForm {
  /**
   * Editable Form that tracks filled data and extracts changes made to it then sends it to the back-end
   */
  constructor(form){
		/**
		 * Form Initialization
		*/
		this.form = form
    this.title = $(this.form).attr('id')
		this.validators = new Validators(form)
		this.ajax = new AJAX(form)
		this.submitBtn = $("[submit="+$(this.form).attr('id')+"]")
		$(this.submitBtn).attr('type', 'button')
		$(this.submitBtn).click(this.run.bind(this))

    // Editable Section
    if($(this.form)[0].hasAttribute('load'))
      window[$(this.form).attr('load')]()

    this.enabled = false
    this.changed = false
    this.decision = $(this.form).find('[decision]')
    this.toggleBtn = $(this.form).find('[toggle_enable]')

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
      if(this.validators.validateAll())
        this.disable()
    }
    else this.enable();
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