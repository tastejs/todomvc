module todoapp.converters {
    'use strict';

    export class Converters {
        booleanToSelected(condition: boolean) {
            return this.booleanToValue('selected', condition);
        }

        booleanToCompleted(condition: boolean) {
            return this.booleanToValue('completed', condition);
        }

        booleanToState(condition: boolean) {
            return this.booleanToCompleted(condition) || 'active';
        }

        booleanToEditing(condition: boolean) {
            return this.booleanToValue('editing', condition);
        }

        booleanToValue(value: string, condition: boolean) {
            return !!condition ? value : '';
        }
    }

    export interface IConverters {
        /**
         * Returns 'selected' if the condition is true, '' otherwise.
         * 
         * @param condition The boolean condition.
         * @returns {string}
         */
        booleanToSelected(condition: boolean): string;

        /**
         * Returns 'completed' if the condition is true, '' otherwise.
         * 
         * @param condition The boolean condition.
         * @returns {string}
         */
        booleanToCompleted(condition: boolean): string;

        /**
         * Returns 'completed' if the condition is true, 'active' otherwise.
         * 
         * @param condition The boolean condition.
         * @returns {string}
         */
        booleanToState(condition: boolean): string;

        /**
         * Returns 'editing' if the condition is true, '' otherwise.
         * 
         * @param condition The boolean condition.
         * @returns {string}
         */
        booleanToEditing(condition: boolean): string;

        /**
         * Returns value if the condition is true, '' otherwise.
         * 
         * @param value The value to return for a true condition.
         * @param condition The boolean condition.
         * @returns {string}
         */
        booleanToValue(value: string, condition: boolean): string;
    }

    /**
     * Here is how you register an injectable. This injectable is registered as 
     * 'converters'. If another component wants to use this injectable, it simply 
     * adds 'converters' to its dependencies array. This injectable is interesting 
     * because it is obtained as a resource from the Todo view control template. 
     * Resources offer a way of including objects in your view outside of your context.
     */
    plat.register.injectable('converters', Converters);
}
