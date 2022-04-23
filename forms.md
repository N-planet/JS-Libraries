Forms Library Documentaion
===========================

Overview
---------

> This library aims to automate forms validation, track changes and handle AJAX communications

<br/>

Structure
----------

> This library has three types having things in common and other special functionalities

<br/>

Types
======
> These types depend on the form behavior

Here are all forms and their mechanisms :-

* ***Simple Form***:
1. real-time validation 
2. sending all form data by AJAX

* ***Simple-Editable Form***: 
1. real-time validation
2. track changes made to this form 
3. send only these changes

* ***List-Editable Form***:
1. real-time validation
2. track changes made to this form 
3. send only these changes

> The key difference between editable and collection forms is that the editable tracks changes to existing fields while collection form allows addition/removal of new collections.

<br>

How To
=======
>>> **Simple Form**

This form suits the case that you provide an empty form that is to be filled by the user and sent all at once to an api. (ex: login and register)

Here are the procedures to create this form

1. Add [form_type] attribute to specify type of this form
> &nbsp;form_type="simple" 

2. Add [api] attribute to specify the url of the endpoint to communicate with
> &nbsp;api="path/to/api"
3. Add [callback] which is a pointer to some function expecting a response parameter that handles the response and performs some custom logic
> &nbsp;callback="some_function"
4. Callback Function Definition (Normal function that is called **AUTOMATICALLY** after the response is received)
> `function some_function(response){
>  // Handle server response here
> }`
5. Add input fields to the form each with [name] attribute to be tracked and sent by the library
> `<input name="field">`

6. To validate inputs, view the validator's readme

7. The form element must contain a clickable element with [submit=<form_id>] attribute that sends the ajax request
> `<anyelement submit="form_id"></anyelement>`
Note that if anyelement is a button then it must have [type="button"] attribute

8. In order to view validation messages, add anyelement with attribute [alert="form_id"]
> `<anyelement alert="form_id"></anyelement>`

<br>

Don't Forget to call initializeForms function to run the library on the constructed forms
-----

<br>

>>> **Editable Form**

This form suits the case that you have a filled form that you need to apply some changes on it and send these changes to the api (ex: edit user data)

Procedures to create an editable form is the same as that of the simple one with the following changes

1. form_type="editable"

2. Add attribute [load="some_function"] that loads the form data to be set as form's original data. When you apply changes to the form, the library compares the final state to the original one to detect the changes made and send them to the api

3. Form editing is disabled by default till it is enabled. Accordingly, the form must contain an element with the attribute [toggle_enable] that toggles status onclick
> `<p class="edit-btn badge valign" toggle_enable>Edit&nbsp;<i class="bi bi-pencil"></i></p>`

4. After changing what you need, you must disable the form again by clicking on commit button that finally validates changes and shows the decision container. Accordingly, Decision container must be found.

5. This library can track file inputs but it requires that you **hide that input** and **add `<button type="button" onclick="$(this).prev().click()">Selected File</button>`** and update that button on the "change" event of the file input

> `<input type="file" name="field-name" onchange="$(this).next().html($(this)[0].files[0].name)">`
> <br>
> `<button type="button" onclick="$(this).prev().click()">Selected File</button>`

In short, the library tracks the value stored inside the `<button>` not the input file as it is simpler

<br>

Decision Container Contains the submit button only (for now!)

> `<container><anyelement submit="form_id"></container>`

6. This form_type tracks the inputs and determines the changes applited to it, but you might want to send some inputs even if they didn't change (ex: name="action" fields). In this case just add [essential] attribute to the input that neglects changes and just add it directly to the payload

***Important Note: File inputs cannot be essential***

<br>

>>> **Lists**

This feature allows you to add/remove **SIMILAR** collections of data in addition to the other normal editable fields. Every editable form can contain any number of lists

Structure
---------
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
