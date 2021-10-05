import {
    Carousel
} from "./components/carousel/carousel.js";
import { CalendarSelect } from "./components/calendar-select/calendar-select.js";
import {
    Day
} from "./components/day/day.js";
import showTime from "./components/digital-clock/digital-clock.js";


// ====
window.showLoader = showLoader;
window.hideLoader = hideLoader;

function showLoader() {
    document.body.appendChild(document.querySelector('#loaderTemplate').content.cloneNode(true));
}

function hideLoader() {
    document.body.removeChild(document.querySelector('.loader'));

}
function showToaster(success, title, message) {
    const toasterTemplate = document.querySelector('#toasterTemplate').content.cloneNode(true);
    const toasterElement = toasterTemplate.querySelector('.toaster');
    toasterElement.addEventListener('click', () => document.body.removeChild(toasterElement));
    toasterElement.classList.add(success ? 'success' : 'error');
    toasterTemplate.querySelector('h1').innerText = title;
    toasterTemplate.querySelector('p').innerText = message;
    document.body.appendChild(toasterTemplate);
    setTimeout(() => {
        try {
            document.body.removeChild(toasterElement);
        } catch(e) {
            console.warn('Toaster already removed');
        }
    }, 3000);
}

function reloadEvents (){
    fetch('http://localhost:3000/calendar')
                   .then(serverResponse => serverResponse.text())
                   .then(responseText => {
                   const events = JSON.parse(responseText);
                   const days = document.querySelectorAll("app-day");

                   const eventKeys = Object.keys(events);
                   const eventValues = Object.values(events);
                   console.log(events);
                   console.log(eventKeys);
                   eventValues.forEach(event => {
                       for(let day of days) {
                           const eventDate = new Date(event.date);
                           const dayDate = day.date;
                        //    console.log(dayDate.toDateString(), eventDate.toDateString() == dayDate.toDateString());
                           if (dayDate.toDateString() === eventDate.toDateString){
                               day.setEvent(event);
                           }
                           
                       }
                   })
                   })
        }
window.reloadEvents = reloadEvents;       

// =====

const carousel = document.querySelector("app-carousel");
let articles;
let contacts;
// const selectAtendee = document.querySelector("#eventAttendees");

// get data from server
fetch("http://localhost:3000/news.json")
    .then(serverResponse => serverResponse.json())
    .then(responseText => {
        articles = responseText.articles;
        console.log(responseText);
        carousel.getDataForCarousel(articles);
        carousel.populateNewsCarousel();

    })
    .catch((err) => console.log("Chyba stahování dat"));


// modal window
function showDayModal(dayDate, dayEvent) {
    const template = document.querySelector('#modal-template');
    const modal = template.content.cloneNode(true);
    const closeAction = () => {
        const child = document.querySelector('section.modal-container');
        document.body.removeChild(child);
    };
    modal.querySelector('#close-modal').addEventListener('click', closeAction);

    const cancelButton = modal.querySelector('#cancel-button');
    cancelButton.addEventListener('click', closeAction);

    modal.querySelector('#save-button').addEventListener('click', () => {
        const formRef = document.querySelector('#modal-form');
        const formData = new FormData(formRef);
        const data = formData.entries();
        
        const object = {
            date: dayDate
        };
        for (let formValue of data) {
            const key = formValue[0];
            const value = formValue[1];
            object[key] = value;
        }
   
        // const isHoliday = formData.get('isHolidayControl') === 'on';
        // zobrazit a skrýt loader
        // z objektu response podle policka ok nebo status se rozhodnout pro toast

        // xxx

        showLoader();

        fetch("http://localhost:3000/calendar",
        {
          method: "POST",
          body: JSON.stringify(object),
          headers: {
              'Content-Type': 'application/json'
          }
        })

           .then(response => {
               console.log(response)
               hideLoader();
               if(response.ok) {
                   showToaster(true, "super", "skvelé");
                   reloadEvents();
                   closeAction();
               } else {
                   showToaster(false, "Hmm", "špatný");

               }
           })
           .catch(err => {
               hideLoader();
               showToaster(false, "Hmm", "špatný");
           })

  
        
    });


    document.body.appendChild(modal);
    if (dayEvent !== undefined) {
        document.querySelector('#eventTitle').value = dayEvent.eventTitle;

    }

    // fetch("http://localhost:3000/contacts")
    // .then(serverResponse => serverResponse.text())
    // .then(responseText => {
    //     const data = JSON.parse(responseText);
    //     const select = document.querySelector('#eventAttendees');
    //     console.log(select);
    //     data.forEach(it => {
    //         const option = document.createElement('option');
    //         option.setAttribute('value', it.id);
    //         option.innerText = `${it.first_name} ${it.last_name}`;
    //         select.appendChild(option); 
    //     })

    //     // const mapData = data.map(it => {
    //     //     it.first_name = "Peter";
    //     //     return it
    //     // })
    // })

    let contactArray;

    fetch("http://localhost:3000/contacts")
        .then(response => response.json())
        .then(responseData => {
            const names = responseData;
            contactArray = responseData;
            console.log(names);

            // for(let i = 0; i < names.length; i++) {
            //     const option = document.createElement("option");
            //     const attendees = document.getElementById("eventAttendees");
            //     option.innerText = `${names[i].first_name} ${names[i].last_name}`;
            //     option.setAttribute(`value`, `id: ${names[i].id};`);
            //     attendees.appendChild(option);
            //     }


            // names.forEach(element => {
            //     const option = document.createElement("option");
            //     const attendees = document.getElementById("eventAttendees");
            //     option.innerText = `${element.first_name} ${element.last_name}`;
            //     option.setAttribute(`value`, `id: ${element.id};`);
            //     attendees.appendChild(option);
            // });

            const attendees = document.getElementById("eventAttendees");


            const names2 = (names) => {
                names.map(item => {
                    const option = document.createElement("option");
                    option.innerText = `${item.first_name} ${item.last_name}`;
                    option.setAttribute(`value`, `id: ${item.id};`);
                    attendees.appendChild(option);
                })
            }
            names2(names);

            //Limit attendees by gender + filter names by gender
            const limitGender = document.querySelector("#limitAttendeesByGender");
            const genderSelectRow = document.querySelector("#genderSelectRow");
            limitGender.addEventListener("change", () => {
                genderSelectRow.classList.toggle("hidden");


                if (limitGender.checked) {

                    female.addEventListener("change", () => {
                        if (female.checked === true) {
                            attendees.innerHTML = `<option value=" "> </option>`;

                            const selectFemale = names.filter(it => {
                                const isFemale = it.gender === "Female";
                                return isFemale;
                            })

                            selectFemale.forEach(element => {
                                const option = document.createElement("option");
                                option.innerText = `${element.first_name} ${element.last_name}`;
                                option.setAttribute(`value`, `id: ${element.id};`);
                                attendees.appendChild(option);
                            });
                        }
                    })
                    male.addEventListener("change", () => {
                        if (male.checked === true) {
                            attendees.innerHTML = `<option value=" "> </option>`;

                            const selectMale = names.filter(it => {
                                const isMale = it.gender === "Male";
                                return isMale;
                            })

                            selectMale.forEach(element => {
                                const option = document.createElement("option");
                                option.innerText = `${element.first_name} ${element.last_name}`;
                                option.setAttribute(`value`, `id: ${element.id};`);
                                attendees.appendChild(option);
                            });
                        }
                    })
                } else {
                    names2(names);
                }
            })

            const female = document.querySelector('input[value="Female"]');
            const male = document.querySelector('input[value="Male"]');

        })
        .catch((err) => console.log("Chyba stahování names"));
};


//Give a showDayModal to object window
//Then it can be used anywhere
//Other possibility is to import and export (more correct)
//Carefull with the order???

window.showModal = showDayModal;

// digital clocks => checking sequense t i m e
let stringTime = "";
window.addEventListener("keydown", (event) => {
    stringTime = `${stringTime}${event.key}`;
    stringTime = stringTime.slice(-4);
    if (stringTime === "time") {
        console.log(stringTime);
        showTime();
        stringTime = "";
    }
})





















// const digitalClock = document.querySelector(".digital-clock");

// function showTime () {
//     const myTimer = () => {
//         const currentTime = new Date();
//         const time = currentTime.toLocaleTimeString();
//         digitalClock.classList.remove("classHidden");
//         digitalClock.innerText = `${time}`;
//     }
//     const timer = setInterval(myTimer, 1000); 

//     const timerStop = setTimeout(() => {
//         clearInterval(timer);
//         digitalClock.innerHTML = ``;
//         digitalClock.classList.add("classHidden");
//     }, 6000);
// }

// let stringTime = "";
// window.addEventListener("keydown", (event) => {
//     stringTime = `${stringTime}${event.key}`;
//     stringTime = stringTime.slice(-4);
//     if (stringTime === "time"){
//         console.log(stringTime);
//         showTime();
//     }
// })










// calendar
// const currentDate = new Date();
// const maxDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

// for (let i = 1; i <= maxDate; i++) {
//     const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), i)
//     const divDay = new Day(dayDate);
//     main.appendChild(divDay);
// }