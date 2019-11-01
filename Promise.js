const state = {
    PENDING: 'PENDING',
    FULFILLED: 'FULFILLED',
    REJECTED: 'REJECTED'
};

class MyPromise {
    constructor(callback) {
        this.state = state.PENDING;
        this.result = undefined;
        this.handlers = [];

        process.nextTick(() => {
            try {
                callback(this._resolve.bind(this), this._reject.bind(this));
            } catch(err) {
                this._reject(err);
            }
        });
    }

    then(handler) {
        if (this.state === state.FULFILLED) {
            return new MyPromise(resolve => {
                resolve(handler(this.result));
            });
        }
        return this.wrapCB(handler);
    }

    catch(handler) {
        if (this.state === state.REJECTED) {
            return new MyPromise(resolve => {
                resolve(handler());
            });
        }
        return this.wrapCB(handler, true);
    }

    wrapCB(cb, isCatch = false) {
        const self = this;
        return new MyPromise((resolve, reject) => {
            const wrappedResolve = (val) => {
                const res = cb(val);
                if (res instanceof MyPromise) {
                    res.then(_res => resolve(_res)).catch(err => reject(err));
                } else {
                    resolve(res);
                }
            };

            const resolveHandler = val => {
                if (isCatch) {
                    if (self.state === state.REJECTED) {
                        wrappedResolve(val);
                    } else {
                        resolve(val);
                    }
                } else {
                    if (self.state === state.FULFILLED) {
                        wrappedResolve(val);
                    } else {
                        reject(val)
                    }
                }
            };
            const rejectHandler = (err) => reject(err);


            const handlers = [resolveHandler, rejectHandler];
            self.handlers.push(handlers);
        });
    }

    _resolve(val) {
        if (this.state === state.PENDING) {
            this.state = state.FULFILLED;
            this.result = val;

            process.nextTick(() => {
                this.execHandlers(val);
            });
        }
    }

    _reject(err) {
        if (this.state === state.PENDING) {
            this.state = state.REJECTED;
            this.result = err;


            process.nextTick(() => {
                if (this.handlers.length < 1) {
                    console.log('Unhandled promise rejection: ', err);
                } else {
                    this.execHandlers(err);
                }
            });
        }
    }

    execHandlers(val) {
        if (this.handlers.length > 0) {
            this.handlers.forEach(([resolveHandler, rejectHandler]) => {
                try {
                    resolveHandler(val);
                } catch(err) {
                    rejectHandler(err);
                }
            });
            this.handlers = [];
        }
    }
}

module.exports = MyPromise;
