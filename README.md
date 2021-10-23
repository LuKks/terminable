# terminable

Terminable resource

![](https://img.shields.io/npm/v/terminable.svg) ![](https://img.shields.io/npm/dt/terminable.svg) ![](https://img.shields.io/github/license/LuKks/terminable.svg)

```javascript
const Terminable = require('terminable');

const terminable = new Terminable();

const timeoutId = setTimeout(function () {
  terminable.delete(timeoutId);
  console.log('long running task');
}, 5000);

const state = terminable.add(timeoutId, function () {
  clearTimeout(timeoutId);
  setTimeout(() => console.log('clean up async'), 500);
});

process.once('SIGINT', function () {
  state.cleanup();
});

console.log('Press CTRL+C to skip 5s timeout');
```

## Install
```
npm i terminable
```

## License
Code released under the [MIT License](https://github.com/LuKks/terminable/blob/master/LICENSE).
