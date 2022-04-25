manager.import(["validators/validators.js", "forms/utils/toggleableForm.js"])

class EditableForm extends ToggleableForm {
  /**
   * Tracks changes to existing fields and identifies changes (handles file inputs)
   */
  constructor(form){
    super(form)
    this.update()
    this.validators = new Validators(form)
  }

  update(){
    /**
     * update this.originals
     */
    this.originals = []
    $(this.form).find("[name]:not([essential])").each(function(i, input){
      if($(input).attr('type') == 'file'){ // tracking file
        let key = $(input).attr('name')
        let value = $(input).next().html()
        this.originals[key] = value
      }
      else{
        if(!this.originals.length) {
          let key = $(input).attr('name')
          let value = $(input).val()
          this.originals[key] = value
        }
      } 
    }.bind(this))

    this.disable()
  }

  enableFields(){
    $(this.form).find('[name]').each(function(i, input){
        $(input).removeAttr('disabled')
        if($(input).attr('type') == 'file')
          $(input).next().removeAttr('disabled')
    })
  }

  disableFields(){
      $(this.form).find('[name]').each(function(i, input){
          $(input).attr('disabled', 'disabled')
          if($(input).attr('type') == 'file')
            $(input).next().attr('disabled', 'disabled')
      })
  }

  isChanged(){
      /**
       * update this.changed
       */
      this.changed = false
      $(this.form).find('[name]:not([essential])').each(function(i, input){
        let original = this.originals[$(input).attr('name')]
        let val
        if($(input).attr('type') == 'file')
          val = $(input).next().html()
        else
          val = $(input).val()
  
        if(original != val) {
          this.changed = true
          return false; // Exit Loop
        }
      }.bind(this));
    }
  
    compare(){
      /**
       * return changed fields
       */
      if(!this.changed)
        return {}
      
      let form_data = new FormData()
      $(this.form).find('[name]').each(function(i, input){
        let key = $(input).attr('name')
        let val
        if($(input).attr('type') == 'file')
          val = $(input).next().html()
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