manager.import(["assets/js/utils/validators.js", "assets/js/utils/ajax.js"])

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
    this.update() // this.originals

    this.enabled = false
    this.changed = false
    this.decision = $(this.form).find('#decision')
    this.toggleBtn = $(this.form).find('[toggle_enable]')
    $(this.toggleBtn).css("pointer-events", "auto")
    this.toggleBtn.click(this.toggle.bind(this))

  }

  update(){
    this.originals = []
    $(this.form).find("[name]:not([essential])").each(function(i, input){
      if($(input).val()){
        $(input).attr('value', $(input).val())
        if(!this.originals.length) {
          let key = $(input).attr('name')
          let value = $(input).val()
          this.originals[key] = value
        }
      } 
    }.bind(this))
  }

  toggle(){
    if (this.enabled){
      if(this.validators.validateAll()){
        this.isChanged()
        this.disable()
      }
      else {
        Swal.fire({
          title: 'Validation Error!',
          text: "Please Fix The Errors Before Commit",
          icon: 'warning'
        })
      }
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
    $(this.form).find('[name]').removeAttr('disabled')
    $(this.form).find("[for=uploader]").removeAttr('disabled')
    ;
    this.toggleBtn.html(`
      Commit&nbsp;<i class="bi bi-check2"></i>
    `)
    this.enabled = true  
  }

  disable(){
    /**
     * Update Decision View
     * Add Disabled Attributes
     * Update toggleBtn
     */
    if(!this.changed) 
      $(this.decision).addClass('hidden')
    else 
      $(this.decision).removeClass('hidden')

    $(this.form).find('[name]').attr('disabled', 'disabled')
    $(this.form).find("[for=uploader]").attr('disabled', 'disabled');
    this.toggleBtn.html(`
      Edit&nbsp;<i class="bi bi-pencil"></i>
    `)
    this.enabled = false
  }

  isChanged(){
    this.changed = false
    let file_uploads = $(this.form).find('[type=file]')
    if(file_uploads.length){
      $(file_uploads).each(function(i, element){
        if($(element)[0].files.length){
          this.changed = true
          return false // Exit loop
        }
      })
    }
    if(!this.changed){
      $(this.form).find('[name]:not([type=file]):not([essential])').each(function(i, input){
        let original = this.originals[$(input).attr('name')]
        let val = $(input).val()
        if(original != val) {
          this.changed = true
          return false; // Exit Loop
        }
      }.bind(this));
    }
  }

  compare(){
    if(!this.changed)
      return {}

    let data_object = {}
    $(this.form).find('[name]:not([type=file])').each(function(i, input){
      let key = $(input).attr('name')
      let val = $(input).val()
      if(val != this.originals[key])
        data_object[key] = val
    }.bind(this))

    // File Upload is available
    if($(this.form).find('input[type=file]').length){
      let form_data = new FormData()
      for(let key in data_object)
        form_data.append(key, data_object[key])

      // Files
      $(this.form).find('input[type=file]').each(function(i, input){
        form_data.append($(input).attr('name'), $(input)[0].files[0])
      })

      return form_data
    }

    return data_object
  }

  run(){
    this.ajax.send(this.compare())
  }
}