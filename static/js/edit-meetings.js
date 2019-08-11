document.addEventListener('input', e => {
  console.log(e.target);
  let [meetingId, attribute] = e.target.name.split('/');
  let xhr = new XMLHttpRequest();
  xhr.open('POST', '/editor/update_meeting');
  xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
  xhr.send(JSON.stringify({meetingId, [attribute]: e.target.value }))
})
