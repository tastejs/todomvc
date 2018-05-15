export class Store<T> {

    private static _key = "todos-prest-lib";

    private _data: T;
    private _isLS: boolean = false;

    constructor(data: T) {
        if ("localStorage" in self) {
            try {
                localStorage.getItem(Store._key);
                this._isLS = true;
            } catch (e) {
                console.warn(e);
            }
        }
        if (!this.read()) {
            this.write(data);
        }
    }

    read(): T {
        return this._isLS ?
            JSON.parse(localStorage.getItem(Store._key)) :
            this._data;
    }

    write(data: T): void {
        this._isLS ?
            localStorage.setItem(Store._key, JSON.stringify(data)) :
            this._data = data;
    }

}
