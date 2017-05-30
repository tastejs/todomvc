# State Model

## Interface
```javascript
interface State extends Backbone.Model {
}
```

## Control State Model
`ForView` creates and binds `ControlState` to every control found in the target group.

### Interface
```javascript
interface ControlState extends State {
  value:    string,
  valid:    boolean,  // control's value is valid
  touched:  boolean, // control has been manually visited
  dirty:    boolean, // control's value has changed
  badInput: boolean, // indicating the user has provided input that the browser is unable to convert.
  customError: boolean, // indicating the element's custom validity message has been set to a non-empty string by calling the element's setCustomValidity() method.
  stepMismatch: boolean, // indicating the value does not fit the rules determined by the step attribute
  tooLong: boolean, // indicating the value exceeds the specified maxlength for HTMLInputElement or HTMLTextAreaElement objects
  valueMissing: boolean, // indicating the element has a required attribute, but no value.
  rangeOverflow: boolean, // indicating the value is greater than the maximum specified by the max attribute.
  rangeUnderflow: boolean, // indicating the value is less than the minimum specified by the min attribute.
  typeMismatch: boolean, // indicating the value is not in the required syntax
  patternMismatch: boolean, // indicating the value does not match the specified pattern
  validationMessage: string
}
```

## Group State Model
`ForView` creates and binds `GroupState` to every target group.

### Interface
```javascript
interface GroupState extends State {
  valid:    boolean,  // all of group control values are valid
  dirty:    boolean // at least one of group control was manually changed
  validationMessage: string; // Last control validation messages
  validationMessages: [{ // array of control validation messages
    control: string;
    message: string;
  }];
}
```