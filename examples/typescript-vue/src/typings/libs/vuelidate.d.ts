declare module "vuelidate" {

  import _Vue = require("vue");

  /**
   * @module augmentation to ComponentOptions defined by Vue.js
  */
  module "vue/types/options" {

    interface ComponentOptions<V extends _Vue> {
      validations?: ValidationRuleset<{}>;
    }
  }

  module "vue/types/vue" {
    interface Vue {
      $v: Vuelidate<any>;
    }
  }

  /**
   * Represents an instance of validator class at runtime
  */
  export interface IValidator {
    /**
     * Indicates the state of validation for given model. becomes true when any of it's child validators specified in options returns a falsy value. In case of validation groups, all grouped validators are considered.
    */
    readonly $invalid: boolean;
    /**
     * A flag representing if the field under validation was touched by the user at least once. Usually it is used to decide if the message is supposed to be displayed to the end user. Flag is managed manually. You have to use $touch and $reset methods to manipulate it. The $dirty flag is considered true if given model was $touched or all of it's children are $dirty.
     */
    $dirty: boolean;
    /**
     * Convenience flag to easily decide if a message should be displayed. It is a shorthand to $invalid && $dirty.
     */
    readonly $error: boolean;
    /**
     * Indicates if any child async validator is currently pending. Always false if all validators are synchronous.
     */
    $pending: boolean;

    $params: any;

    /**
     * Sets the $dirty flag of the model and all its children to true recursively.
     */
    $touch(): void;
    /**
     * Sets the $dirty flag of the model and all its children to false recursively.
     */
    $reset(): void;
    $flattenParams(): void;
  }

  /**
   * Builtin validators
  */
  interface IDefaultValidators {
    /**
    * Accepts only alphabet characters.
    */
    alpha?: boolean;
    /**
    * Accepts only alphanumerics.
    */
    alphaNum?: boolean;
    /**
    * Checks if a number is in specified bounds. Min and max are both inclusive.
    */
    between?: boolean;
    /**
    * Accepts valid email addresses. Keep in mind you still have to carefully verify it on your server, as it is impossible to tell if the address is real without sending verification email.
    */
    email?: boolean;
    /**
    * Requires the input to have a maximum specified length, inclusive. Works with arrays.
    */
    maxLength?: boolean;
    /**
    * Requires the input to have a minimum specified length, inclusive. Works with arrays.
    */
    minLength?: boolean;
    /**
    * Requires non-empty data. Checks for empty arrays and strings containing only whitespaces.
    */
    required?: boolean;
    /**
    * Checks for equality with a given property. Locator might be either a sibling property name or a function, that will get your component as this and nested model which sibling properties under second parameter.
    */
    sameAs?: boolean;
    /**
    * Passes when at least one of provided validators passes.
    */
    or?: boolean;
    /**
    * Passes when all of provided validators passes.
    */
    and?: boolean;
  }

  type EachByKey<T> = {
    [K in keyof T]: Validator<T[K]>
  }

  /**
   * Holds all validation models of collection validator. Always preserves the keys of original model, so it can be safely referenced in the v-for loop iterating over your data using the same index.
  */
  type Each<T> =
    & { [key: number]: EachByKey<T> }
    & { $trackBy: string | Function }
    & IValidator

  global {
    interface Array<T> {
      /**
       * Holds all validation models of collection validator. Always preserves the keys of original model, so it can be safely referenced in the v-for loop iterating over your data using the same index.
      */
      $each: Each<T> & Vuelidate<T>;
    }
  }

  /**
    * Represents an instance of validator class at runtime
   */
  type Validator<T> = IValidator & IDefaultValidators & Each<T>;

  interface IPredicate {
    (value: any, parentVm?: IValidationRule): boolean | Promise<boolean>
  }

  interface IPredicateGenerator {
    (...args: any[]): IPredicate
  }

  interface IValidationRule {
    [key: string]: ValidationPredicate | IValidationRule | IValidationRule[];
  }

  export type ValidationPredicate = IPredicateGenerator | IPredicate;

  /**
   * Represents mixin data exposed by Vuelidate instance
  */
  export type Vuelidate<T> = {
    [K in keyof T]?: Vuelidate<T[K]> & Validator<T[K]>;
  };

  /**
   * Represents component options used by Vuelidate
  */
  export type ValidationRuleset<T> = {
    [K in keyof T]?: ValidationPredicate | IValidationRule | IValidationRule[] | string[];
  }

  /**
   * Represents Vuelidate mixin data extending a Vue component instance. Have your Vue component options implement this
   * @param {Type} T - The interface or type being used to store model data requiring validation
   * 
   * @example
   * export class Foo implements IVuelidate<IBar> {
   *  data() {
   *      return { bar: { length: 0 } };
   *  }
   *  validations: {
   *      bar: {
   *          length: {
   *              between: between(1,5)
   *          }
   *      }
   *  }
   *  $v: Vuelidate<IBar>;
   * }
  */
  export interface IVuelidate<T> {
    $v: Vuelidate<T>;
  }

  /**
   * Mixin object for supplying directly to components
  */
  export const validationMixin: {
    beforeCreate(): void;
  };

  /**
   * Vuelidate function that creates a validator directly, given a model, and a set of rules
  */
  export const validateModel: {
    <T>(model: T, validations: ValidationRuleset<T>): IVuelidate<T>;
  }

  /**
   * Vue plugin object
  */
  export function Validation(Vue: typeof _Vue): void;

  export default Validation;
}


declare module "vuelidate/lib/validators" {

  import { ValidationPredicate } from "vuelidate";

  /**
   * Accepts only alphabet characters.
   */
  function alpha(value: any): boolean;
  /**
   * Accepts only alphanumerics.
   */
  function alphaNum(value: any): boolean;
  /**
   * Checks if a number is in specified bounds. Min and max are both inclusive.
   */
  function between(min: number, max: number): (value: any) => boolean;
  /**
   * Accepts valid email addresses. Keep in mind you still have to carefully verify it on your server, as it is impossible to tell if the address is real without sending verification email.
  */
  function email(value: any): boolean;
  /**
   * Requires the input to have a maximum specified length, inclusive. Works with arrays.
  */
  function maxLength(max: number): (value: any) => boolean;
  /**
   * Requires the input to have a minimum specified length, inclusive. Works with arrays.
   */
  function minLength(min: number): (value: any) => boolean;
  /**
   * Requires non-empty data. Checks for empty arrays and strings containing only whitespaces.
  */
  function required(value: any): boolean;
  /**
   * Checks for equality with a given property. Locator might be either a sibling property name or a function, that will get your component as this and nested model which sibling properties under second parameter.
  */
  function sameAs(locator: string): (value: any, vm?: any) => boolean;
  /**
   * Passes when at least one of provided validators passes.
   */
  function or(...validators: ValidationPredicate[]): () => boolean;
  /**
   * Passes when all of provided validators passes.
   */
  function and(...validators: ValidationPredicate[]): () => boolean;
}