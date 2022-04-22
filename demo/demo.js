let forms
$(document).ready(function (){
    forms = initializeForms();
})

function simpleTest(response){
    $("#simple-form-result").html(response);
}