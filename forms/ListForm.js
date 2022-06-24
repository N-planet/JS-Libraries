import {BasicForm} from "./BasicForm.js";
import {ToggleableForm} from "./ToggleableForm.js"
import {List} from "./List.js";

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

export {ListForm}