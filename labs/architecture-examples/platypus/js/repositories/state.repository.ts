module todoapp.repositories {
    'use strict';

    export class StateRepository implements IStateRepository {
        private stateId = 'state-platypits';

        constructor(private storage: plat.storage.ILocalStorage) { }

        getState(): string {
            return this.storage.getItem(this.stateId) || '';
        }

        setState(state: string) {
            if (state === 'all') {
                state = '';
            }

            this.storage.setItem('state-platypits', state);
        }
    }

    export interface IStateRepository {
        /**
         * Returns the last saved todo view state (i.e. 'all', 'active', or 'completed').
         */
        getState(): string;

        /**
         * Saves the todo view state in storage.
         */
        setState(state: string): void;
    }

    plat.register.injectable('stateRepository', StateRepository, [plat.storage.LocalStorage]);
}
