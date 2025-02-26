let piles = [
    parseInt(localStorage.getItem('pile1')) || 0,
    parseInt(localStorage.getItem('pile2')) || 0,
    parseInt(localStorage.getItem('pile3')) || 0
];
let history = [piles.slice()];
let user = localStorage.getItem('playerTurn');
let selectedPile = -1;
let selectedApples = 0;

window.onload = function () {
    playerModeOff();
    showApples(piles);
    if (user === 'first') {
        setTimeout(() => {
            document.getElementById("game-heading").innerText = "Play your move!";
            playerModeOn();
        }, 1000);
    } else {
        computerMove();
    }
};

function showApples(arr) {
    for (let i = 0; i < 3; i++) {
        const pileElement = document.getElementById(`pile${i + 1}-count`);
        pileElement.innerHTML = "";
        for (let j = 0; j < arr[i]; j++) {
            const apple = document.createElement("span");
            apple.textContent = "🍎";
            apple.style.fontSize = "24px";
            apple.style.margin = "2px";
            apple.onclick = () => toggleAppleSelection(i, apple);
            pileElement.appendChild(apple);
        }
    }
}

function toggleAppleSelection(pileIndex, apple) {
    if (pileIndex !== selectedPile) return;

    apple.classList.toggle("opaque");

    // Recalculate selected apples properly
    selectedApples = document.querySelectorAll("#pile" + (pileIndex + 1) + "-count .opaque").length;
}


function playerModeOn() {
    document.querySelectorAll(".card").forEach((card, index) => {
        card.onclick = () => selectPile(index);
        card.style.transition = "transform 0.3s ease";
        card.onmouseover = () => card.style.transform = "scale(1.05)";
        card.onmouseleave = () => card.style.transform = "scale(1)";
    });
}

function playerModeOff() {
    document.querySelectorAll(".card").forEach(card => {
        card.onclick = null;
        card.onmouseover = null;  // Disable hover effect
        card.onmouseleave = null; // Disable hover effect
        card.style.transform = "scale(1)"; // Ensure it stays at normal size
    });
}

function selectPile(index) {
    if (piles[index] === 0) {
        alert("Please select a pile with at least one apple");
        return;
    }
    selectedPile = index;

    let overlay = document.getElementById("globalOverlay");
    overlay.style.display = "block";  // Ensure it's visible
    

    // Highlight selected pile
    let selectedCard = document.querySelectorAll(".card")[index];
    selectedCard.classList.add("highlighted-card");

    // Dim and disable other cards
    document.querySelectorAll(".card").forEach((card, i) => {
        if (i !== index) {
            card.classList.add("disabled-card");
        }
    });

    // Ensure buttons are visible
    document.getElementById("selection-buttons").style.display = "block";
}


function playPlayerMove() {
    if (selectedApples === 0) {
        alert("Please select at least one apple to remove");
        return;
    }

    // Apply the move
    piles[selectedPile] -= selectedApples;
    history.push(piles.slice());
    showApples(piles);

    // Remove dark overlay properly
    let overlay = document.getElementById("globalOverlay");
    if (overlay) overlay.style.display = "none";

    // Reset all cards and enable interactions
    document.querySelectorAll(".card").forEach(card => {
        card.classList.remove("highlighted-card", "disabled-card");
        card.style.transform = "scale(1)";
    });

    // Restore button interactivity
    document.getElementById("selection-buttons").style.display = "none";

    // Remove opacity from apples
    document.querySelectorAll(".opaque").forEach(apple => {
        apple.classList.remove("opaque");
    });

    // Disable player mode and trigger computer move
    playerModeOff();
    computerMove();
}




function cancelSelection() {
    selectedPile = -1;
    selectedApples = 0;

    // Remove dark overlay completely
    let overlay = document.getElementById("globalOverlay");
    if (overlay) overlay.style.display = "none";

    // Restore card interactions
    document.querySelectorAll(".card").forEach(card => {
        card.classList.remove("highlighted-card", "disabled-card");
        card.style.transform = "scale(1)";
    });

    // Restore button interactivity
    document.getElementById("selection-buttons").style.display = "none";

    // Remove apple opacity
    document.querySelectorAll(".opaque").forEach(apple => {
        apple.classList.remove("opaque");
    });
}



function calculateMove(arr) {
    let xorSum = arr[0] ^ arr[1] ^ arr[2];
    if (xorSum === 0) {
        let index = arr.findIndex(pile => pile > 0);
        return [index, arr[index] - 1];
    }
    for (let i = 0; i < 3; i++) {
        let newPile = arr[i] ^ xorSum;
        if (newPile < arr[i]) return [i, newPile];
    }
}

function computerMove() {
    playerModeOff();
    document.getElementById("game-heading").innerText = "Opponent's move...";
    setTimeout(() => {
        if (piles.every(p => p === 0)) {
            showGameOverScreen("Hurrah! You won!", "green");
            return;
        }
        let [index, newValue] = calculateMove(piles);
        piles[index] = newValue;
        history.push(piles.slice());
        showApples(piles);
        document.getElementById("game-heading").innerText = "Play your move!";
        if (piles.every(p => p === 0)) {
            showGameOverScreen("Oops! You lost", "red");
            return;
        }
        playerModeOn();
    }, 2000);
}

function replayLastMove() {
    if (history.length > 1) {
        history.pop();
        piles = history[history.length - 1].slice();
        showApples(piles);
        document.getElementById("game-heading").innerText = "Play your move!";
        playerModeOn();
    }
}

function showGameOverScreen(message, color) {
    let modal = document.createElement("div");
    modal.className = "modal";
    modal.style.display = "flex";
    modal.innerHTML = `<div class='modal-content'><h2 style='color:${color}'>${message}</h2>
    <button class='game-button' onclick='window.location.reload()'>Replay</button>
    <button class='game-button' onclick='goBack()'>Go Back</button></div>`;
    document.body.appendChild(modal);
}

function goBack() {
    cancelSelection(); 
    localStorage.clear();
    window.location.href = 'nim_game.html';
}

function showModal(modalId) {
    document.getElementById(modalId).style.display = "flex";
}

function hideModal(modalId) {
    document.getElementById(modalId).style.display = "none";
}