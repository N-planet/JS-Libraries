class Validator {
    /**
     * Class for validating single input field and display error messages if necessary
     * #TODO : Show allowed characters below each input
     */
    static MUST = 0
    static OPTIONAL = 1
    static CONFIRMATION = 2

    constructor(input, msg){
        /**
         * Constructor determines the type of this field (required, optional or confirmation of another field). Then sets the warning container and start observing the input to provide the best feedback
         */
        this.#input = input
        this.#type = this.#loadType()
        this.setMsgContainer(msg)
        $(this.#input).on('input', function(){
            this.validate()
        })
    }

    #loadType(){
        /**
         * Detect the input filling type (required, optional or confirmational for another input)
         */
        if($(this.#input).hasAttribute("must"))
            return Validator.MUST
        else if ($(this.#input).hasAttribute("optional"))
            return Validator.OPTIONAL
        else if ($(this.#input).hasAttribute("confirm"))
            return Validator.CONFIRMATION
        else throw "Validator Skipped: Input with unknown type"
    }

    validate(){
        /**
         * Test the input field based on the provided criteria in the html tag
         */
        let input = $(this.#input).val()
        if(this.#type == MUST || this.#type == OPTIONAL){
            let regex = new RegExp($(this.#input).attr("regex"))
            if(!regex.test(input)){
                let notAllowed = input.replaceAll(regex, 'lol').replaceAll('lol','').split('').join(', ')
                this.#error("These character are not allowed: "+notAllowed)
                return false
            }
        }
        else if (this.#type == CONFIRMATION){
            let original = $("#"+$(this.#input).attr("confirm")).val()
            if(original != $(this.#input).val()){
                this.#error("Not Matching")
                return false
            }
        }
        return true
    }
    
    #error(message){
        let msgContainer = $(this.#input).next()
        $(msgContainer).html(msg)
        $(msgContainer).removeAttr('hide')
        setTimeout(function (){
			$(msgContainer).attr('hide', 'hide')
		}, 3000);
    }

    setMsgContainer(msg){
        if($(this.#input).next().is("[role=msg]"))
            $(this.#input).next().remove()
        $(this.#input).after(msg)
        $(this.#input).next().attr("role", "msg")
    }
}