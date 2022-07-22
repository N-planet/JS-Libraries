// Interface
class Form {
  static new(form){
    let type = $(form).attr('form_type')

    if($(form)[0].hasAttribute('prepare')){
      let prepare = window[$(form).attr('prepare')];
      if(typeof prepare == 'function')
        prepare()
      else console.log('Prepare Function Specified but Not Defined')
    }

    switch(type){
      case 'basic':
        return new BasicForm(form)
      case 'editable':
        return new EditableForm(form)
      case 'list':
        return new ListForm(form)
      default: 
        throw "Form Creation Error: Unknown form type.\nAvailable types are basic, editable, and list\nTrace <form id='"+$(form).attr('id')+"'>"
    }
  }
}

initializeForms = function(){
  let forms = {}
	$("form[form_type]").each(function(i, form){
		forms[$(form).attr('id')] = Form.new(form)
	});
  return forms
}

// Form Types
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
    return new FormData($(this.form)[0])
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
        value = $(input).next().html()
        
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
      if($(input).attr('type') == 'file'){
        val = $(input).next().html()
        console.log(val, this.originals[key])
      }
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

class ListForm extends BasicForm {
  /**
  * List Form that tracks available collections and extracts added and removed ones then send them to the back-end
  */
  constructor(form){
    /**
    * Form Initialization
    */
    super(form)
    this.toggler = new ToggleableForm(form)
    this.initializeLists()
    this.update()
  }
  
  initializeLists(){
    /**
    * Initialize list objects
    */
    this.lists = []
    $(this.form).find('[list]').each(function(i, list){
      let tmp = new List(list)
      this.lists.push(tmp)
    }.bind(this))
  }
  
  update(){
    /**
    * update list originals
    */
    for(let list of this.lists)
      list.update()
    
    this.toggler.lists = this.lists
    this.toggler.disable()
  }
  
  payload(){
    /**
    * Collect Differences in one JSON Object
    */
    let data_object = {}
    $(this.form).find('input[essential]').each(function(i, input){
      data_object[$(input).attr('name')] = $(input).val()
    })
    
    for(let list of this.lists){
      let list_changes = list.compare()
      data_object = {...data_object, ...list_changes}
    }
    return data_object
  }
  
  run(){
    this.sender.send(this.payload())
  } 
}

// Utilities
class Sender {
  /**
   * Class for form-api communication
   */
  constructor(form){
		this.form = form
		this.form_title = $(form).attr('id')
		this.api = $(form).attr('api')
		if(this.api === undefined)
			console.log("api destination not found for "+this.form_title+" form")
		this.type = $(form).attr('request_type') !== undefined ? $(form).attr('request_type') : 'GET'
		this.callback = window[$(form).attr('callback')]
		if(this.callback === undefined)
			console.log("callback function not determined for "+this.form_title+" form")
	}

  send(data){
		AJAX.ajax({
			url: this.api,
			type: this.type,
			data: data,
			success: function(response){
				response = JSON.parse(response)
				this.callback(response)
			}.bind(this)
		})
  }

  updateForm(){
    console.log(forms[$(this.form).attr('id')])
    forms[$(this.form).attr('id')].update()
  }
}

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

class List {
  /**
   */
  constructor(container){
    this.list = container
    this.title = $(this.list).attr('list')

    this.new = $('[new='+$(this.list).attr('list')+']') // New collection container
    if(!this.new.length)
      console.log(this.title+" new container not found")

    this.add = $('[add='+$(this.list).attr('list')+']') // Add collection btn
    if(!this.add.length)
      console.log(this.title+" adding btn not found")

    this.addFn = window[$(this.add).attr('function')] // Add collection function
    if(this.addFn === undefined)
      console.log(this.title+" adding function not found")

    this.validators = new Validators(this.new)
    this.next_id = -1

    $(this.list).find('[remove]').click(function(){
      $(this).parents('[collection]').remove()
    })

    $(this.add).click(this.applyAdd.bind(this))
  }

  indexOfCollection(collection, array=this.originals){
    let index;
    for(index in array){
      let matching = true;
      // console.log(this.originals[index], collection)
      for(let item in array[index]){
        if(array[index][item] != collection[item]){
          matching = false;
          break;
        }
      }

      if(matching)
        return index;
    }
    return -1;
  }

  showActions(){
    /**
     * Show list edit tools
     */
    $(this.list).find('[remove]').removeClass('hidden')
    $(this.new).removeClass('hidden')
  }

  hideActions(){
    /**
     * Hide list edit tools
     */
    $(this.list).find('[remove]').addClass('hidden')
    $(this.new).addClass('hidden')
  }

  applyAdd(){
    if(this.validators.validateAll()){
      this.addFn()
      $(this.list).find('[collection] [remove]').click(function(i, removeBtn){
        $(removeBtn).parents('[collection]').remove()
      })
      this.next_id--;
    }
  }

  update(){
    /**
     * Identify existing collections before any change
     */
    this.originals = []
    $(this.list).find('[collection]').each(function(i, collection){
      this.originals.push(List.readCollection(collection))
    }.bind(this))
  }

  isChanged(){
    /**
     * check if there are any added or removed collections from the list
     */
    let temp = [...this.originals]
    let changed = false;
    $(this.list).find('[collection]').each(function(i, collection){
      let current = List.readCollection(collection)
      let index = this.indexOfCollection(current, temp)
      if(index != -1) temp.splice(index, 1) // Collection not changed
      else {
        // New collection is added
        changed = true
        return false;
      }
    }.bind(this))
    if(changed || temp.length)
      return true;
    
    return false
  }

  compare(){
    /**
     * Identify changes made to the collections
     */
    let added = []
    let removed = []
    let temp = [...this.originals]
    $(this.list).find('[collection]').each(function(i, collection){
      let current = List.readCollection(collection)
      let index = this.indexOfCollection(current, temp)
      if(index != -1) temp.splice(index, 1) // Collection not changed
      else 
        // New collection is added
        added.push({...List.readCollection(collection)})

    }.bind(this))

    for (let i = 0; i < temp.length; i++)
      // Removed Collections
      removed.push(temp[i])
    
    let result = {}
    result[this.title+'-added'] = added
    result[this.title+'-removed'] = removed

    return result
  }

  static readCollection(collection){
    let result = {}
    $(collection).find('[name]').each(function(i, item){
      let key = $(item).attr('name')
      let value = $(item).text().trim()
      result[key] = value
    }.bind(this))
    return result
  }
}