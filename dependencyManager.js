class Manager{
  /**
   * Manages importing scripts
   * Singleton
   */
  constructor(){
    let folders  = $("script[src]").last().attr('src').split('/')
    this.root = folders.slice(0, folders.length - 1).join('/') 
    this.dependencies = []
  }

  import(dependencies){
    for(let dependency of dependencies){
      if(!this.dependencyExists(dependency)){
        if(this.root.length)
          dependency = this.root+"/"+dependency
        $.ajax({
          async:false,
          url:dependency,
          dataType:"script",
          cache:true
        })
        let filename = dependency.substr(dependency.lastIndexOf('/')+1)
        this.dependencies.push(filename)
      }
    }
  }

  dependencyExists(path){
    let filename = path.substr(path.lastIndexOf('/')+1)
    return this.dependencies.includes(filename)
  }
}

var manager = new Manager()