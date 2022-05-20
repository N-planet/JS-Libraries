class Validator {
    /**
     * Single input validator
     * Error Codes:
     *  0: Healthy
     *  1: Missing Required Field
     *  2: Min Limit Violated
     *  3: Max Limit Violated
     *  4: Regex Pattern Not Matching
     *  5: Not Matching (For Confirmational)
     */

    static new(input){ 
        /**
         * Validator Factory
         */
        if($(input)[0].hasAttribute("regex") || $(input)[0].hasAttribute("confirm"))
          return new Validator(input)
    }

    constructor(input){
        /**
         * Validator Initialization
         */
        this.input = input
        if($(this.input)[0].hasAttribute('confirm')){
            this.original = $(this.input).parents('form').find("input[name="+$(this.input).attr("confirm")+"]")
            if(!this.original.length)
                throw "Confirmational Validation Failed: Original Input Not Found For Input "+$(this.input).attr('confirm')
            this.fieldName = $(this.input).attr('confirm') + " confirmation"
        }
        else{
            if(!$(this.input)[0].hasAttribute('name'))
                throw "Validation Creation Error: input has no attribute name inside form "+$(this.input).parents('form').attr('id')
            
            this.fieldName = $(this.input).attr('name').replaceAll('_', ' ')
            this.fieldName = this.fieldName.charAt(0).toUpperCase() + this.fieldName.substr(1)
        }
    }

    run(){
        /**
         * Validation
         * Error Codes:
         *  0: Healthy
         *  1: Missing Required Field
         *  2: Min Limit Violated
         *  3: Max Limit Violated
         *  4: Regex Pattern Not Matching
         *  5: Not Matching (For Confirmational)
         */
        let input = $(this.input).val().trim()
        if($(this.input)[0].hasAttribute("regex")){ // Regex
            let must = $(this.input)[0].hasAttribute("must")      
            this.min = $(this.input).attr('Min')
            this.max = $(this.input).attr('Max')

            // Check Must Attribute
            if(!input){ // No input provided
                if(must)
                    return 1 // Missing Required Field Code
            }
            else { // Input is provided
                if (input.length < this.min)
                    return 2; // Min Limit Code
    
                if(input.length > this.max){
                    $(this.input).val(input.substr(0, this.max))
                    return 3; // Max limit Code
                }
    
                // Check Allowed Patterns
                let regex_string = $(this.input).attr("regex")
                let regex = new RegExp(regex_string)
                if(!regex.test(input))
                    return 4 // Regex Criteria Violated
            }
        }

        else if($(this.input)[0].hasAttribute("confirm")){
            // Confirmational Validator
            if(input != $(this.original).val()){
                return 5 // Not Matching Code
            }
        }

        return 0 // Fine Error Code
    }
}