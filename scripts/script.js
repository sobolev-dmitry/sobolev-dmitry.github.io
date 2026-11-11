// Меню в шапке
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');

burger.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('is-open');
  burger.classList.toggle('is-open', isOpen);
  burger.setAttribute('aria-expanded', isOpen);
});

document.addEventListener('click', (event) => {
  // если клик не по бургеру — просто закрываем меню
  if (!burger.contains(event.target)) {
    nav.classList.remove('is-open');
    burger.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
  }
});

// Валидация формы
const form = document.getElementById('contact-form');
const submitBtn = form.querySelector('.contact__submit');
const successMsg = form.querySelector('.contact__success');
const errorMsg = form.querySelector('.contact__error');

// Валидация
const validators = {
  name: value => value.trim().length > 0,
  email: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()),
  message: value => value.trim().length > 0,
};

function validateField(fieldName) {
  const input = form.elements[fieldName];
  const field = input.closest('.form-field');
  const isValid = validators[fieldName](input.value);
  field.classList.toggle('is-invalid', !isValid);
  return isValid;
}

form.addEventListener('submit', async e => {
  e.preventDefault();

  const allValid = Object.keys(validators).every(validateField);
  if (!allValid) return;

  // Заполняем replyto, чтобы отвечать напрямую на email отправителя
  form.elements.replyto.value = form.elements.email.value;

  // Состояние отправки: блокируем кнопку
  const originalText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = 'Отправка...';

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: new FormData(form),
    });

    const result = await response.json();

    if (result.success) {
      // Успех
      errorMsg.hidden = true;
      successMsg.hidden = false;
      form.reset();
    } else {
      // Сервис вернул ошибку
      successMsg.hidden = true;
      errorMsg.hidden = false;
    }
  } catch (err) {
    console.error('Ошибка отправки:', err);
    successMsg.hidden = true;
    errorMsg.hidden = false;
  } finally {
    // Возвращаем кнопку в исходное состояние
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
});
