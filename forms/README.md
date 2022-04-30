# Forms Library Documentaion

## Overview

> This library aims to automate forms validation, changes tracking and AJAX communications
> This library has three types having things in common and other special functionalities
<br/>

## Types

These types depend on the desired form behavior

Here are all forms and their features :-

>***Basic Form***:
>   1. real-time validation 
>   2. sending all form data by AJAX
>
>***Editable Form***: 
>   1. real-time validation
>   2. track changes made to this form 
>   3. send only these changes
>
>***List Form***:
>   1. real-time validation
>   2. track added/removed collections to lists 
>   3. send only added/removed collections

The key difference between editable and collection forms is that the editable tracks changes to `existing` fields while list form allows `addition/removal` of new collections.

<br>

>>>#  **Basic Form**

This form suits the case that you provide an empty form that is to be filled by the user and sent all at once to an api. (ex: login and register)

## Features
1. Real-time Valdiation
2. AJAX Communication
3. Can Deal With Binaries (file inputz)

## Components
> 1. `Form` element with some attributes
> 2. `Inputs` to be filled with optional validation attributes
> 3. `Alert` container
> 4. `Submit` button

## HTML Abstraction

```html
<form id="form_id" form_type="basic" api="path/to/api" callback="function_to_handle_response">
  <input name="field_name" must regex="your_regex"> // required field with some regex pattern
  <input name="field2_name" confirm="field_name"> // required confirmational field
</form>
<anyelement submit="form_id"></anyelement>
<anyelement alert="form_id"></anyelement> // For validation if exists
```

<br>

## HTML Code Walkthrough:

1. form_type: type of form object to be constructed.

2. api: attribute to specify the url of the endpoint to communicate with

3. Callback: some function expecting a response parameter that handles the response and performs some custom logic.  
You must define this callback yourself
    ```js
    function function_to_handle_response(response){
      // ...
    }
    ```

4. name: this attribute is essential for the ajax operation

5. To validate inputs, view the validator's readme

6. There must be a clickable element with `submit=<form_id>` attribute that sends the ajax request  
Note that all buttons inside the form must have the attribute `type=button`

<br>

## JS Abstraction
```js
let form = Form.new(form_selector)
```

<br>

>>> # **Editable Form**

> This form suits the case that you are filling a form programmatically then you apply some changes in some fields only and send the `changed fields only` to the api (ex: edit user data)

## Features
1. Validation
2. Enable/Disable Editing
3. Data Tracking
4. AJAX Communication
5. Can Deal With Binaries (with drawbacks :( )

## How It Works
1. `Initialize` form instance
2. `Save` some data as originals
3. `Enable` editing
4. Make some `changes
5. `Disable` again. and now the library `compares` the current data to the saved version
6. if any changes are there, decision section appears with `confirm` (and `reset` will be implemented soon)

<br>

## Main Components
> 1. `Form` element with some attributes
> 2. `enable` & `disable` clickable elements  
> 3. `Inputs` to be filled with optional validation attributes  
> 4. `Alert` container if validation is found
> 5. `decision` container containing `submit` clickable element

<br>

## HTML abstraction

```html
<form id="form_id" form_type="editable" api="path/to/api" callback="function_to_handle_response">
  <anyelement style="pointer-events: none;" enable>Edit></anyelement>
  <anyelement style="pointer-events: none;" disable>Commit</anyelement>
  <input name="field_name">
  <input name="field2_name">

  <!-- File input-->
  <input type="file" file="selected_file_name" name="file-input" onchange="$(this).attr('file', $(this)[0].files[0].name)">
  <container decision class="hidden"><anyelement submit="form_id"></container>
</form>
<anyelement alert="form_id"></anyelement> // For validation if exists
```

## HTML Structure Walkthrough

1. form_type="editable"

2. Form editing is disabled by default till it is enabled. Accordingly, the form must contain an element with the attribute `enable` that enables the form onclick and another one with the attribute `disable`.

3. After changing what you need, you should disable the form again by clicking on the element with `disable` attribute that finally identifies, and validates changes and shows the `decision` container. Accordingly, Decision container must be found.

4. Decision container can be any container element with the attribute `decision` which is hidden by default and the library shows it when changes occur.  
This container contains the decision buttons like `submit` (and `reset`, will be implemented soon).

5. Considering file inputs, you must add excess attribute `file=selected_file_name` as it is simpler to track.

<br>

6. This form_type tracks the inputs and determines the changes applited to it, but you might want to `send some inputs even if they are not changed` (ex: user credentials).  
In this case just add ***`essential`*** attribute to the input so that the library adds it to the payload even if it is not changed

------------------------------------------------------------------------------------

<br>

## JS Abstraction

```js
let obj = Form.new(form_selector)
fillTheFormWithInitialData()
obj.update()

function function_to_handle_AJAX_response(response){
  // Notice function identifier and callback specified inside the form tag
  handleResponseHere()

  // Optional section
  if(endpoint_updated_data_successfully())
    obj.update()
}

// Apply Some Changes and Let The Library Do The Remaining :)
```

<br>

## JS Code Walkthrough

1. `Form.new(form_selector)` returns an `instance` for the selected form based on the `form_type` attribute.

2. `obj.update()` // update the `saved data` inside the instance (save the current data as originals for future comparison).  
Form.new() `saves current data` automatically, which means you can achieve the same behavior as follows :

```js
fillTheFormWithInitialData() // Fill the form with initialized data (if not filled)
let obj = Form.new(form_selector)
...
```

3. Implement callback function with a response parameter.

4. If everything fone well you want to override the saved version of form data by the current one for further modification, just update the instance `obj.update()`

<br>

>>># **Lists**

This feature allows you to add/remove ***`SIMILAR`*** collections of data in addition to the other normal editable fields. Every editable form can contain any number of lists

# Structure

Any element having the attribute list="name of the list" is treated as a list object and the list attribute determines the key to be sent inside the request. <br>
For example: list="professions" will send {..., professions:[collection1, collection2, ...], ...}
<br>
Note that this list just adds its data to the other form data to be sent so that many lists can work separately in one editable form (Not Tested)

How to
------
Steps to create a list inside my editable form:-

<br>

1. Create an element and set the list attribute

2. Create a container (((inside the list container))) with the attribute [new] that contains fields to add new collections

3. Create a function that visually adds the new collection anywhere (((inside the list container))) but outside the [new] container in the following form:
> `<anyelement collection_id="-1"> <anyelemen2 name="field1"></anyelemen2> <anyelemen3 name="field2"></anyelemen3> <anyelemen4 name="field3"></anyelemen4> (and so on...) </anyelement>`



# Further Reading

## what if I have 10 forms in the same page and i don't want to apply the same steps for all of them

<br>

- Forms Automation
```js
let forms
$(document).ready(function(){
  forms = initializeForms() // returns array of all form instances keyed by form_id for further accessibility
})

function form1_callback(response){
  handleResponseHere()
  if(you_want_to_set_current_data_as_originals())
    forms[form1_id].update()
}

// Write callback for every tracked form

```

`initializeForms()` searches for all `healthy` forms and runs a `custom preparing function if exists` and then runs `Form.new()`  

`prepare` function is called before initializing each form which does the same as `fillTheFormWithInitialData()` and it can contain anything you need to do before initializing the library.  

```html
<form id="form_id" form_type="editable" api="path/to/api" callback="function_to_handle_response" prepare="function_to_run_before_initializing_library">
```

```js
function function_to_run_before_initializing_library(){

}
```
