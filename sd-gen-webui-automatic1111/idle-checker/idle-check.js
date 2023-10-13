onUiLoaded(async () => {
  let idleTimer;
  let isIdle = false;
  let instanceId = "INSTANCE_ID";
  let url = 'HEARTBEAT_URL';
  let env = 'ENV_DEV';
  let isDevEnv = false;
  let idleTime = 1000 * 60 * 30; // 30mins
  let sentCount = 0;
  let heartbeatFrequency = 60 * 1000;

  window.onload = resetTimer;
  // DOM Events
  document.onmousemove = resetTimer;
  document.onkeydown = resetTimer;

  // sorry to be so hacky
  if (instanceId === 'INSTANCE'+'_ID') {
    isDevEnv = true;
    instanceId = 'testing-instance-user-00000'
    url = 'http://localhost:3000/api/webui/heartbeat'
    idleTime = 10 * 1000;
    heartbeatFrequency = 1 * 1000;
  }

  function setIdleToTrue() {
    console.log('idle');
    isIdle = true
  }

  function resetTimer() {
    isIdle = false;
    clearTimeout(idleTimer);
    idleTimer = setTimeout(setIdleToTrue, idleTime)
    // 1000 milliseconds = 1 second
  }

  function httpGet(theUrl) {
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", theUrl + '/' + instanceId, false); // false for synchronous request
    xmlHttp.send({});
    return xmlHttp.responseText;
  }

  setInterval(() => {
    if (!isIdle) {
      let result = httpGet(url);
      console.log('send heartbeat: ' + sentCount + 'result: ' + result)
      sentCount++
    }
  }, heartbeatFrequency);
});