import { Algorithm } from "./algorithm.js";

export class ConfirmationalValidator extends Algorithm{
    /**
     * Class for validating confirmatory inputs
     */
    constructor(input){
        super(input)
        this.original = $("#"+$(this.input).attr('confirm'))
    }

    run(){
        /**
         * Function runs the validation algorithm and returns error code
         */
        let input = $(this.input).val()
        let original = $(this.original).val()
        let fieldName = $(this.original).attr('name').replaceAll('_', ' ')
        fieldName = fieldName.charAt(0).toUpperCase() + fieldName.substr(1) 
        // Check Ranges
        if(input != original){
            this.error(fieldName+" Not Matching")
            return 21 // Not Matching Code
        }
        this.error("")
        return 0; // Fine Status Code

    }
}