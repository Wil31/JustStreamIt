const mainUrl = "http://localhost:8000/api/v1/titles/";
const topFilmsEndUrl = "?sort_by=-imdb_score,-votes";
const animFilmsEndUrl = "?sort_by=-imdb_score,-votes&genre=animation";
const advFilmsEndUrl = "?sort_by=-imdb_score,-votes&genre=adventure";
const fantFilmsEndUrl = "?sort_by=-imdb_score,-votes&genre=fantasy";

const getTopFilm = (endUrl) => {
    fetch(mainUrl + endUrl)
        .then(function (res) {
            if (res.ok) {
                return res.json();
            }
        })
        .then(function (value) {
            let topRatedFilmUrl = value["results"][0]["url"];
            displayTopRatedFilm(topRatedFilmUrl);
        })
        .catch(function (err) {
            console.error('Error:', err);
        })
}

const displayTopRatedFilm = (url) => {
    fetch(url)
        .then(function (res) {
            if (res.ok) {
                return res.json();
            }
        })
        .then(function (value) {
            let topFilmImage = document.getElementById("top-film__image");
            topFilmImage.innerHTML = "<p><img src=" + value.image_url + " ></p>";
            topFilmImage.setAttribute("id", value.id);

            let topFilmInfo = document.getElementById("top-film__info");
            let topFilmTitle = document.createElement("h1");
            topFilmTitle.innerText = value.title;
            topFilmInfo.appendChild(topFilmTitle);

            let topFilmDescription = document.createElement("p");
            topFilmDescription.innerText = value.description;
            topFilmInfo.appendChild(topFilmDescription);

            let button_infos = document.getElementsByClassName("button__open-modal");
            button_infos[0].addEventListener("click", () => {
                displayModalBox(topFilmImage.id);
            });
        })
        .catch(function (err) {
            console.error('Error:', err);
        })
}

const createCarousselItems = (urlEnd, target) => {
    getFilmsList(urlEnd, target, nombreFilms = 5);
    getFilmsList(urlEnd + "&page=2", target, nombreFilms = 2);
}

const getFilmsList = (urlEnd, target, nombreFilms) => {
    fetch(mainUrl + urlEnd)
        .then(function (res) {
            if (res.ok) {
                return res.json();
            }
        })
        .then(function (data) {
            displayFilmsList(data, target, nombreFilms)
        })
        .catch(function (err) {
            console.error('Error:', err);
        })
}

const displayFilmsList = (data, target, nombreFilms) => {
    for (let i = 0; i < nombreFilms; i++) {
        let carousselContainer = document.getElementsByClassName(target)[0];
        let film_cover = document.createElement("li");

        film_cover.innerHTML = "<p><img src=" + data.results[i].image_url + "></p>";
        film_cover.setAttribute("class", "imgPreview");

        film_cover.setAttribute("id", data.results[i].id);

        carousselContainer.appendChild(film_cover);

        film_cover.addEventListener("click", () => {
            displayModalBox(film_cover.id)
        });
    }
}

const displayModalBox = (filmId) => {
    let modal = document.getElementById("modal-box");

    modal.style.display = "block";

    fetch(mainUrl + filmId)
        .then(function (res) {
            if (res.ok) {
                return res.json();
            }
        })
        .then(function (data) {
            let modalImage = document.getElementsByClassName("modal__image")[0];
            modalImage.innerHTML = "<p><img src=" + data.image_url + "></p>";
            let modalDetails = document.getElementsByClassName("modal__film-details");

            let title = document.createElement("li");
            title.innerHTML = "<em>Titre : </em>" + data.title;
            modalDetails[0].appendChild(title);

            let genres = document.createElement("li");
            genres.innerHTML = "<em>Genre(s) : </em>" + data.genres;
            modalDetails[0].appendChild(genres);

            let date = document.createElement("li");
            date.innerHTML = "<em>Date : </em>" + data.date_published;
            modalDetails[0].appendChild(date);

            let rated = document.createElement("li");
            rated.innerHTML = "<em>Rated : </em>" + data.rated;
            modalDetails[0].appendChild(rated);

            let imdb_score = document.createElement("li");
            imdb_score.innerHTML = "<em>Imdb score : </em>" + data.imdb_score;
            modalDetails[0].appendChild(imdb_score);

            let directors = document.createElement("li");
            directors.innerHTML = "<em>Réalisteur(s) : </em>" + data.directors;
            modalDetails[0].appendChild(directors);

            let actors = document.createElement("li");
            actors.innerHTML = "<em>Liste des acteurs : </em>" + data.actors;
            modalDetails[0].appendChild(actors);

            let duration = document.createElement("li");
            duration.innerHTML = "<em>Durée : </em>" + data.duration + " min";
            modalDetails[0].appendChild(duration);

            let paysOrigine = document.createElement("li");
            paysOrigine.innerHTML = "<em>Pays d'origine : </em>" + data.countries;
            modalDetails[0].appendChild(paysOrigine);

            let boxOffice = document.createElement("li");
            boxOffice.innerHTML = "<em>Résultats Box Office : </em>" + data.worldwide_gross_income;
            modalDetails[0].appendChild(boxOffice);

            let longDescription = document.createElement("li");
            longDescription.innerHTML = "<em>Résumé du film : </em>" + data.long_description;
            modalDetails[0].appendChild(longDescription);

            window.onclick = function (event) {
                if (event.target == modal) {
                    modal.style.display = "none";
                    let modalImage = document.getElementsByClassName("modal__image")[0];
                    modalImage.innerHTML = "";
                    let modalDetails = document.getElementsByClassName("modal__film-details")[0];
                    modalDetails.innerHTML = "";
                }
            }

            var span = document.getElementsByClassName("close")[0];

            span.onclick = function () {
                modal.style.display = "none";
                let modalImage = document.getElementsByClassName("modal__image")[0];
                modalImage.innerHTML = "";
                let modalDetails = document.getElementsByClassName("modal__film-details")[0];
                modalDetails.innerHTML = "";
            }


        })
        .catch(function (err) {
            console.error('Error:', err);
        })
}


const main = () => {
    getTopFilm(topFilmsEndUrl);

    createCarousselItems(topFilmsEndUrl, "images__top-films");
    createCarousselItems(animFilmsEndUrl, "images__animation");
    createCarousselItems(advFilmsEndUrl, "images__adventure");
    createCarousselItems(fantFilmsEndUrl, "images__fantasy");

    const buttonsNext = document.querySelectorAll(".button__next");
    const buttonsPrevious = document.querySelectorAll(".button__previous");

    buttonsNext.forEach((buttonNext) => {
        buttonNext.addEventListener("click", () => {
            move_next(buttonNext);
        });
    });

    buttonsPrevious.forEach((buttonPrevious) => {
        buttonPrevious.addEventListener("click", () => {
            move_previous(buttonPrevious);
        });
    });

    const move_next = (buttons_next) => {
        let divParent = buttons_next.parentElement;
        let carrousel = divParent.getElementsByTagName('ul')[0];
        let figures = divParent.getElementsByClassName('imgPreview');

        carrousel.append(figures[0]);


    }

    const move_previous = (buttons_previous) => {
        let divParent = buttons_previous.parentElement;
        let carrousel = divParent.getElementsByTagName('ul')[0];
        let figures = divParent.getElementsByClassName('imgPreview');
        
        carrousel.prepend(figures[figures.length - 1]);
    }

}

main()