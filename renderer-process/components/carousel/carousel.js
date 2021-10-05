import { NewsArticle } from "../news-article/news-article.js";

export class Carousel extends HTMLElement {
    constructor() {
        super();

        this.innerHTML = `
        <header class="header-news">
            <div class="header-news__container"></div>
            <button id="carousel-button-left"><i class="fas fa-chevron-left"></i></button>
            <button id="carousel-button-right" class="last"><i class="fas fa-chevron-right"></i></button>
        </header>`;

        this.articles = this.getDataForCarousel();
        this.carouselItemStart = 0;
        this.carouselItemCount = 2;
        this.header = document.querySelector(".header-news__container");
        this.buttonLeft = document.querySelector("#carousel-button-left");
        this.buttonRight = document.querySelector("#carousel-button-right");
        
        this.buttonRight.addEventListener("click", () => {
            this.carouselItemStart++;
            this.populateNewsCarousel();
        });
        this.buttonLeft.addEventListener("click", () => {
            this.carouselItemStart--;
            this.populateNewsCarousel();
        });
    }

    getDataForCarousel(news){
        this.articles = news;
    }

    // carousel start and end, button visibility
    checkButtonsVisibility() {
        this.buttonLeft.hidden = (this.carouselItemStart === 0);
        this.buttonRight.hidden = (this.carouselItemStart>= this.articles.length - this.carouselItemCount);
    }

    // fill in the carousel
    // const newsValue = news[i % 10];
    populateNewsCarousel() {
        this.header.innerHTML = "";
        for(let i = this.carouselItemStart; i < this.carouselItemStart + this.carouselItemCount; i++) {
            const newsValue = this.articles[i];
            const newsArticle = new NewsArticle(newsValue);
            this.header.appendChild(newsArticle); 
            this.checkButtonsVisibility();
        }  
    }
}

customElements.define("app-carousel", Carousel);