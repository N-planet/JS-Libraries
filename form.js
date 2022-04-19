import { SimpleForm } from "./simpleForm.js";
import { EditableForm } from "./editableForm.js";

window.initializeForms =  function(){
  let forms = []
	$("form[form_type]").each(function(i, form){
		forms[$(form).attr('id')] = Form.new(form)
	});
  return forms
}

class Form {
  static new(form){
    let type = $(form).attr('form_type')
    switch(type){
      case 'simple':
        return new SimpleForm(form)
      case 'editable':
        return new EditableForm(form)
      default: 
        throw new ("Form Creation Error: Unknown form type")
    }
  }
}

window.Form = Form