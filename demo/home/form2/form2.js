forms['form2'] = Form.new($("#form2"))

function loadForm2(){
  /**
  * Fill in the initialized version of the editable form data
  */
  let count = 1;
  $("#form2 input[name]").each(function(i, input){
    if($(input).attr('type') == 'file'){
      $(input).next().html('field'+count) // for display
      $(input).attr('file', 'field'+count) // for library
    }
    else
    $(input).val('field'+count) // for library
    count++
  })
}

function editableTest(response){
  /**
  * Callback
  */
  $("#editable-form-result").html(JSON.stringify(response));
  this.updateForm()
}