manager.import(["list.js", "editableForm.js"])

class ListEditable extends EditableForm {
  /**
   * List Form that tracks available collections and extracts added and removed ones then send them to the back-end
   */
  constructor(form){
    /**
     * Form Initialization
     */
    super(form)
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
    this.lists.forEach(function(list, i){
      list.update()
    })
    this.disable()
  }

  enableFields(){
    for(let list of this.lists)
      list.enable()
  }

  disableFields(){
    for(let list of this.lists)
      list.disable()
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