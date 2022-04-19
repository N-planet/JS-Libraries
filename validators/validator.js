import { RegexValidator } from "./regexValidator.js";
import { ConfirmationalValidator } from "./confirmationalValidator.js";

export class Validator {
    /**
     * Class for generating Validators for validating single input field and display error messages if necessary
     * 
     * Strategy DP
     */
    static new(input){
        if($(input)[0].hasAttribute("regex"))
            return new RegexValidator(input)

        else if ($(input)[0].hasAttribute("confirm"))
            return new ConfirmationalValidator(input)
    }
}