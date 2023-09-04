// Функція для створення промісів
function createPromise(position, delay) {
  return new Promise((resolve, reject) => {
    const shouldResolve = Math.random() > 0.3;
    setTimeout(() => {
      if (shouldResolve) {
        resolve({ position, delay });
      } else {
        reject({ position, delay });
      }
    }, delay);
  });
}

// Отримання форми та додавання обробника події на сабміт
const form = document.querySelector('.form');
form.addEventListener('submit', async (event) => {
  event.preventDefault();

  // Отримання значень з полів форми
  const delay = parseInt(form.elements.delay.value);
  const step = parseInt(form.elements.step.value);
  const amount = parseInt(form.elements.amount.value);

  // Створення промісів та обробка їх результатів
  for (let i = 0; i < amount; i++) {
    const position = i + 1;
    const currentDelay = delay + i * step;

    createPromise(position, currentDelay)
      .then(({ position, delay }) => {
        console.log(`✅ Fulfilled promise ${position} in ${delay}ms`);
      })
      .catch(({ position, delay }) => {
        console.log(`❌ Rejected promise ${position} in ${delay}ms`);
      });
  }
});