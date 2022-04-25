manager.import(["forms/utils/list.js", "forms/utils/toggleableForm.js"])

class ListForm extends ToggleableForm {
  /**
   * List Form that tracks available collections and extracts added and removed ones then send them to the back-end
   */
  constructor(form){
    /**
     * Form Initialization
     */
    super(form)
    this.initializeLists()
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

    this.update()
  }

  update(){
    /**
     * update list originals
     */
    for(let list of this.lists){
      list.setOriginals()
    }
    this.disable()
  }

  enableFields(){
    for(let list of this.lists)
      list.showActions()
  }

  disableFields(){
    for(let list of this.lists)
      list.hideActions()
  }

  isChanged(){
    /**
     * update this.isChanged
     */
    this.changed = false
    for(let list of this.lists)
      if(list.isChanged())
        this.changed = true
  }

  compare(){
    /**
     * Collect Differences in one JSON Object
     */
    let data_object = {}
    $(this.form).find('input[essential]').each(function(i, input){
      data_object[$(input).attr('name')] = $(input).val()
    })

    for(let list of this.lists)
      data_object[list.title] = list.compare()
    return data_object
  }

  run(){
    this.ajax.send(this.compare())
  }

}