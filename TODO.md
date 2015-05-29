## Todo

* Currently, element must be present before binding can be created. Removing that dependency means that bindings can be established before DOMContentLoaded.
* Add support for multi-element selection. This will allow binding to complex
menu structures composed of div's.
* Add support for events and notifications.


## Change API Candidate A

Add a change method that takes in a callback. Callback will be executed when Velm detects the the value of the binding changes. Additional parameter can be used to specify method of detection: i.e. polling or event.

```javascript


document.getElementById('div_showinput').bind
                    .hasClass('on')
                    .to(ui.options, 'showInput')
                    .change(updateSidebar, 'polling');

document.getElementById('div_showkey').bind
                    .hasClass('on')
                    .to(ui.options, 'showKey');
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


## Change API Candidate B

```javascript

showInput = velm('#div_showinput')
  .hasClass('on')
  .to(ui.options, 'showInput')

showKey = velm('#div_showkey')
  .hasClass('on')
  .to(ui.options, 'showKey');

sidebar = velm('#div_sidebar')
  .noClass('off')
  .to(ui.state, 'sidebar');

sidebar.value = (showInput).or(showKey);
sidebar.value = (showInput).and(showKey);

```
