const offcanvasWatchlist = new bootstrap.Offcanvas(document.getElementById('offcanvasWatchlist'));
document.getElementById('openWatchlist').addEventListener('click', () => offcanvasWatchlist.show());

document.getElementById("offcanvasRight").addEventListener('hidden.bs.offcanvas', () => {
    const backdrop = document.querySelector('.offcanvas-backdrop');
    if (backdrop) backdrop.remove();
});


function displayWatchList() {
    const watchList = JSON.parse(localStorage.getItem("watchList")) || [];
    const watchListBody = document.getElementById('watchListBody');

    watchListBody.innerHTML = watchList.map(item => `
        <div class="upcomingCardList">
            <img src="${item.image.medium}" alt="">
            <button class="filmIcon" onclick="removeFromWatchList('${item.id}')"><i class="fa-solid fa-x"></i></button>
            <div class="upcomingCardHead1List">
                <a href='${item.url}'>${item.name}</a>
            </div>
        </div>
    `).join('');
}

function removeFromWatchList(ID) {
    let watchList = JSON.parse(localStorage.getItem("watchList")) || [];
    watchList = watchList.filter(item => item.id.toString() !== ID.toString());
    localStorage.setItem("watchList", JSON.stringify(watchList));
    displayWatchList();
}


const contactForm = document.getElementById("contactForm");
const formElements = {
    name: document.getElementById("name"),
    mail: document.getElementById("mail"),
    subject: document.getElementById("subject"),
    message: document.getElementById("message")
};

contactForm.addEventListener("submit", function(event) {
    event.preventDefault(); 
    
    for (const element of Object.values(formElements)) {
        element.style.outline = "";
    }
    
    let isValid = true;
    for (const [key, element] of Object.entries(formElements)) {
        if (element.value.trim() === "") {
            element.style.outline = "1px solid red";
            isValid = false;
        }
        if (key === "mail" && !validateEmail(element.value.trim())) {
            element.style.outline = "1px solid red";
            isValid = false;
        }
    }
    
    if (!isValid) return;
    
    const formData = Object.fromEntries(Object.entries(formElements).map(([key, element]) => [key, element.value.trim()]));
    
    fetch("http://localhost:4000/data", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (response.ok) {
            alert("Message sent successfully!");
        } else {
            alert("Error sending message.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Error sending message.");
    });
});

function validateEmail(email) {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
}

displayWatchList();
