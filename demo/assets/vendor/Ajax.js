class AJAX {
	/**
	 * Class for customizing AJAX communications by setting default callback functions for ajax requests for improving consistency, centralization, and simplicity.
   * All default callbacks can be simply overriden by specifying new ones on calling Ajax.ajax({...}) just as $.ajax({...})
	 */
	static beforeSend(){
    /**
     * Function that is called before sending ajax requests by default
     */
    console.log("Request is about to start")
	}

	static complete(){
    /**
     * Function that is called after ajax requests are completed by default (called for both success and error status)
     */
    console.log("Request Completed")
	}

	static error(e, options){
    /**
     * Function catches the request failure
     */
    console.log("Fail:", options.data, e.status, e.responseText)
	}

  static success(res){
    /**
     * Function that handles the success status by default
     */
    console.log("Success:", res)
  }

	static ajax(options){
		/**
		 * options must contain url, type, data functions
		 */
		if(options.data instanceof FormData){
			options.contentType = false;
			options.processData = false;
		}

		if(options.beforeSend === undefined)
			options.beforeSend = AJAX.beforeSend

    if(options.success === undefined)
			options.success = function(response){
        AJAX.success(response)
      }

		if(options.error === undefined){
			options.error = function(e){
				AJAX.error(e, options)
			}
		}
    
		if(options.complete === undefined){
			options.complete = AJAX.complete
		}

		$.ajax(options)
	}
}