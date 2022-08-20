const exec = require('child_process').exec;
const wmic = require('@getpid/ms-wmic');
const ms_wmic_not_found_error = 'No Instance(s) Available.';

function get_pids_on_windows(process_name) {
  return new Promise((resolve, reject) => {
    if (!process_name) {
      return reject('process_name is required.');
    }

    wmic.process.get({
      where: {
        name: {
          operator: 'LIKE',
          value: `%${process_name}%`,
        },
      },
      get: ['processId'],
    }, (err, processes, _std_out) => {
      // to maintain consistency with unix, ignore 'not found' errors
      if (err && err.message !== ms_wmic_not_found_error) {
        return reject(err);
      }

      return resolve(extract_pids_from_wmic(processes));
    });
  })
}

function extract_pids_from_wmic(processes) {
  return processes
    .map((process) => parseInt(process && process.ProcessId))
    .filter((pid) => pid && !isNaN(pid));
}

function exec_promise(command) {
  return new Promise((resolve, reject) => {
    exec(command, (err, stdout, _stderr) => {
      if (err) {
        return reject(err);
      }

      resolve(stdout);
    });
  });
}

async function get_pid_on_non_windows(process_name, cb) {
  const ps_results = await exec_promise('ps -eo pid,comm');
  const pids = [];

  for (const ps_result of ps_results.split('\n')) {
    const [ pid_string, ...name_parts ] = ps_result.trim().split(' ');

    if (name_parts.join(' ').includes(process_name)) {
      pids.push(parseInt(pid_string, 10));
    }
  }

  return pids;
}

module.exports = /^win/.test(process.platform) ? get_pids_on_windows : get_pid_on_non_windows;
