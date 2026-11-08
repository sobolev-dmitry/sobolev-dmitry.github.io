const toTop = document.querySelector('.to-top');

window.addEventListener('scroll', () => {
  // докрутили ли страницу до самого низа
  const scrolledToBottom =
    window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 50;

  toTop.classList.toggle('to-top--visible', scrolledToBottom);
});

toTop.addEventListener('click', e => {
  e.preventDefault(); // отменяем прыжок по ссылке "#"
  window.scrollTo({
    top: 0,
    behavior: 'smooth', // плавная прокрутка
  });
});
