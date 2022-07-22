forms['form1'] = Form.new($("#form1"))

// Form1 Callback (Customize to match your needs)
function simpleTest(response){
  /**
   * Callback
   */
  $("#simple-form-result").html(JSON.stringify(response));
}