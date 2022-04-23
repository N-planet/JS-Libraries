class List {
  /**
   * Class for tracking list of collections and identifying changes made to it (adding and removing)
   * Files in collections are not supported yet
   */
  constructor(container){
    this.list = container
    this.title = $(container).attr('id')
    
    this.new = $('[new='+$(this.list).attr('list')+']') // New collection container
    this.validators = new Validators(container)

    this.add = $('[add='+$(this.list).attr('list')+']') // Add collection btn
    this.addFn = window[$(this.add).attr('function')] // Add collection function
    $(this.add).click(function(){
      if(this.validators.validateAll()){
        let id = "new-"+String(++this.count_added)
        this.addFn(id)
      }
    }.bind(this))
  }

  findInOriginals(collection_id){
    let index = 0
    for(let id in this.originals){
      if(id == collection_id)
        return index
      index++
    }
    return -1
  }

  enable(){
    $(this.list).find('[remove]').removeClass('hidden')
    $(this.new).removeClass('hidden')
  }

  disable(){
    $(this.list).find('[remove]').addClass('hidden')
    $(this.new).addClass('hidden')
  }

  update(){
    /**
     * Identify existing collections before any change
     */
    this.originals = []
    $(this.list).find('[collection_id]').each(function(i, collection){
      this.originals.push($(collection).attr('collection_id'))
    }.bind(this))
    this.count_added = 0
  }

  isChanged(){
    let changed = false
    $(this.list).find('[collection_id]').each(function(i, collection){
      let collection_id = $(collection).attr('collection_id')
      let index = this.findInOriginals(collection_id)
      if(index != -1) this.originals.splice(index, 1) // Collection not changed
      else {
        // New collection is added
        changed = true
        return false
      }
    }.bind(this))
    if(!changed && this.originals.length){
      changed = true
    }
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
      let index = this.findInOriginals(collection_id)
      if(index != -1) this.originals.splice(index, 1) // Collection not changed
      else {
        // New collection is added
        added.push({...List.readCollection(collection)})
      }
    }.bind(this))

    for (let i = 0; i < this.originals.length; i++) {
      // Removed Collections
      removed.push({'_id': this.originals[i]})
    }
    this.originals = [...temp]
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