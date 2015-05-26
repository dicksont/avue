### velm
## Introduction

Velm allows developers to attach JavaScript accessors/bindings on HTML view element state to JavaScript properties. These bindings have the following properties:

- **View-backed**. With most binding libraries, custom JavaScript objects serve as the models for the binding. Velm is different. Bindings in velm are backed by directly by state stored in the view.
- **Two-way directionality.** Bindings are two-way, because velm creates both the getter and the setter for you.
- **Flexible.** A binding can be created to link any supported HTML element to any JavaScript object.
- **Consistent.** Values returned by bindings are always consistent with the state in the view.
- **Light-weight.** Bindings do not incur a maintenance penalty.

### Alternatives

Velm is not for everyone. Some features are not present in Velm. For example, Velm does not have:

- **State change notification**. Velm does not provide mechanisms to notify or respond to state changes. Developers are encouraged to utilize existing DOM event notification or use jQuery callbacks.
- **Templating**. Velm does not provide templating.

If Velm does not meet your needs, then you might want to consider other binding libraries. These will provide a slightly different paradigm that might be better suited for your project. Fully baked binding libraries include:

- Angular.js
- Rivets.js


# Sample Usage

Suppose we have a blank *ui* object:

```javascript
var ui = {}
var div = document.getElementsByTagName('div')[0];
```

## Standard bindings
### HTML
On this *ui* object, we can attach a property that gives us access to the html within that *div*. The code for this very simple:

```javascript
div.bind
  .html
  .to(ui, 'alert');
```

This will allow use to get and set the content of *div* via *ui.content*. For example, we can now do:

```javascript
ui.alert = '<b>Hello world!</b>'
console.log(ui.alert);
```

**.bind.html** can provide an easy way to inject HTML into your page. For this reason, it's use should be both encouraged and discouraged. Be careful, when using this method with request or user-provided data. **bind.html** provides easy access to html, but this can also mean easier access for hackers to inject abritrary scripts.



### Text

Of course, we do provide it's safer cousin **.bind.text**. We can replace the previous html binding with the following:

```javascript
div.bind
  .text
  .to(ui, 'alert');
```

Again, we can set the alert message with a simple assignment. This time, however, the message will be in text.

```javascript
ui.alert = 'Hello world!'
```


### Classes

We can use the classList property to attach the class string on the element to an array of classes in the model. This is easier than it might sound. To do this, we just need to write:

```javascript
div.bind
  .classList
  .to(ui, 'look');
```

And now, if we have Bootstrap configured, we can add in some Bootstrap classes with a simple assignment.

```javascript
ui.look = [ 'btn', 'btn-default' ];
```

Often times, we will be using the existence of a class just to record the switch state. With **bind.hasClass** and **bind.noClass**, we can do both with a direct and an inverse mapping. Here's the direct mapping example:

```javascript
article.bind
  .hasClass('on')
  .to(ui, 'showDate');
```

And here's the inverse mapping equivalent:

```javascript
article.bind
  .noClass('off')
  .to(ui, 'showDate');
```

In both cases, we easily turn on dates with:
```javascript
ui.showDate = true;
```

### Attributes

If an element has a boolean attribute with values are like 'true' or 'false', 'yes' or 'no', we can expose whether or not it has a truthy value with **bind.hasTruthyAttr**. For example, we can bind an iframe's allowTransparency attribute. This exposes its value as a boolean property:


```javascript
    iframe.bind
      .hasTruthyAttr('allowTransparency')
      .to(ui, 'iframeTransparent');
```

And we can do the inverse with **bind.noTruthyAttr**:

```javascript
    iframe.bind
      .noTruthyAttr('allowTransparency')
      .to(ui, 'iframeOpaque');
```

To convert the attribute string, we trim and lowercase it, before a comparison is made. This should produce the following results:

Value      | Truthy?
-----------|--------
undefined  | no
null       | no
''         | yes
'undefined'| yes
'null'     | yes
'yes'      | yes
'no'       | no
'true'     | yes
'false'    | no
'1'        | yes
'0'        | no
*          | yes

Both *hasTruthyAttr* and *noTruthyAttr* provide setters. Their behavior is very different however. With *hasTruthyAttr*, we can assign most values to the property. Velm will do it's best to cast that value to a string before assigning to the attribute.

With *noTruthyAttr*, however assignment of a value to the property will result in the attribute being assigned the 'false' string if that value is JavaScript true and the 'true' string if that value is JavaScript false.

## Specialized bindings
What we've talked about prior, are standard bindings. Velm also has specialized bindings for specialized elements.

### Select elements

The bind property of select elements has an additional property called *selectValue*. Using this property, we can bind the value of this select element to the a boolean variable. For example:

```javascript
    select.bind
      .selectValue
      .to(ui, 'color');
```

### Input elements

Input elements of type text or password and textarea elements, have an additional property called *textValue*. We can use this property to attach variables to the text value of the input box or the textarea. For example, for input elements we can have the following:

```javascript
    input.bind
      .textValue
      .to(ui, 'key');
```

And similarly, for textareas, we can have:

```javascript
    textArea.bind
      .textValue
      .to(ui, 'message');
```

### Radio elements

Input elements of type radio have an additional property called *groupValue*. *groupValue* allows us to attach properties to value of the radio group. It would look as follows:

```javascript
    radio.bind
      .groupValue
      .to(ui, 'input');
```

An error will be thrown if the value assigned to the property is not found in any corresponding radio button's value attribute.

### Checkbox

Input elements of type checkbox have an additional property called *checked*. *checked* allows us to attach a boolean property to the checked state of the checkbox. For example:

```javascript
    checkbox.bind
      .checked
      .to(ui.options, 'showKey');
```
