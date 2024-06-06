const header = document.querySelector("header");
const upcomingCards = document.getElementById("upcomingCards");
const customerNumber = document.getElementById("customerNumber");
const watchListBody = document.getElementById('watchListBody');

let movieFilterValue = "all";

window.addEventListener("scroll", function () {
    header.style.backgroundColor = window.scrollY > 0 ? "#171D22" : "transparent";
});

function takingMovieFilterValue(value) {
    movieFilterValue = value;
    getUpcomingCards();
}

function getUpcomingCards() {
    upcomingCards.innerHTML = "";
    fetch('http://localhost:3000/movies')
        .then(res => res.json())
        .then(movies => {
            movies.filter(item => item.category.includes(movieFilterValue))
                .forEach(item => {
                    upcomingCards.innerHTML += `
                        <div class="upcomingCard">
                            <img src="${item.imgUrl}" alt="">
                            <div class="upcomingCardHead1">
                                <a href="">${item.title}</a>
                                <span>${item.year}</span>
                            </div>
                            <div class="upcomingCardHead2">
                                <span>HD</span>
                                <span>
                                    <span><i class="far fa-clock"></i> ${item.time}</span>
                                    <span><i class="fa-brands fa-imdb"></i>${item.imdb}</span>
                                </span>
                            </div>
                        </div>`;
                });
        });
}

function customer() {
    customerNumber.innerHTML = 0;
    setInterval(() => {
        if (parseInt(customerNumber.innerHTML) < 20 && window.scrollY > 1800) {
            customerNumber.classList.add('fade-in');
            setTimeout(() => {
                customerNumber.innerHTML = parseInt(customerNumber.innerHTML) + 1;
                customerNumber.classList.remove('fade-in');
            }, 300);
        }
    }, 600);
}

customer();
getUpcomingCards();

let allMovies = [];

function getArr() {
    fetch('https://api.tvmaze.com/shows')
        .then(res => res.json())
        .then(movies => {
            allMovies = movies;
            // displayMovies(page); // This function seems to be missing
        });
}
getArr();

document.getElementById('openWatchlist').addEventListener('click', function () {
    var offcanvasWatchlist = new bootstrap.Offcanvas(document.getElementById('offcanvasWatchlist'));
    offcanvasWatchlist.show();
});

let watchList = JSON.parse(localStorage.getItem("watchList")) || [];

function getWatchList() {
    watchListBody.innerHTML = "";
    watchList.forEach(item => {
        watchListBody.innerHTML += `<div class="upcomingCardList">
                <img src="${item.image.medium}" alt="">
                <button class="filmIcon" onclick="removeFromWatchList(${item.id})"><i class="fa-solid fa-x"></i></button>
                <div class="upcomingCardHead1List">
                    <a href='${item.url}'>${item.name}</a>
                </div>
            </div>`;
    });
}

function removeFromWatchList(ID) {
    const filmIndex = watchList.findIndex(item => item.id == ID);
    if (filmIndex !== -1) {
        watchList.splice(filmIndex, 1);
        localStorage.setItem("watchList", JSON.stringify(watchList));
    } else {
    }
    getWatchList();
}

getWatchList(); 