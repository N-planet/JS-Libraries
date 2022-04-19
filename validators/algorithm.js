export class Algorithm {
  /**
   * Base class for validators
   */
  constructor(input){
      this.input = input
      let name = $(this.input).parents('[new]').attr('new')
      if(!name)
        name = $(this.input).parents('form').attr('id')
      this.msgContainer = $('[alert='+name+']')
      $(this.input).on('input', this.run.bind(this))
  }

  run(){
  }
  
  error(msg){
    if(msg)
      $(this.msgContainer).html(msg).show()
    
    else $(this.msgContainer).html(msg).hide()
  }

  // Extend this class and implement the function run
  
}