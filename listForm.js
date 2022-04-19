manager.import(["assets/js/utils/list.js", "assets/js/utils/ajax.js"])

class ListForm {
  /**
   * List Form that tracks available collections and extracts added and removed ones then send them to the back-end
   */
  constructor(form){
    /**
     * Form Initialization
     */
    this.form = form
    initializeLists()
    this.ajax = new AJAX(form)
		this.submitBtn = $("[submit="+$(this.form).attr('id')+"]")
		$(this.submitBtn).attr('type', 'button')
		$(this.submitBtn).click(this.run.bind(this))
  }

  initializeLists(){
    this.lists = []
    $(this.form).find('[list]').each(function(i, list){
      let tmp = new List(list)
      this.lists.append(tmp)
    })
  }

  compare(){
    let data_object = {}
    for(let list of this.lists)
      data_object[list.title] = list.compare()
    return data_object
  }

  run(){
    this.ajax.send(this.compare())
  }

}