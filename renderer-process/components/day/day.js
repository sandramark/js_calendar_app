export class Day extends HTMLElement {
    constructor (date) {
        super();
        
        this.classList.add("calendar");
        this.date = date;
        this.number = date.getDate();
        this.day = this.getDayName();
        this.innerHTML = `<div id="day_${this.number}">${this.number}</div>`;
        this.addEventListener("click", this.handleClickEvent);
        this.addEventListener("click", () => {
            console.log(this.date);
        });
    }

    getDayName() {
        switch(this.date.getDay()) {
            case 0:
                return "Neděle" ;
            case 1:
                return "Pondělí";
            case 2:
                return "Útery";
            case 3:
                return "Středa";
            case 4:
                return "Čtvrtek";
            case 5:
                return "Pátek";
            case 6:
                return "Sobota";
        }
            
    }

    setEvent(event) { 
        this.event = event;
        this.classList.add("event");
    }

    handleClickEvent(){
        window.showModal(this.date, this.event);
    }
}

customElements.define("app-day", Day);