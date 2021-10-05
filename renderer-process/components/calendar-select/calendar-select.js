import {
    Day
} from "../day/day.js";

export class CalendarSelect extends HTMLElement {
    constructor() {
        super();

        this.innerHTML = `
        <form id="calendarSelect">
             <select name="monthSelect" id="monthSelect"></select>
            <select name="yearSelect" id="yearSelect"></select>
        </form>
        `;

        this.selectMonth = document.querySelector("#monthSelect");
        this.selectYear = document.querySelector("#yearSelect");
        this.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        this.main = document.querySelector(".main-content");

        this.generateMonths();
        this.generateYears();

        this.currentDate = new Date();
        this.chosenYear = this.currentDate.getFullYear();
        this.chosenMonth = this.currentDate.getMonth() + 1;
        this.chosenDate = new Date(this.chosenYear, this.chosenMonth, 0).getDate();

        this.selectMonth.addEventListener("change", (e) => {
            this.chosenMonth = this.months.indexOf(e.target.value)
            this.chosenDate = new Date(this.chosenYear, this.chosenMonth + 1, 0).getDate();
            this.generateChoosenMonthsDays(this.chosenDate, this.chosenYear, this.chosenMonth);
            this.currentDateHighlight(this.chosenMonth + 1);
        })
    
        this.selectYear.addEventListener("change", (e) => {
            this.chosenYear = parseInt(e.target.value);
            this.chosenDate = new Date(this.chosenYear, this.chosenMonth + 1, 0).getDate();
            this.generateChoosenMonthsDays(this.chosenDate, this.chosenYear, this.chosenMonth);
            this.currentDateHighlight(this.chosenMonth + 1);
        })

        this.generateChoosenMonthsDays(this.chosenDate, this.chosenYear, this.chosenMonth);
        this.currentDateHighlight(this.chosenMonth);
    }

    generateMonths() {
        for (let item of this.months) {
            const option = document.createElement("option");
            option.value = `${item}`;
            option.innerText = `${item}`;
            this.selectMonth.appendChild(option);
        }
        const day = new Date();
        const currentMonth = day.getMonth();
        const currentYear = day.getFullYear();
        this.selectMonth.value = this.months[currentMonth];
    }

    generateYears() {

        const day = new Date();
        const currentYear = day.getFullYear();
        for (let i = 0; i < 101; i++) {
            const option = document.createElement("option");
            option.value = `${currentYear - 80 + i}`;
            option.innerText = `${currentYear - 80 + i}`;
            this.selectYear.appendChild(option);
        }
        this.selectYear.value = `${currentYear}`;

    }
    

    generateChoosenMonthsDays(maxDate, chosenYear, chosenMonth) {
        this.main.innerHTML = ``;
        for (let i = 1; i <= maxDate; i++) {
            const dayDate = new Date(chosenYear, chosenMonth, i)
            const divDay = new Day(dayDate);
            this.main.appendChild(divDay);
        }
    }

    currentDateHighlight(chosenMonth) {
        if (chosenMonth === this.currentDate.getMonth() + 1 && this.chosenYear === this.currentDate.getFullYear()) {
            const today = document.getElementById(`day_${this.currentDate.getDate()}`).parentElement;
            today.style.border = `0.2rem solid rgba(0, 0, 0, 0.3)`;
            today.style.backgroundColor = `#457e46`;
        }
    }
}

customElements.define("app-calendar-select", CalendarSelect);

