const moviesBody = document.getElementById("moviesBody");
const moviesSearch = document.getElementById("moviesSearch");
const prevPageButton = document.getElementById("prevPage");
const nextPageButton = document.getElementById("nextPage");
const header = document.querySelector("header");
const watchListBody = document.getElementById("watchListBody");

let allMovies = [];
let currentPage = 1;
const moviesPerPage = 8;
let watchList = JSON.parse(localStorage.getItem("watchList")) || [];

window.addEventListener("scroll", () => {
    header.style.backgroundColor = window.scrollY > 0 ? "#171D22" : "transparent";
});

async function getMovies(page) {
    try {
        const response = await fetch("https://api.tvmaze.com/shows");
        const movies = await response.json();
        allMovies = movies;
        displayMovies(page);
    } catch (error) {
        console.error("Error fetching movies:", error);
    }
}

function displayMovies(page) {
    const start = (page - 1) * moviesPerPage;
    const end = page * moviesPerPage;
    const filteredMovies = allMovies.filter(item => item.name.toLowerCase().includes(moviesSearch.value.toLowerCase()));
    const moviesToShow = filteredMovies.slice(start, end);
    
    moviesBody.innerHTML = moviesToShow.map(item => `
        <div class="upcomingCard" onclick="openMovieModal(${item.id})">
            <img src="${item.image.medium}" alt="">
            <button class="filmIcon" onclick="event.stopPropagation(); addToWatch(${item.id})"><i class="fa-solid fa-film"></i></button>
            <div class="upcomingCardHead1">
                <a href='${item.url}' target="_blank">${item.name}</a>
                <span>${item.ended ? item.ended : "2020-05-04"}</span>
            </div>
            <div class="upcomingCardHead2">
                <span>HD</span>
                <span>
                    <span><i class="far fa-clock"></i> ${item.runtime}</span>
                    <span><i class="fa-brands fa-imdb"></i>${item.rating.average}</span>
                </span>
            </div>
        </div>
    `).join('');
    
    updatePagination(filteredMovies.length);
}

function updatePagination(totalMovies) {
    prevPageButton.disabled = currentPage === 1;
    nextPageButton.disabled = currentPage * moviesPerPage >= totalMovies;
}

prevPageButton.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        displayMovies(currentPage);
        updatePagination(allMovies.length);
    }
});

nextPageButton.addEventListener("click", () => {
    currentPage++;
    displayMovies(currentPage);
    updatePagination(allMovies.length);
});

moviesSearch.addEventListener("input", () => {
    currentPage = 1;
    displayMovies(currentPage);
});

function addToWatch(ID) {
    const film = allMovies.find(item => item.id === ID);
    if (!watchList.some(item => item.id === ID)) {
        watchList.push(film);
        localStorage.setItem("watchList", JSON.stringify(watchList));
        getWatchList();
    } else {
        alert("It is already in your Watch List");
    }
}

document.getElementById("openWatchlist").addEventListener("click", () => {
    const offcanvasWatchlist = new bootstrap.Offcanvas(document.getElementById("offcanvasWatchlist"));
    offcanvasWatchlist.show();
});

function getWatchList() {
    watchListBody.innerHTML = watchList.map(item => `
        <div class="upcomingCardList">
            <img src="${item.image.medium}" alt="">
            <button class="filmIcon" onclick="removeFromWatchList(${item.id})"><i class="fa-solid fa-x"></i></button>
            <div class="upcomingCardHead1List">
                <a href='${item.url}' target="_blank">${item.name}</a>
            </div>
        </div>
    `).join('');
}

function removeFromWatchList(ID) {
    const filmIndex = watchList.findIndex(item => item.id === ID);
    if (filmIndex !== -1) {
        watchList.splice(filmIndex, 1);
        localStorage.setItem("watchList", JSON.stringify(watchList));
    } else {
    }
    getWatchList();
}

function openMovieModal(movieId) {
    const movie = allMovies.find(item => item.id === movieId);
    if (movie) {
        document.getElementById("movieModalImage").src = movie.image.medium;
        document.getElementById("movieModalName").innerText = movie.name;
        document.getElementById("movieModalSummary").innerHTML = movie.summary;
        document.getElementById("movieModalRuntime").innerText = movie.runtime;
        document.getElementById("movieModalRating").innerText = movie.rating.average;
        document.getElementById("movieModalEnded").innerText = movie.ended ? movie.ended : "2020-05-04";
        
        const movieDetailsModal = new bootstrap.Modal(document.getElementById("movieDetailsModal"));
        movieDetailsModal.show();
    }
}

getMovies(currentPage);
getWatchList();
