manager.import(["forms/basicForm.js", "forms/editableForm.js", "forms/listForm.js"])

class Form {
  static new(form){
    let type = $(form).attr('form_type')
    switch(type){
      case 'basic':
      case 'simple':
        return new BasicForm(form)
      case 'editable':
        return new EditableForm(form)
      case 'list':
        return new ListForm(form)
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