module todoapp.models {
    'use strict';

    export class State {
        constructor(private _repository: repositories.IStateRepository) { }
        getState() {
            return this._repository.getState();
        }

        setState(state: string) {
            this._repository.setState(state);
        }
    }

    export interface IState {
        /**
         * Returns the current view state (i.e. 'all', 'active', or 'completed').
         */
        getState(): string;

        /**
         * Sets the view state for use with the app.
         */
        setState(state: string): void;
    }

    plat.register.injectable('stateModel', State, [repositories.StateRepository]);
}
