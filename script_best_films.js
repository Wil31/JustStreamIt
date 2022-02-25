const mainUrl = "http://localhost:8000/api/v1/titles/";
const topFilmsEndUrl = "?sort_by=-imdb_score,-votes";
const animFilmsEndUrl = "?sort_by=-imdb_score,-votes&genre=animation";
const advFilmsEndUrl = "?sort_by=-imdb_score,-votes&genre=adventure";
const fantFilmsEndUrl = "?sort_by=-imdb_score,-votes&genre=fantasy";

const getTopFilm = (endUrl) => {
    fetch(mainUrl + endUrl)
    .then(function(res) {
        if (res.ok) {
        return res.json();
        }
    })
    .then(function(value) {
        let topRatedFilmUrl = value["results"][0]["url"];
        displayTopRatedFilm(topRatedFilmUrl);
    })
}

const displayTopRatedFilm = (url) => {
    fetch(url)
    .then(function(res) {
        if (res.ok) {
        return res.json();
        }
    })
    .then(function(value) {
        let topFilmImage = document.getElementById("top-film__image");
        topFilmImage.innerHTML = "<p><img src=" + value.image_url + " ></p>";
        topFilmImage.setAttribute("data-id", value.id);

        let topFilmInfo = document.getElementById("top-film__info");
        let topFilmTitle = document.createElement("h1");
        topFilmTitle.innerText = value.title;
        topFilmInfo.appendChild(topFilmTitle);

        let topFilmDescription = document.createElement("p");
        topFilmDescription.innerText = value.description;
        topFilmInfo.appendChild(topFilmDescription);

        let button_infos = document.getElementsByClassName("button__open-modal");
        button_infos[0].addEventListener("click", function() {
            displayModalBox(topFilmImage.dataset.id);
        });
    })
    .catch(function(err) {
        console.error('Error:', err);
    })
}

const createCaroussel = (urlEnd, target) => {
    getFilmsList(urlEnd, target, nombreFilms=5);
    getFilmsList(urlEnd + "&page=2", target, nombreFilms=2);
}

const getFilmsList = (urlEnd ,target , nombreFilms) => {
    fetch(mainUrl + urlEnd)
    .then(function(res) {
        if (res.ok) {
        return res.json();
        }
    })
    .then(function(data) {
        displayFilmsList(data, target, nombreFilms)
    })
    .catch(function(err) {
        console.error('Error:', err);
    })
}

const displayFilmsList = (data, target, nombreFilms) => {
    for (let i = 0; i < nombreFilms; i++) {
        let caroussel__container = document.getElementsByClassName(target)[0];
        let movie_image_element = document.createElement("li");

        movie_image_element.innerHTML = "<p><img src=" +  data.results[i].image_url + "></p>";
        movie_image_element.setAttribute("class", "imgPreview");

        movie_image_element.setAttribute("data-id", data.results[i].id);

        caroussel__container.appendChild(movie_image_element);

        movie_image_element.addEventListener("click", function() {
            displayModalBox(movie_image_element.dataset.id)
        });

        let carrousel = document.getElementsByClassName(target)[0].childNodes;
        carrousel.forEach(function (currentValue, currentIndex) {
			currentValue.setAttribute("data-carousselPlace", currentIndex)

			if (currentIndex < 4) {
				currentValue.style.display = "block"
			} else {
				currentValue.style.display = "none"
			}
		});
    }
}


var buttonsNext = document.getElementsByClassName('button__next')
var buttonsPrevious = document.getElementsByClassName('button__previous')

for(var i=0; i < buttonsNext.length; i++){
	buttonsNext[i].addEventListener('click', function() {
		move_next(this)
	})
	buttonsPrevious[i].addEventListener('click', function() {
		move_previous(this)
	})
}

const move_next = (buttons_next) => {
    let divParent = buttons_next.parentElement
	let divCarrousel = divParent.getElementsByTagName('div')[0]
	let figures = divParent.getElementsByClassName('imgPreview')
	for(var i = 0; i < figures.length; i++){
		figures[i].dataset['carousselplace'] = (figures[i].dataset['carousselplace'] + 6 ) % 7
	}
	refreshCarrousel(divCarrousel)
}

const move_previous = (buttons_previous) => {
    let divParent = buttons_previous.parentElement
	let divCarrousel = divParent.getElementsByTagName('div')[0]
	let figures = divParent.getElementsByClassName('imgPreview')
	for(var i = 0; i < figures.length; i++){
		figures[i].dataset['carousselplace'] = (figures[i].dataset['carousselplace'] + 1) % 7
	}
	refreshCarrousel(divCarrousel)
}

const refreshCarrousel = (carrousel) => {
	figures = carrousel.getElementsByClassName('imgPreview')
	for(var i = 0; i < figures.length; i++){
		if(figures[i].dataset['carousselplace'] < 4){
			figures[i].style.display = "block"
		} else {
			figures[i].style.display = "none"
		}
	}
}


const displayModalBox = (filmId) => {
    let modal = document.getElementById("modal-box");

    modal.style.display = "block";

    fetch(mainUrl + filmId)
        .then(function(res) {
            if(res.ok) {
                return res.json();
            }
        })
        .then(function(data) {
            let modalImage = document.getElementsByClassName("modal__image")[0];
            modalImage.innerHTML = "<p><img src=" + data.image_url + "></p>";
            let modalDetails = document.getElementsByClassName("modal__details");

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

            window.onclick = function(event) {
                if (event.target == modal) {
                    modal.style.display = "none";
                    let modalImage = document.getElementsByClassName("modal__image")[0];
                    modalImage.innerHTML = "";
                    let modalDetails = document.getElementsByClassName("modal__film-details")[0];
                    modalDetails.innerHTML = "";
                }
            }
        })
        .catch(function(err) {
            console.error('Error:', err);
        })
}


const main = () => {
    getTopFilm(topFilmsEndUrl)

    createCaroussel(topFilmsEndUrl, "images__top-films")
    createCaroussel(animFilmsEndUrl, "images__animation")
    createCaroussel(advFilmsEndUrl, "images__adventure")
    createCaroussel(fantFilmsEndUrl, "images__fantasy")
}

main()