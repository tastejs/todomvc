# FormView Module

This module is developed to simplify working forms. What do we usually do with Backbone? We subscribe for control change events and write view methods that update view as its state changes. `FormView` does it for us. It extracts the groups marked in the template with `data-ng-group="groupName"`.
Within every found group it collects all the available controls `input[name], textarea[name], select[name]` and binds it to state models respectively. So when state of a control/group changes (e.g. validation fails) that gets available within the template immediately.

For example we have a template:
```html
<form data-ng-group="foo">
  <input name="bar" type="email" required />
  <div data-ng-if="!foo.bar.valid">
    Invalid value
  </div>
</form>
```
Until anything typed in to the input, it's invalid according to `required` restrictor. Thus template variable `foo.bar.valid` is `false` and the template shows container with error message. If we typed in a wrong value for email address `foo.bar.valid` again has 'false' and we can see the message. We can also access the sate of the group as `foo.group`. See below Control/Group State Model Interface for available properties.

## Interface

```javascript
interface FormView extends View {
  // retrieve group data, e.g. for sending to storage
  getData( groupName: string ): ngBackbone.DataMap<string | boolean>;

  // reset all state models, run it after form.reset()
  reset( groupName: string ): void;

  // emulate user input for unit-testing
  testInput( pointer: string, value: any ): Promise<any>;
}
```

* [State Model](./form/state.md)

## Form Validation

`FormView` subscribes for "input", "change" and "focus" events on the found controls. Whenever an event fires it updates the `ControlState`
based on actual [element ValidityState](https://www.w3.org/TR/html5/forms.html#the-constraint-validation-api) plus validity state of specified custom validators.
If the state model reports that `valid` or `touched` property changed, `FormView` updates the `GroupState`.

`FormView` contains following built-in validators:

* `badInput` - `true` if the user has provided input that the browser is unable to convert.
* `customError` - `true`  if the element has been set custom validity message (e.g. by as custom validator)
* `stepMismatch` - `true` if the control has `step` (type=number) attribute and its value does not fit the rules determined by the step attribute
* `tooLong` -  `true` if the control has `maxLength` attribute and its value exceeds the specified maxlength
* `valueMissing` - `true`  if the control has `required` attribute and an empty value
* `patternMismatch` - `true`  if the control has `pattern` attribute and a value that does not match the specified pattern
* `rangeOverflow` - `true`  if the control has `max` (type=number) attribute and a value greater than specified in the attribute
* `rangeUnderflow` - `true`  if the control has `min` (type=number) attribute and a value less than specified in the attribute
* `typeMismatch` - `true`  if the control has type `email`, `tel` or `url` and a value that does not match the corresponding type

If any of validations fails `ControlState.validationMessage` receives the corresponding error message.
> NOTE: Some user agents (e.g. PhantomJS) doesn't update `el.validationMessage`, therefore in such case it cannot be updated in the `ControlState`.

Examples:

```html
<input name="name"  required />
<div data-ng-if="hero.name.valueMissing">
  Name is required
</div>
..
<input name="age"  min="18" max="100" />
<div data-ng-if="hero.age.valueMissing.rangeOverflow || hero.age.valueMissing.rangeUnderflow">
  <span data-ng-text="hero.age.validationMessage"></span>
</div>

```

## Example 1: Showing custom validation message per a control

```javascript
import { Component, FormView } from "ng-backbone/core";


@Component({
  el: "ng-hero",
  events: {
    "submit form": "onSubmitForm"
  },
  template: `
    <form data-ng-group="hero" >

    <label for="name">Name
      <input name="name" type="text" required >
    </label>
    <div data-ng-if="!hero.name.valid">
      Name is invalid <i ng-data-text="hero.name.validationMessage"></i>
    </div>

    <label for="power">Hero Power
      <select id="power" name="power" class="form-control" required>
        <option>Superhuman strength</option>
        <option>Flight</option>
        <option>Freezing breath</option>
      </select>
    </label>

    <div data-ng-if="!hero.power.valid">
      Power is invalid <i ng-data-text="hero.name.validationMessage"></i>
    </div>

    <button type="submit" data-ng-prop="'disabled', !hero.group.valid">Submit</button>

    </form>

`
})

export class HeroView extends FormView {

  initialize() {
    this.render();
  }

  onSubmitForm( e:Event ){
    e.preventDefault();
    alert( "Form submitted" );
  }

}

```

## Example 2: Showing all group validation messages as a list
```javascript
import { Component, FormView } from "../ng-backbone/core";

@Component({
  el: "ng-hero",
  template: `
    <form data-ng-group="hero" >
      <div class="alert alert-danger" data-ng-if="hero.group.dirty && !hero.group.valid">
        <p data-ng-for="let dto of hero.group.validationMessages">
          <b data-ng-text="dto.control"></b>: <i data-ng-text="dto.message"></i>
        </p>
      </div>
      <div class="form-group">
        <label for="name">Name</label>
        <input id="name" name="name" type="text" class="form-control" required pattern="[A-Za-z]{3,12}">
      </div>
      <button type="submit" class="btn btn-default" data-ng-prop="'disabled', !hero.group.valid">Submit</button>
    </form>
`
})

export class HeroView extends FormView {
}
```


## Custom Type Validation

You can attach to a control one or many custom validators by using `data-ng-validate` attribute:

```javascript
@Component({
  el: "ng-hero",
  formValidators: {
    hexcolor( value: string ): Promise<void> {
        let pattern = /^#(?:[0-9a-f]{3}){1,2}$/i;
        if ( pattern.test( value  ) ) {
          return Promise.resolve();
        }
        return Promise.reject( "Please enter a valid hexcolor e.g. #EEEAAA" );
      }
  },
  template: `
    <form data-ng-group="hero" >
      <input name="color" data-ng-validate="hexcolor" />
    </form>

`
})

```

Multiple validators can be specified separated by a comma:
```html
<input name="color" data-ng-validate="foo, bar, baz" />
```



Every validator is a callback that returns a Promise. If validation passes the Promised resolves. Otherwise it rejects with error message passed as an argument


## Remote Validation

You can also have a validation that happens on the server.

```javascript

import { Component, FormView, FormValidators, Debounce } from "ng-backbone/core";

class CustomValidators extends FormValidators {
   @Debounce( 350 )
   name( value: string ): Promise<void> {
      return NamerModel.fetch();
   }
}

@Component({
  el: "ng-hero",
  formValidators: CustomValidators,
  template: `
    <form data-ng-group="hero" >
      <input name="color" data-ng-validate="hexcolor" />
    </form>

`
})

```

`FormView` class the validator with every input event that is by default debounced 100ms. For validation via XHR request you may need greater debounce. We use `@Debounce()` validator to set it.