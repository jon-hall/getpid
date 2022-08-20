## getpid

Cross-platform PID retrieval (by process name), using `ps` on OSX/Unix and [ms-wmic](https://github.com/mjhasbach/node-ms-wmic) on Windows.

```sh
npm i getpid --save
```

### Usage
```js
const getpid = require('getpid');

async function main() {
  try {
    // get all pids for "node" processes
    const pids = await getpid('node');
  } catch (err) {
    handle_error(err);
    return;
  }

  if (!pids.length) {
    return process_not_found();
  }

  for (const pid of pids) {
    await do_something_with_pid(pid);
  }
}
```
