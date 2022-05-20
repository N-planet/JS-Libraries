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
3. Can Deal With Binaries (file input)

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

>>># **List Form**

This feature allows you to add/remove ***`SIMILAR`*** collections of data in a list and identify the added/removed collections. 

## Features
1. Validation
2. Enable/Disable Editing
3. Lists Tracking
4. AJAX Communication

## How It Works
1. Lists are initialized by having `list` containers that hold collections each with attribute `collection` and contains some fields and a clickable element with the attribute `remove`
2. To add new collection to the list, you must fill the required fields inside the `new` container and click on a button having the attribute `add` that validates the inputs and then calls a function that creates a new collection and appends it to the list
    > The `UI developer` implements the function that creates the collection and appends to the list to `match his needs` and the `library calls this function` as we will see in a moment
3. On form submit, the library compares each list before and after editing and identifies added & removed collections from each list and sends them autonomously to the desired api in the format:
    > list1-added: [list of added collections]  
    > list1-removed: [list of removed collections]  
    > list2-added: [list of added collections]  
    > list2-removed: [list of removed collections]  

## Usage
1. `Initialize` form instance
2. `Save` some data as originals
3. `Enable` editing
4. Remove collections or add new collections to the available lists
5. `Disable` again. and now the library `compares` the current data to the saved version to identify added & removed collections for each list
6. if any changes are there, decision section appears with `confirm` (and `reset` will be implemented soon)


<br>

## Main Components
> 1. `Form` element with some attributes
> 2. `enable` & `disable` clickable elements  
> 3. `List` containers to hold collections each with unique collection_id.  
negative IDs are considered newly added collections
> 4. `new` containers for each list container that builds new collections
> 5. `decision` container containing `submit` clickable element

<br>

## HTML abstraction

```html
<form id="form_id" form_type="list" api="path/to/api" callback="function_to_handle_response">
  <anyelement style="pointer-events: none;" enable>Edit></anyelement>
  <anyelement style="pointer-events: none;" disable>Commit</anyelement>

  <input name="essentialField1" essential value="essentialValue1">
  <input name="essentialField2" essential value="essentialValue2">
  <anyelement list="list1">
    <!-- Add Collections Here -->
  </anyelement>
  <anyelement list="list2">
    <!-- Add Collections Here -->
  </anyelement>
  <container decision class="hidden"><anyelement submit="form_id"></container>
</form>

<anyelement new="list1">
  <!-- Inputs to add collections to list1  -->
  <input name="field1">
  <input name="field2">
  <p alert="list1"></p>
  <button type="button" add="list1" function="add_to_list1">
</anyelement>
<anyelement new="list2">
  <!-- Inputs to add collections to list1  -->
  <input name="field1">
  <input name="field2">
  <p alert="list2"></p>
  <button type="button" add="list2" function="add_to_list2">
</anyelement>
```

## HTML Structure Walkthrough

1. form_type="list"
2. `enable` & `disable` elements
3. `decision` element
4. `essential` fields 
5. `list` container holds collections each having `collection` attribute as we will see later on 
6. `new` containers are used to append new collections to lists
7. `add` button in each `new` container validates the new collection fields and calls the function specified by the attribute `function` that actually adds the collection to the list (implemented by the UI developer to match his needs)

------------------------------------------------------------------------------------

<br>

## JS Abstraction

```js
fillTheFormWithInitialData() // load collections into the lists to be tracked for future changes
let obj = Form.new(form_selector) // create instance and save the current collections as originals

function add_to_list1(){
  // Templating function reads the `new` container fields, creates a new collection in the desired form and then appends it to list1. This desired form might be table row, unordered list item, card, etc...
  
  // This is just an abstract example for a collection
  $("[list=list1]").append(`
    <anyelement collection>
      <anyelement remove>X</anyelement>
      <anyelement name="field1">val in input with name field1 in the 'new' container</anyelement>
      <anyelement name="field2">val in input with name field2 in the 'new' container</anyelement>
    </anyelement>
  `)
}

function add_to_list2(){
  // Re
  $("[list=list2]").append(`
    blah blah blah
  `)
}

function function_to_handle_AJAX_response(response){
  handleResponseHere()

  // Optional section
  if(endpoint_updated_data_successfully())
    obj.update()
}

// Apply Some Changes and Let The Library Do The Remaining :)
```

<br>

## JS Code Walkthrough

1. `fillTheFormWithInitialData()`: Fills the form with initialized data (if not filled)

2. `Form.new(form_selector)`: Creates instance and saves the current collections as originals for each list

3. Implement templating functions for each list that create a new collection from the data entered inside the `new` container and append this collection to the right list

4. `function_to_handle_AJAX_response(response)` as previous

5. If everything done well, you might want to override the saved version of form data by the current one for further modification, just update the instance `obj.update()`

<br>

# Further Reading

## what if I have 10 forms in the same page and i don't want to apply the same steps for all of them

<br>

## `Forms Automation`

```js
let forms
$(document).ready(function(){
  forms = initializeForms() // returns array of all form instances keyed by form_id for future accessibility
})

```

`initializeForms()` searches for all `healthy` forms and runs a `custom preparing function if exists` and then runs `Form.new()`  

`prepare` function is called before initializing each form which does the same as `fillTheFormWithInitialData()` and it can also contain anything you need to do before initializing the library.  

```html
<form id="form_id" form_type="editable" api="path/to/api" callback="function_to_handle_response" prepare="function_to_run_before_initializing_library">
```

```js
function function_to_run_before_initializing_library(){

}
```