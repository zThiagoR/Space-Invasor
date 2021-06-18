const jogador = document.querySelector('.player')
const area = document.querySelector('#main-play-area')
const alienImg = ['img/monster-1.png', 'img/monster-2.png', 'img/monster-3.png']
const startButton = document.querySelector('.start-button');
const instructionsText = document.querySelector('.game-instructions');
let alienInterval;


function Fly(event) {
    if(event.key === 'ArrowUp' || event.keyCode === 87) {
        event.preventDefault();
        moveUP();
    } else if (event.key === 'ArrowDown' || event.keyCode === 83) {
        event.preventDefault();
        moveDown();
    } else if (event.keyCode === 32) {
        event.preventDefault()
        fireLaser();
    }
}


function moveUP() {
    let TopPosition = getComputedStyle(jogador).getPropertyValue("top");

    if(TopPosition === "20px") {
        console.log("parou na subida")
        return;
    } else {
        let position = parseInt(TopPosition)
        position -= 30;
        jogador.style.top = `${position}px`
    }
}

function moveDown() {
    let TopPosition = getComputedStyle(jogador).getPropertyValue("top");

    if(TopPosition === "540px") {
        console.log("parou na descida")
        return;
    } else {
        let position = parseInt(TopPosition)
        position += 20;
        jogador.style.top = `${position}px`
    }
}

function fireLaser() {
    let laser = createLaserElement();
    area.appendChild(laser);
    moveLaser(laser);
}

function createLaserElement() {
    let xPosition = parseInt(window.getComputedStyle(jogador).getPropertyValue('left'));
    let yPosition = parseInt(window.getComputedStyle(jogador).getPropertyValue('top'));
    let newLaser = document.createElement('img');
    newLaser.src = 'img/shoot.png';
    newLaser.classList.add('laser');
    newLaser.style.left = `${xPosition}px`;
    newLaser.style.top = `${yPosition - 10}px`;
    return newLaser;
}

function moveLaser(laser) {
    let laserInterval = setInterval(() => {
        let xPosition = parseInt(laser.style.left);
        let aliens = document.querySelectorAll('.alien');

        aliens.forEach((alien) => { //comparando se cada alien foi atingido, se sim, troca o src da imagem
            if(CheckColission(laser, alien)) {
                alien.src = 'img/explosion.png';
                alien.classList.remove('alien');
                alien.classList.add('dead-alien');
            }
        })

        if(xPosition === 340) {
            laser.remove();
        } else {
            laser.style.left = `${xPosition + 8}px`;
        }
    }, 10);
}

function createAliens() {
    let newAlien = document.createElement('img');
    let alienSprite = alienImg[Math.floor(Math.random() * alienImg.length)];
    newAlien.src = alienSprite;
    newAlien.classList.add('alien');
    newAlien.classList.add('alien-transition');
    newAlien.style.left = '360px';
    newAlien.style.top = `${Math.floor(Math.random() * 330) + 30}px`;
    area.appendChild(newAlien);
    moveAlien(newAlien);
}

function moveAlien(alien) {
    let moveAlienInterval = setInterval(() => {
    let xPosition = parseInt(window.getComputedStyle(alien).getPropertyValue('left'));

        if(xPosition <= 50) {
            if(Array.from(alien.classList).includes('dead-alien')) {
                alien.remove();
            } else {
                gameOver();
            }
        } else {
            alien.style.left = `${xPosition - 4}px`;
        }
    }, 30);
}

function CheckColission(laser, alien) {
    let laserTop = parseInt(laser.style.top);
    let laserLeft = parseInt(laser.style.left);
    let laserBottom = laserTop - 20;

    let alienTop = parseInt(alien.style.top);
    let alienLeft = parseInt(alien.style.left);
    let alienBottom = alienTop - 30;

    if(laserLeft != 340 && laserLeft + 40 >= alienLeft) {
        if(laserTop <= alienTop && laserTop >= alienBottom) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

startButton.addEventListener('click', (event) => {
    playGame();
})

function playGame() {
    startButton.style.display = 'none';
    instructionsText.style.display = 'none';
    window.addEventListener('keydown', Fly);
    alienInterval = setInterval(() => {
        createAliens();
    }, 2000);
}

function gameOver() {
    window.removeEventListener('keydown', Fly);
    clearInterval(alienInterval);
    let aliens = document.querySelectorAll('.alien');
    aliens.forEach((alien) => alien.remove());
    let lasers = document.querySelectorAll('.laser');
    lasers.forEach((laser) => laser.remove());
    setTimeout(() => {
        alert('game over!');
        jogador.style.top = "250px";
        startButton.style.display = "block";
        instructionsText.style.display = "block";
    });
}