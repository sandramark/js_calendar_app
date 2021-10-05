export class NewsArticle extends HTMLElement {

    constructor(newsContent){
        super();
        this.classList.add("news-article");
        this.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.7), transparent), url(${newsContent.image})`;
    
        const title = document.createElement("span");
        title.classList.add("news-article__title")
        title.innerText = `${newsContent.title}`;
        this.appendChild(title);
    }
}

customElements.define("app-news-article", NewsArticle);


