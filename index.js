const MyPromise = require('./Promise');

const p = new MyPromise((resolve, reject) => {
   resolve(10);
});

const p2 =  new MyPromise((resolve, reject) => {
    resolve(230)
});

p
    .then((resolve, reject) => {
       return p2
           .then((r) => {
               console.log(r)
               return r;
           })
           .then(() => {
               throw new Error('error')
           })
    })
    .catch((err) => {
        console.error(err)
        return new MyPromise((resolve, reject) => {
            reject( new Error('errrrr'));
        })
    })
    .catch((err) => {
        console.error(err)
        return p2
    })
    .then(console.log)
    .then(() => 'test1')
    .then(() => 'test2')
    .then(() => 'test3')
    .then(() => 'test4')
    .then(() => {
        throw new Error('dasdas')
    })
    .then(r => console.log(r))
    .catch(console.error);
