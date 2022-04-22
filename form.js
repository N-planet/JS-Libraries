manager.import(["simpleForm.js", "editableForm.js"])

class Form {
  static new(form){
    let type = $(form).attr('form_type')
    switch(type){
      case 'simple':
        return new SimpleForm(form)
      case 'editable':
        return new EditableForm(form)
      default: 
        throw "Form Creation Error: Unknown form type"
    }
  }
}

function initializeForms(){
  let forms = []
	$("form[form_type]").each(function(i, form){
		forms[$(form).attr('id')] = Form.new(form)
	});
  return forms
}