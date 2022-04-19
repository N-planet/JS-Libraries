Validator Library Documentation
================================

Overview
---------
> This library validates certain input according to the desired criteria and displays errors in an element

<br>

Structure
---------
> Type of validator depends on the nature of the field to be validated

<br>

* ***Regex Validator***

This validator matches the input to a desired regex pattern and displays errors if not matching. This validator also has other features as follows:

1. regex="pattern": Pattern to match

2. Min="min_length": Specify the minimum acceptable length

3. Max="max_length": Specify the maximum acceptable length

4. [must] attribute means that this input must be filled and well-conditioned. 

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;If this attribute is absent then this field can be empty

5. This library assumes that all inputs show tips on hover

<br>

* ***Confirmational Validator***
> Just checks that this field is congruent to another one

Just add confirm="id_of_the_field_to_be_confirmed"
instead of regex="pattern"

> **Fields without both regex and confirm attributes are neglected**