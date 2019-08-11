document.addEventListener('click', e => {

  let target = e.target;
  while(target != null && target.className != 'meeting meeting--link') target = target.parentNode;
  if(target == null) return;

  if(document.querySelector('.meeting--link.active'))
    document.querySelector('.meeting--link.active').classList.remove('active');
  target.classList.add('active');

  let url = target.dataset.youtubeUrl;
  var match = url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/);
  url = 'https://www.youtube.com/embed/' + match[2] + '?rel=0&controls=1&autoplay=1';
  document.querySelector('.video iframe').src = url;
  document.querySelector('.video-container').classList.add('video-open');
})
