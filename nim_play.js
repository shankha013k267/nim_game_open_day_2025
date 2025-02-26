window.onload = function () {
    const piles = ["pile1", "pile2", "pile3"];
    
    piles.forEach(pile => {
        const pileCount = localStorage.getItem(pile);
        const pileElement = document.getElementById(`${pile}-count`);
        pileElement.innerHTML = ""; // Clear any existing content

        if (pileCount) {
            for (let i = 0; i < pileCount; i++) {
                const apple = document.createElement("span");
                apple.textContent = "🍎";
                apple.style.fontSize = "24px";
                apple.style.margin = "2px";
                pileElement.appendChild(apple);
            }
        }
    });
};

function showModal(modalId) {
    document.getElementById(modalId).style.display = "flex";
}

function hideModal(modalId) {
    document.getElementById(modalId).style.display = "none";
}

function goBack() {
    window.location.href = 'nim_game.html';
}