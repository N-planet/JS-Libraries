import { Algorithm } from "./algorithm.js";

export class RegexValidator extends Algorithm {
    /**
     * Class for regex inputs validators
     */

    constructor(input){
        super(input)
        this.min = $(input).attr('Min')
        this.max = $(input).attr('Max')
    }

    run(){
        /**
         * Function runs the validation algorithm and return error code
         */
        let input = $(this.input).val().trim()

        // Check Must Attribute
        let fieldName = $(this.input).attr('name').replaceAll('_', ' ')   
        fieldName = fieldName.charAt(0).toUpperCase() + fieldName.substr(1)
        let must = $(this.input)[0].hasAttribute("must")
        
        if(!input){
            // No input provided
            if(must){
                this.error(fieldName+" Is Required")
                return 1 // Missing Required Field Code
            }
            else return 0
        }
        else {
            // Input is provided

            // Check Ranges
            if (input.length < this.min){
                this.error(fieldName+" Min Limit is "+ this.min)
                return 2; // Min Limit Code
            }

            if(input.length > this.max){
                $(this.input).val(input.substr(0, this.max))
                this.error(fieldName+" Max Limit is "+ this.max)
                return 3; // Max limit Code
            }

            // Check Allowed Patterns
            let regex_string = $(this.input).attr("regex")
            let regex = new RegExp(regex_string)
            if(!regex.test(input)){
                this.error(fieldName+" Wrong Pattern<br>Hover over the element to view the allowed pattern")
                return 11
            }
            this.error("")
        }

        return 0 // Fine Error Code
    }
}