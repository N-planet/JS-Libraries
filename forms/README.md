# Forms Library Documentaion

## Overview

> This library aims to automate forms validation, track changes and handle AJAX communications
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

The key difference between editable and collection forms is that the editable tracks changes to `existing` fields while collection form allows `addition/removal` of new collections.

<br>

>>>#  **Basic Form**

This form suits the case that you provide an empty form that is to be filled by the user and sent all at once to an api. (ex: login and register)

## Structure
> 1. `Form` element with some attributes
> 2. `Inputs` to be filled with optional validation attributes
> 3. `Alert` container
> 4. `Submit` button

Here is an abstract representation of a basic form

```html
<form id="form_id" form_type="basic" api="path/to/api" callback="function_to_handle_response">
  <input name="field_name">
  <input name="field2_name">
</form>
<anyelement submit="form_id"></anyelement>
<anyelement alert="form_id"></anyelement> // For validation if exists
```

<br>

## Code Walkthrough:

1. form_type: type of form object to be constructed.  
Can be ***basic***, ***editable***, or ***list*** 

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

### Don't Forget to call initializeForms function to run the library on the constructed forms.
`If you need to access the library methods to change behavior of one certain form, initializeForms returns a list of all working forms that you can access the form object and override its methods to match your needs`


<br>

>>> # **Editable Form**

> This form suits the case that you have a filled form that you need to apply some changes on then and send these `changes only` to the api (ex: edit user data)

## Structure
> 1. `Form` element with some attributes
> 2. `toggle_enable` clickable element  
>     Must be in the form presented below `(Not Flexible :( )`
> 3. `Inputs` to be filled with optional validation attributes  
>     Can include file inputs
> 4. `Alert` container
> 5. `decision` container containing `submit` clickable element

Let's see the abstraction

```html
<form id="form_id" form_type="editable" load="optional_function_initializes_inputs" api="path/to/api" callback="function_to_handle_response">
  <p class="edit-btn badge valign" toggle_enable>Edit&nbsp;<i class="bi bi-pencil"></i></p>
  <input name="field_name">
  <input name="field2_name">

  <!-- File input-->
  <input type="file" name="file-input" onchange="$(this).next().html($(this)[0].files[0].name)">
  <button type="button" onclick="$(this).prev().click()">Selected File</button>
  <container decision class="hidden"><anyelement submit="form_id"></container>
</form>
<anyelement submit="form_id"></anyelement>
<anyelement alert="form_id"></anyelement> // For validation if exists
```

### Code Walkthrough

1. form_type="editable"

<br>

> ***Important***  
> This form contains a list storing the original data (originals list) filled and tracks these data to identify changes and send them using AJAX. it contains a method update() that resets the originals then refills them by the currently filled data.  
> It is important to call update() after filling the form to track changes correctly otherwise, it will behave just like the basic form (tracker failure)

<br>

2. load: it is an optional utility that initializes the form by calling a function before setting the originals.  
Example for loading function:

    ```js
    function loadFormBeforeOriginalsAreSet(){
      // Code to fill the form with initial data to be tracked
    }
    ```

3. Form editing is disabled by default till it is enabled. Accordingly, the form must contain an element with the attribute `toggle_enable` that toggles status onclick

4. After changing what you need, you must disable the form again by clicking on `commit` button that finally validates changes and shows the `decision` container. Accordingly, Decision container must be found.

5. Decision container can be any container element with the attribute `decision` which is hidden by default and the library shows it when changes occur.  
This container contains the decision buttons like `submit` (and `reset`, will be implemented soon)

6. Considering file inputs, you should `hide that input` and put a `button` element `just after` it that holds the selected-file data and dealt with as an interface to the input preceeding it

    In short, the library tracks the value stored inside the `<button>` not the input file as it is simpler

<br>


6. This form_type tracks the inputs and determines the changes applited to it, but you might want to `send some inputs even if they are not changed` (ex: name="action" fields).  
In this case just add ***`essential`*** attribute to the input so that the library adds it to the payload even if it is not changed

***Important Note: File inputs cannot be essential***

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
