import { Validator } from "./validators/validator.js";

export class List {
  /**
   * Class for handling operations on list of collections (tracking, validations and status toggling)
   */
  constructor(container){
    this.list = container // colections container
    this.collections = [] // Current collections (IDs only)
    this.new = $('[new='+$(this.list).attr('list')+']') // New collection container
    $(this.new).addClass('hidden')
    this.add = $('[add='+$(this.list).attr('list')+']') // Add collection btn
    $(this.add).click(this.addCollection.bind(this))
    this.show = $(this.add).attr('show')
    $(this.list).find('[remove]').addClass('hidden')

    this.validators = []
    this.initializeValidators()
    this.loadCollections()
  }

  loadCollections(){
    /**
     * Find all current collections found
     */
    this.collections = []
    $(this.list).find("[collection_id]").each(function(i, collection){
      let collection_id = $(collection).attr('collection_id')
      this.collections.push(collection_id)
    }.bind(this))
  }

  initializeValidators(){
    /**
     * Function creates a validator instance for every input
     */
    $(this.new).find("[name]").each(function(i, input){
      let validator = Validator.new(input)
      if(validator)
        this.validators.push(validator)
    }.bind(this))
  }

	validateAll(){
		for(let validator of this.validators){
			if(validator.run())
				return false
		}
		return true
	}


  enable(){
    /**
     * Enable addition/removal of collections
     */
    $(this.new).removeClass('hidden')
    $(this.list).find('[remove]').removeClass('hidden')
  }

  disable(){
    /**
     * Enable addition/removal of collections
     */
    $(this.new).addClass('hidden')
    $(this.list).find('[remove]').addClass('hidden')
  }

  getData(){
    /**
     * Identify changes made to the collections
     */

    let added = []
    let removed = []
    let temp = [...this.collections]
    $(this.list).find('[collection_id]').each(function(i, collection){
      let collection_id = $(collection).attr('collection_id')
      let index = this.findInOriginals(collection_id)
      if(index != -1) this.collections.splice(index, 1) // Collection not changed
      else {
        // New collection is added
        added.push({...this.readCollection(collection)})
      }
    }.bind(this))

    for (let i = 0; i < this.collections.length; i++) {
      // Removed Collections
      removed.push({'_id': this.collections[i]})
    }
    this.collections = [...temp]
    return {'add':added, 'remove':removed}
  }

  findInOriginals(collection_id){
    for (let i = 0; i < this.collections.length; i++) {
      if(collection_id == this.collections[i])
        return i
    }
    return -1
  }

  readCollection(collection){
    let result = {}
    $(collection).find('[name]').each(function(i, item){
      let key = $(item).attr('name')
      let value = $(item).text().trim()
      result[key] = value
    }.bind(this))
    return result
  }

  addCollection(){
    if(this.validateAll()) window[this.show]()
  }
}