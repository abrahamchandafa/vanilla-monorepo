let xScore = sessionStorage.x ?? 0;
let oScore = sessionStorage.o ?? 0;
if (!xScore) {
    sessionStorage.x = 0;
}
if (!oScore) {
    sessionStorage.o = 0;
}

let os = document.getElementById('o-score');
let xs = document.getElementById('x-score');


let o = document.getElementById("nought");
let x = document.getElementById("cross");
let oDiv = document.querySelector(".nought");
let xDiv = document.querySelector(".cross");


const choices = ["nought", "cross"];

let xRed = new Image();
xRed.src = 'X-red.png';

let oGreen = new Image();
oGreen.src = 'O-green.png';

let cross = new Image();
cross.src = 'Cross.png';
cross.setAttribute("draggable", "false");

let nought = new Image();
nought.src = 'Nought.png';
nought.setAttribute("draggable", "false");


// GAMEPLAY CODE START
let match = [ // nought 1, cross = 2
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
]
let count = 0;

function gamePlay (id, index) {
    let ind =  Number.parseInt(index);
    count += 1
    row = Math.floor(ind / 3);
    col = ind % 3;
    if (id === "nought"){
        match[row][col] = 1;
    } else if (id === "cross") {
        match[row][col] = 2;
    }

    console.log(count, match)
    //check for winner
    if (match[0][0] && match[0][0] === match[1][0] && match[1][0] === match[2][0]){
        if (match[0][0] === 1)
            gameOver("nought");
        else
            gameOver("cross");
    }
    else if (match[0][1] && match[0][1] === match[1][1] && match[1][1] === match[2][1]){
        if (match[0][1] === 1)
            gameOver("nought");
        else
            gameOver("cross");
    }
    else if (match[0][2] && match[0][2] === match[1][2] && match[1][2] === match[2][2]){
        if (match[0][2] === 1)
            gameOver("nought");
        else
            gameOver("cross");
    }
    else if (match[0][0] && match[0][0] === match[0][1] && match[0][1] === match[0][2]){
        if (match[0][0] === 1)
            gameOver("nought");
        else
            gameOver("cross");
    }
    else if (match[1][0] && match[1][0] === match[1][1] && match[1][1] === match[1][2]){
        if (match[1][0] === 1)
            gameOver("nought");
        else
            gameOver("cross");
    }
    else if (match[2][0] && match[2][0] === match[2][1] && match[2][1] === match[2][2]){
        if (match[2][0] === 1)
            gameOver("nought");
        else
            gameOver("cross");
    }
    else if (match[0][0] && match[0][0] === match[1][1] && match[1][1] === match[2][2]){
        if (match[0][0] === 1)
            gameOver("nought");
        else
            gameOver("cross");
    }
    else if (match[0][2] && match[0][2] === match[1][1] && match[1][1] === match[2][0]){
        if (match[0][2] === 1)
            gameOver("nought");
        else
            gameOver("cross");
    } else if (count === 9) {
        gameOver("tie");
    }
}

function gameOver(result) { // "tie", "cross", "nought"
    let foot = document.createElement('p');
    let footer = document.getElementById('game-over');
    
    if (result === "cross") {
        foot.innerHTML = `<b>X wins the game!!!</b>`;
        let xx = Number.parseInt(sessionStorage.x);
        xx += 1;
        sessionStorage.x = xx;
    } else if (result === "nought") {
        foot.innerHTML = `<b>O wins the game!!!</b>`;
        let oo = Number.parseInt(sessionStorage.o);
        oo += 1;
        sessionStorage.o = oo;
    } else {
        foot.innerHTML = `<b>We have a tie!</b>`;
    }
    let btn = document.createElement('button');
    btn.textContent = 'Restart';
    btn.addEventListener('click', () => location.reload())

    os.textContent = sessionStorage.o;
    xs.textContent = sessionStorage.x;

    o.setAttribute("draggable", "false");
    x.setAttribute("draggable", "false");
    oDiv.style.border = "none";
    xDiv.style.border = "none";
    footer.append(foot);
    footer.append(btn);
}

// GAMEPLAY CODE END

function drag (event) {
    if (event.target.id === "nought"){
        event.dataTransfer.setDragImage(oGreen, 0, 0);
    } else {
        event.dataTransfer.setDragImage(xRed, 0, 0);
    }
    event.dataTransfer.setData("text/plain", event.target.id);
}

function dropHandler (event) {
    event.preventDefault();
    let item = event.dataTransfer.getData("text/plain");
    if (item === "nought"){
        event.target.appendChild(nought.cloneNode(true));
        playerToggler("cross");
    } else if (item === "cross") {
        event.target.appendChild(cross.cloneNode(true));
        playerToggler("nought");
    }
    gamePlay(item, event.target.getAttribute('data-index'));
}

function allow(event){
    if (event.target.className === "box" && event.target.children.length === 0){
        event.preventDefault();
    }
}

function playerToggler (id) {  
    if (id === "nought") {
        o.setAttribute("draggable", "true");
        x.setAttribute("draggable", "false");
        oDiv.style.border = "2px solid red";
        xDiv.style.border = "none";
        
    } else {
        x.setAttribute("draggable", "true");
        o.setAttribute("draggable", "false");
        xDiv.style.border = "2px solid red";
        oDiv.style.border = "none";
    }
}

window.onload = () => {
    playerToggler(choices[Math.floor(Math.random() * 2)]);
    os.textContent = sessionStorage.o;
    xs.textContent = sessionStorage.x;
}
