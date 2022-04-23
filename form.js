manager.import(["simpleForm.js", "simpleEditable.js", "listEditable.js"])

class Form {
  static new(form){
    let type = $(form).attr('form_type')
    switch(type){
      case 'simple':
        return new SimpleForm(form)
      case 'simple-editable':
        return new SimpleEditable(form)
      case 'list-editable':
        return new ListEditable(form)
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