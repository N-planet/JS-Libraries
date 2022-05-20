manager.import(["validators/Validators.js", "forms/BasicForm.js", "forms/ToggleableForm.js"])

class EditableForm extends BasicForm {
  /**
   * Tracks changes to existing fields and identifies changes (handles file inputs)
   */
  constructor(form){
    super(form)
    this.toggler = new ToggleableForm(form)
    this.update()
  }

  update(){
    /**
     * update this.originals
     */
    this.originals = []
    $(this.form).find("[name]:not([essential])").each(function(i, input){
      let key = $(input).attr('name');
      let value;
      if($(input).attr('type') == 'file') // tracking file
        value = $(input).attr('file')
        
      else
        value = $(input).val()
      this.originals[key] = value
      
    }.bind(this))
    
    this.toggler.originals = this.originals
    this.toggler.disable()
  }
  
  payload(){
    /**
     * return changed fields
     */
    let form_data = new FormData()

    $(this.form).find('[name]').each(function(i, input){
      let key = $(input).attr('name')
      let val
      if($(input).attr('type') == 'file')
        val = $(input).attr('file')
      else 
        val = $(input).val()
      
      if(val != this.originals[key]){
        val = $(input).attr('type') == 'file' ? $(input)[0].files[0] : val
        form_data.append(key, val)
      }
    }.bind(this))

    return form_data
  }
}