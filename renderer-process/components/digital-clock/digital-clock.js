
const digitalClock = document.querySelector(".digital-clock");

export function showTime () {
    const myTimer = () => {
        const currentTime = new Date();
        const time = currentTime.toLocaleTimeString();
        digitalClock.classList.remove("classHidden");
        digitalClock.innerText = `${time}`;
    }
    const timer = setInterval(myTimer, 1000); 

    const timerStop = setTimeout(() => {
        clearInterval(timer);
        digitalClock.innerText = ``;
        digitalClock.classList.add("classHidden");
    }, 6000);
}

window.showTime = showTime;

export default showTime;