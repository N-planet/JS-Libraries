class Manager{
  /**
   * Manages importing scripts
   * Singleton
   */
  constructor(){
    this.dependencies = []
  }

  import(dependencies){
    for(let dependency of dependencies){
      if(!this.dependencyExists(dependency)){
        $.ajax({
          async:false,
          url:dependency,
          dataType:"script"
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