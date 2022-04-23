let forms
$(document).ready(function (){
    forms = initializeForms();
})

function displayFile(input){
    let filename = $(input)[0].files[0].name
    $(input).next().html(filename)
}


// Library requirements (Customize as you need)
function simpleTest(response){
    /**
     * Callback
     */
    $("#simple-form-result").html(response);
}

function loadForm2(){
    /**
     * Fill in the initialized version of the editable form data
     */
    let count = 1;
    $("#form2 input[name]").each(function(i, input){
        if($(input).attr('type') == 'file')
            $(input).next().html('field'+count)
        else
            $(input).val('field'+count)
        count++
    })
}

function editableTest(response){
    /**
     * Callback
     */
    $("#editable-form-result").html(response);
    let form_id = $(this.form).attr('id')
    forms[form_id].update()
}

function loadForm3(){
    /**
     * Fill in the initialized version of the list form data
     */
     for(let list = 1; list < 4; list++)
        for(let collection = 1; collection < 4; collection++)
            $("#form3 [list=list"+list+"]").append(`
                <div collection_id=`+collection+`>
                    <span>Collection `+collection+`: </span>
                    <span name="field1">val`+collection+`</span>
                    <span name="field2">val`+(2*collection)+`</span>
                    <span name="field3">val`+(3*collection)+`</span>
                </div>
            `)
}

function addToList1(){
    $("[new=list1] [name]").each(function(i, input){
        $("[list=list1]").append(`
        <span name="`+$(input).attr('name')+`">`+$(input).val()+`</span>
        `)
    })
}

function addToList2(){
    $("[new=list2] [name]").each(function(i, input){
        $("[list=list2]").append(`
        <span name="`+$(input).attr('name')+`">`+$(input).val()+`</span>
        `)
    })
}

function addToList3(){
    $("[new=list3] [name]").each(function(i, input){
        $("[list=list3]").append(`
        <span name="`+$(input).attr('name')+`">`+$(input).val()+`</span>
        `)
    })
}