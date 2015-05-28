## Todo

* Currently, element must be present before binding can be created. Removing that dependency means that bindings can be established before DOMContentLoaded.
* Add support for multi-element selection. This will allow binding to complex
menu structures composed of div's.
* Add support for events and notifications.


## Proposed Change API

Add a change method that takes in a callback. Callback will be executed when Velm detects the the value of the binding changes. Additional parameter can be used to specify type of detection: i.e. pollling or event.

```javascript


var inputBinding = document.getElementById('div_showinput').bind
                    .hasClass('on')
                    .to(ui.options, 'showInput')
                    .change(updateSidebar, 'polling');

var keyBinding = document.getElementById('div_showkey').bind
                    .hasClass('on')
                    .to(ui.options, 'showInput');
                    .change(updateSidebar);


function updateSidebar() {
  var sidebar = document.getElementById('div_sidebar');

  if (ui.options.showInput || ui.options.showKey) {
    sidebar.classList.remove('off');
  } else {
    sidebar.classList.add('off');
  }
}

```
