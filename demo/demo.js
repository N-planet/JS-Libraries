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
    $("#editable-form-result").html(response);
    forms[$(this.form).attr('id')].update()
}

function loadForm3(){
    /**
     * Fill in the initialized version of the list form data
     */
     for(let list = 1; list < 4; list++)
        for(let collection = 1; collection < 4; collection++)
            $("#form3 [list=list"+list+"]").append(`
                <div collection_id=`+collection+`>
                    <button type="button" remove>X</button>
                    <span>Collection: </span>
                    <span name="field1">val`+collection+`</span>
                    <span name="field2">val`+(2*collection)+`</span>
                    <span name="field3">val`+(3*collection)+`</span>
                </div>
            `)
}

function addToList1(){
    /**
     * Add new collection to list 1
     * then add the collection elements to it
     */
    $("[list=list1]").append(`
        <div collection_id="`+this.count_added+`"><button type="button" remove>X</button> Collection: </div>
    `)
    $("[new=list1] [name]").each(function(i, input){
        $("[list=list1] [collection_id]").last().append(`
        <span name="`+$(input).attr('name')+`">`+$(input).val()+`</span>
        `)
    })
    this.count_added++;
}

function addToList2(){
    /**
     * Add new collection to list 2
     * then add the collection elements to it   
     */
    $("[list=list2]").append(`
        <div collection_id="`+this.count_added+`"><button type="button" remove>X</button> Collection: </div>
    `)
    $("[new=list2] [name]").each(function(i, input){
        $("[list=list2] [collection_id]").last().append(`
            <span name="`+$(input).attr('name')+`">`+$(input).val()+`</span>
        `)
    })
    this.count_added++;
}

function addToList3(){
    /**
     * Add new collection to list 3
     * then add the collection elements to it
     */
    $("[list=list3]").append(`
        <div collection_id="`+this.next_id+`"><button type="button" remove>X</button> Collection: </div>
    `)
    $("[new=list3] [name]").each(function(i, input){
        $("[list=list3] [collection_id]").last().append(`
        <span name="`+$(input).attr('name')+`">`+$(input).val()+`</span>
        `)
    })
}

function listTest(response){
    /**
     * List Form Callback
     */
    $("#list-form-result").html(response);
    forms[$(this.form).attr('id')].update()
}