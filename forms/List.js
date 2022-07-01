import {Validators} from "../validators/Validators.js";

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

export {List}