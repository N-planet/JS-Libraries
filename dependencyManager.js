class Manager{
  /**
   * Manages importing scripts and components
   * Singleton
   * 
   * Usage:
   * 1. set the static variable root to match your needs
   */
  static root = "/JS-Libraries" // default reference path that impotings
  constructor(){
    this.dependencies = []
  }

  #dependencyExists(path){
    return this.dependencies.includes(path)
  }

  #importJs(path){
    $.ajax({
      async:false,
      url:path,
      dataType:"script",
      cache:true,
      error: function(e){
        throw "Importing "+path+" Failed";
      }
    })
  }

  #importCss(path){
    $("head").append(
      `<link rel="stylesheet" href="`+path+`">`
    )
  }

  #importHtml(path){
    let fileIdentifier = path.substr(path.lastIndexOf('/')+1).split('.')[0]
    let place = $("#"+fileIdentifier+"-component");
    if($(place).length){
      $(place).load(path)
    }
    else {
      throw "Importing "+path+" Failed: container not found";
    }
  }

  importFile(dependency, reference=Manager.root){
    /**
     * Importing Single File (if not imported previosuly)
     * @param dependency: path to file
     * @param reference: optional param overrides the default root path
     */
    if(reference.length)
      dependency = reference+'/'+dependency
    
    if(this.#dependencyExists(dependency))
      return

    switch(dependency.split('.')[1]){
      case "js":
        this.#importJs(dependency)
        break;

      case "css":
        this.#importCss(dependency)
        break;
      
      case "html":
        this.#importHtml(dependency)
        break;
    }

    this.dependencies.push(dependency)
  }

  importComponent(component, reference=Manager.root){
    /**
     * Importing Componenet Files
     * @param string component: component name
     * @param reference: optional param overrides the default root path
     */
    this.importFile("components/"+component+"/"+component+".html", reference)
    this.importFile("components/"+component+"/"+component+".css", reference)
    this.importFile("components/"+component+"/"+component+".js", reference)
  }

  async importModule(path){
    await import(path).then((module)=>{
      this.dependencies.push(path)
      console.log("Imported")
    });
  }

  import(dependencies, reference=Manager.root){
    /**
     * Imports multiple files and components at once
     * @param dependencies: list of paths for files and component names
     * @param reference: optional param overrides the default root path
    */
    let count = 0
    for(let dependency of dependencies){
      if(dependency.indexOf('.') == -1)
        this.importComponent(dependency, reference)
          
      else if(dependency[0] == '.' || dependency[0] == '/')  
        this.importModule(dependency)

      else
        this.importFile(dependency, reference)
      
      count++;
    }
  }
}