import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import Notiflix from "notiflix";

const dateTimePicker = document.querySelector("#datetime-picker");
const startButton = document.querySelector('[data-start]');
const daysElement = document.querySelector('[data-days]');
const hoursElement = document.querySelector('[data-hours]');
const minutesElement = document.querySelector('[data-minutes]');
const secondsElement = document.querySelector('[data-seconds]');

let countdownInterval;

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function updateTimerDisplay(timeObject) {
  daysElement.textContent = timeObject.days.toString().padStart(2, '0');
  hoursElement.textContent = timeObject.hours.toString().padStart(2, '0');
  minutesElement.textContent = timeObject.minutes.toString().padStart(2, '0');
  secondsElement.textContent = timeObject.seconds.toString().padStart(2, '0');
}

startButton.addEventListener('click', () => {
  const selectedDate = dateTimePicker._flatpickr.selectedDates[0];

  if (!selectedDate) {
    Notiflix.Notify.failure("Please choose a date in the future");
    return;
  }

  const currentDate = new Date();
  const timeDifference = selectedDate - currentDate;

  if (timeDifference <= 0) {
    Notiflix.Notify.failure("Please choose a date in the future");
    return;
  }

  if (countdownInterval) {
    clearInterval(countdownInterval);
  }

  countdownInterval = setInterval(() => {
    const currentTime = new Date();
    const timeRemaining = selectedDate - currentTime;

    if (timeRemaining <= 0) {
      clearInterval(countdownInterval);
      updateTimerDisplay({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      Notiflix.Notify.success("Countdown has ended!");
    } else {
      const timeObject = convertMs(timeRemaining);
      updateTimerDisplay(timeObject);
    }
  }, 1000);
});

// Initialize flatpickr with options
flatpickr(dateTimePicker, {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];
    const currentDate = new Date();
    const timeDifference = selectedDate - currentDate;

    if (timeDifference <= 0) {
      Notiflix.Notify.failure("Please choose a date in the future");
      startButton.disabled = true;
    } else {
      startButton.disabled = false;
    }
  },
});