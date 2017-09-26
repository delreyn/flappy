/********* VARIAVEIS *********/


// 0: Tela Inicial 
// 1: Tela d Jogo
// 2: Tela de Game-over 

var gameScreen = 0;

var gravidade = 0.3;
var artrito = 0.00001;
var friccao = 0.1;

var bolX, bolY;
var corBol;
var tamBol = 20;
var vertBolVel = 0;
var horizBolVel = 0;

// racket settings
var corRacket;
var racketLargur = 100;
var racketAltur = 10;

//Paredes

var velParede = 5;
var inteParede = 1000;
var ultTemp = 0;
var altBrecMin = 200;
var altBrecMax = 300;
var lagParede = 80;
var corParede;
var paredes = [];

/********* BLOCO SETUP  *********/

function setup() {
  createCanvas(500, 500);
  
  // Defini coordenadas iniciais para a bola
  bolX=width/4;
  bolY=height/5;
  
  smooth();

  corBol = color(0);
  corRacket = color(0);
  corParede = color(44, 62, 80);
}


/********* BLOCO DRAW *********/

function draw() {
  // Mostra o conteudo da tela
  if (gameScreen == 0) {
    initScreen();
  } else if (gameScreen == 1) {
    gameplayScreen();
  } else if (gameScreen == 2) {
    gameOverScreen();
  }
}


/********* CONTEUDOS DE TELA *********/

function initScreen() {
  background(236, 240, 241);
  textAlign(CENTER);
  fill(52, 73, 94);
  textSize(70);
  text("Flappy Pong", width/2, height/2);
  textSize(15); 
  text("Clique para Jogar", width/2, height-30);
}
function gameplayScreen() {
  background(236, 240, 241);
  desBol();
  desRacket();
  aplGravidade();
  manterEmTela();
  aplVelHoriz();
  verQuicaRacket();
  paredeHandler();
  maisParede();
}
function gameOverScreen() {
  background(44, 62, 80);
  textAlign(CENTER);
  fill(236, 240, 241);
  textSize(12);
  text("Seus pontos:", width/2, height/2 - 120);
  textSize(130);
  text(pontos, width/2, height/2);
  textSize(15);
  text("Click para recomeçar", width/2, height-30);
}


/********* INPUTS *********/

function mousePressed() {
  // Se estiver na tela inicial qnd clicar mouse, iniciar jogo
  if (gameScreen==0) { 
    startGame();
  }
  if (gameScreen==2) {
    restart();
  }
}


/********* OUTRAS FUNÇÕES *********/

// INICIA AS VARIAVEIS PARA O JOGO
function startGame() {
  gameScreen=1;
}
function gameOver() {
  gameScreen=2;
}

function restart() {
  pontos = 0;
  saude = saudeMax;
  bolX=width/4;
  bolY=height/5;
  ultTemp = 0;
  paredes = [];
  gameScreen = 1;
}

//Desenha a bola
function desBol() {
  fill(corBol);
  ellipse(bolX, bolY, tamBol, tamBol);
}

//Desenha racket
function desRacket() {
  fill(corRacket);
  rectMode(CENTER);
  rect(mouseX, mouseY, racketLargur, racketAltur, 5);
}

function maisParede() {
  if (millis()- ultTemp > inteParede) {
    var randHeight = round(random(altBrecMin, altBrecMax));
    var randY = round(random(0, height-randHeight));
    // {gapparedeX, gapparedeY, gapparedeLargura, gapparedeAltura, scored}
    var randparede = [width, randY, lagParede, randHeight, 0]; 
    paredes.push(randparede);
    ultTemp = millis();
  }
}
function paredeHandler() {
  for (var i = 0; i < paredes.length; i++) {
    paredeRemover(i);
    paredeMover(i);
    desParede(i);
   // watchparedeCollision(i);
  }
}
function desParede(index) {
  var parede = paredes[index];
  // pega os valores de brecha de parede 
  var brecParedeX = parede[0];
  var brecParedeY = parede[1];
  var brecParedeLargura = parede[2];
  var brecParedeAltura = parede[3];
  // dsenha paredes
  rectMode(CORNER);
  noStroke();
  strokeCap(ROUND);
  fill(corParede);
  rect(brecParedeX, 0, brecParedeLargura, brecParedeY, 0, 0, 15, 15);
  rect(brecParedeX, brecParedeY+brecParedeAltura, brecParedeLargura, height-(brecParedeY+brecParedeAltura), 15, 15, 0, 0);
}
function paredeMover(index) {
  var parede = paredes[index];
  parede[0] -= velParede;
}
function paredeRemover(index) {
  var parede = paredes[index];
  if (parede[0]+parede[2] <= 0) {
    paredes.splice(index, 1);
  }
}

function paredeRemover(index) {
  var parede = paredes[index];
  if (parede[0]+parede[2] <= 0) {
    paredes.splice(index, 1);
  }
}


function verQuicaRacket() {
  var emcima = mouseY - pmouseY;
  if ((bolX+(tamBol/2) > mouseX-(racketLargur/2)) && (bolX-(tamBol/2) < mouseX+(racketLargur/2))) {
    if (dist(bolX, bolY, bolX, mouseY)<=(tamBol/2)+abs(emcima)) {
      fazerQuicarChao(mouseY);
      horizBolVel = (bolX - mouseX)/10;
      // racket se movendo para cima
      if (emcima<0) {
        bolY+=(emcima/2);
        vertBolVel+=(emcima/2);
      }
    }
  }
}


//Aplica gravidade
function aplGravidade() {
  vertBolVel += gravidade;
  bolY += vertBolVel;
  vertBolVel -= (vertBolVel*artrito);
}
function aplVelHoriz() {
  bolX += horizBolVel;
  horizBolVel -= (horizBolVel*artrito);
}
// bola cai e bate no chao 
function fazerQuicarChao(superfi) {
  bolY = superfi - (tamBol/2);
  vertBolVel*=-1;
  vertBolVel -= (vertBolVel*friccao);
}
// bola sobe e bate no teto
function fazerQuicarTeto(superfi) {
  bolY = superfi + (tamBol/2);
  vertBolVel*=-1;
  vertBolVel -= (vertBolVel*friccao);
}
// bola bate no lado esquerdo
function fazerQuicarEsq(superfi) {
  bolX = superfi + (tamBol/2);
  horizBolVel*=-1;
  horizBolVel -= (horizBolVel*friccao);
}
// Bola Bate no lado direito
function fazerQuicarDir(superfi) {
  bolX = superfi - (tamBol/2);
  horizBolVel*=-1;
  horizBolVel -= (horizBolVel * friccao);
}
// manter a bola na tela
function manterEmTela() {
  // bola bate no chao
  if (bolY+(tamBol/2) > height) { 
    fazerQuicarChao(height);
  }
  // ball hits ceiling
  if (bolY-(tamBol/2) < 0) {
    fazerQuicarTeto(0);
  }
  // ball hits left of the screen
  if (bolX-(tamBol/2) < 0) {
    fazerQuicarEsq(0);
  }
  // ball hits right of the screen
  if (bolX+(tamBol/2) > width) {
    fazerQuicarDir(width);
  }
}