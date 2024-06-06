const comicsBody = document.getElementById("comicsBody");
const comicsSearch = document.getElementById("comicsSearch");

document.getElementById('openWatchlist').addEventListener('click', function () {
    var offcanvasWatchlist = new bootstrap.Offcanvas(document.getElementById('offcanvasWatchlist'));
    offcanvasWatchlist.show();
});

function displayComics(comicsData) {
    comicsBody.innerHTML = "";
    comicsData.forEach(item => {
        comicsBody.innerHTML += `
            <div class="upcomingCardList">
                <img src="${item.thumbnail.path}.jpg" alt="">
                <a href="${item.urls[0].url}"><h3>${item.title}</h3></a>
            </div>
        `;
    });
}

function fetchComics(searchValue) {
    let url = 'https://gateway.marvel.com/v1/public/comics?ts=1&apikey=23f73c6784f2f80d3b29cab33fd30ff7&hash=721beb32bc3e66c06a76db97ae763b92';
    if (searchValue) {
        url += `&titleStartsWith=${searchValue}`;
    }
    return fetch(url)
        .then(res => res.json())
        .then(comics => comics.data.results)
        .catch(error => console.error('Error fetching comics:', error));
}

function getComics() {
    fetchComics()
        .then(comics => {
            displayComics(comics);
        });
}

getComics();

comicsSearch.addEventListener("input", () => {
    fetchComics(comicsSearch.value.toLowerCase())
        .then(filteredComics => {
            displayComics(filteredComics);
        });
});

function getWatchList() {
    const watchList = JSON.parse(localStorage.getItem("watchList")) || [];
    const watchListBody = document.getElementById('watchListBody');

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

getWatchList();

function removeFromWatchList(ID) {
    let watchList = JSON.parse(localStorage.getItem("watchList")) || [];
    let filmIndex = watchList.findIndex(item => item.id == ID);
    if (filmIndex !== -1) {
        watchList.splice(filmIndex, 1);
        localStorage.setItem("watchList", JSON.stringify(watchList));
    } else {
    }
    getWatchList();
}
