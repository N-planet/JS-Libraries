import { List } from "./list.js"
import { SimpleForm } from "./simpleForm.js"

export class EditableForm extends SimpleForm {

  constructor(form){
    super(form) // For validation and sender
    this.originals = []
    this.initializeCollections()
    this.loadOriginals()
    this.decision = $(this.form).find('#decision')
    this.toggleEnableBtn = $(this.form).find('[toggle_enable]')
    $(this.toggleEnableBtn).css("pointer-events", "auto")
    this.toggleEnableBtn.click(this.toggleStatus.bind(this))
    this.Enabled = false;
    this.changed = false;

    $(this.form).find('[type=reset]').click(function (){
      $(this.decision).addClass('hidden')
    }.bind(this))
  }

  initializeCollections(){
    this.lists = []
    $(this.form).find('[list]').each(function(i, container){
      let temp = new List(container)
      this.lists.push(temp)
    }.bind(this))
  } 

  loadOriginals(){
    this.originals = []
    $(this.form).find("[name]").each(function(i, input){
      if($(input).val()){
        $(input).attr('value', $(input).val())
        if(!this.originals.length) {
          let key = $(input).attr('name')
          let value = $(input).val()
          this.originals[key] = value
        }
      } 
    }.bind(this))

    this.lists.forEach(function(list, i){
      list.loadCollections()
    })
  }

  toggleStatus(){
    function toggleUploaders(){
      $("[for=uploader]").each(function (i, element){
        let disabled = $(element).attr('disabled');
        if(disabled)
          $(element).removeAttr("disabled")
        else
          $(element).attr('disabled', 'disabled')
      })
    }
    if (!this.Enabled) this.startTracker();
    else {
      if(this.validateAll()) this.endTracker()
      else {
        alert('Please fix the errors before commit')
        return
      }
    }
  }

  startTracker(){
    $(this.decision).addClass('hidden');
    this.toggleEnableBtn.html(`
      Commit&nbsp;<i class="bi bi-check2"></i>
    `)
    $(this.form).find('[name]').each(function (i, item){
      $(item)[0].removeAttribute('disabled')
    })
    this.lists.forEach(function(list, i){
      list.enable()
    })

    $(this.form).find("[for=uploader]").removeAttr('disabled');

    this.Enabled = true
  }

  endTracker(){
    this.toggleEnableBtn.html(`
      Edit&nbsp;<i class="bi bi-pencil"></i>
    `)
    $(this.form).find('[name]').attr('disabled', 'disabled')
    this.lists.forEach(function(list, i){
      list.disable()
    })

    this.originalsChanged()
    this.listsChanged()

    $(this.form).find("[for=uploader]").attr('disabled', 'disabled');

    this.Enabled = false
  }

  originalsChanged(){
    this.changed = false
    
    $(this.form).find('[type=file]').each(function(i, element){
      if($(element)[0].files.length){
        this.changed = true
        return false // Exit loop
      }
    })
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

    if(!this.changed) $(this.decision).addClass('hidden')
    else $(this.decision).removeClass('hidden')
    return this.changed
}

  listsChanged(){
    if(this.changed)
      return

    this.changed = false
    this.lists.forEach(function(list, i){
      let changes = list.getData()
      if(changes['add'].length || changes['remove'].length){
        this.changed = true
        return true
      }
    }.bind(this))

    if(!this.changed) $(this.decision).addClass('hidden')
    else $(this.decision).removeClass('hidden')
    return this.changed
  }

  getData(){
    if(!this.changed)
      return {}
    
    // Endpoint requirements
    let data_object = {
      action: $(this.form).find('[name=action]').val(),
      _id: id,
      token: token,
      session_id: $(this.form).find('[name=session_id]').val(),
      chapter_id: $(this.form).find('[name=chapter_id]').val(),
      course_id: $(this.form).find('[name=course_id]').val()
    }
    // Special data
    $(this.form).find('[name]').not("[list] [name]").not("[type=file]").each(function(i, input){
      let data_type = $(input).attr('name')
      let val = $(input).val()
      if($(input)[0].hasAttribute("essential"))
        data_object[data_type] = val
      
      else {
        let original = this.originals[data_type]
        if(val != original)
          data_object[data_type] = val
      }
      
    }.bind(this));

    // Lists data
    this.lists.forEach(function(list, i){
      let list_name = $(list.list).attr('list')
      let changes = list.getData()
      if(changes){  
        data_object[list_name+'-add'] = changes['add']
        data_object[list_name+'-remove'] = changes['remove']
      }
    }.bind(this))

    // File Upload is available
    if($(this.form).find('input[type=file]').length){
      let form_data = new FormData()
      for(let key in data_object)
        if(data_object[key] !== undefined)
          form_data.append(key, data_object[key])

      // Files
      $(this.form).find('input[type=file]').each(function(i, input){
        if($(input)[0].files.length)
          form_data.append($(input).attr('name'), $(input)[0].files[0])
      })

      for(let element of form_data.entries()){
        if (element[1] == "undefined"){
          form_data.delete(element[0])
        }
      }
      return form_data
    }

    return data_object;
  }

  update(){
    this.loadOriginals()
    $(this.decision).addClass("hidden")   
  }

}