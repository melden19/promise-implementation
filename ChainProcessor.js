class ChainProcessor {
    constructor(handlers) {
        this.handlers = handlers;
        this.getIterator = this.handlers[Symbol.iterator];

        if (!this.getIterator) {
            throw new Error('Handlers should be iterable');
        }
    }

    exec(val, finish) {
        const iterator = this.getIterator();
        let currentlyProcessedHandler = 0;

        try {
            const runNextHandler = (val) => {
                currentlyProcessedHandler++;

                const { done, value: handler } = iterator.next();
                const res = handler(val);

                if (done) {
                    finish(res);
                } else {
                    if (res instanceof Promise) {
                        res.then(_res => {
                            runNextHandler(_res);
                        });
                    } else {
                        runNextHandler(res);
                    }
                }
            };

            runNextHandler(val);
        } catch(err) {
            this.processFail(currentlyProcessedHandler, err);
        }
    }

    processFail() {

    }
}

module.exports = ChainProcessor;
