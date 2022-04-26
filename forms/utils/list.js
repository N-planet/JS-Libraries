class List {
  /**
   * Class for tracking list of collections and identifying changes made to it (adding and removing)
   * Files in collections are not supported yet
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
    if(!this.addFn === undefined)
      console.log(this.title+" adding function not found")

    this.validators = new Validators(this.new)
    this.next_id = -1

    $(this.list).find('[remove]').click(function(){
      $(this).parents('[collection_id]').remove()
    })

    $(this.add).click(this.applyAdd.bind(this))
  }

  applyAdd(){
    if(this.validators.validateAll()){
      this.addFn()
      $(this.list).find('[collection_id] [remove]').click(function(i, removeBtn){
        $(removeBtn).parents('[collection_id]').remove()
      })
      this.next_id--;
    }
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

  setOriginals(){
    /**
     * Identify existing collections before any change
     */
    this.originals = []
    $(this.list).find('[collection_id]').each(function(i, collection){
      this.originals.push($(collection).attr('collection_id'))
    }.bind(this))
  }

  isChanged(){
    /**
     * check if there are any added or remove collections to the list
     */
    let changed = false
    let temp = [...this.originals]
    $(this.list).find('[collection_id]').each(function(i, collection){
      let collection_id = $(collection).attr('collection_id')
      let index = temp.indexOf(String(collection_id))
      if(index != -1) temp.splice(index, 1) // Collection not changed
      else {
        // New collection is added
        changed = true
        return false
      }
    }.bind(this))
    if(!changed && temp.length)
      changed = true
    
    return changed
  }

  compare(){
    /**
     * Identify changes made to the collections
     */
    let added = []
    let removed = []
    let temp = [...this.originals]
    $(this.list).find('[collection_id]').each(function(i, collection){
      let collection_id = $(collection).attr('collection_id')
      let index = temp.indexOf(String(collection_id))
      if(index != -1) temp.splice(index, 1) // Collection not changed
      else {
        // New collection is added
        added.push({...List.readCollection(collection)})
      }
    }.bind(this))

    for (let i = 0; i < temp.length; i++)
      // Removed Collections
      removed.push({'_id': temp[i]})
    
    return {'add':added, 'remove':removed}
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