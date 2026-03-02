const board = document.getElementById("board");
const statusText = document.getElementById("status");
const restartBtn = document.getElementById("restart");

let cells = [];
let gameActive = true;
let currentPlayer = "X";
let gameState = ["","","","","","","","",""];

const winPatterns = [
[0,1,2],[3,4,5],[6,7,8],
[0,3,6],[1,4,7],[2,5,8],
[0,4,8],[2,4,6]
];

function createBoard(){
board.innerHTML="";
cells=[];
gameState=["","","","","","","","",""];
gameActive=true;
currentPlayer="X";
restartBtn.classList.add("hidden");
statusText.textContent="Your Turn";

for(let i=0;i<9;i++){
let cell=document.createElement("div");
cell.classList.add("cell");
cell.setAttribute("data-index",i);
cell.addEventListener("click",handleClick);
board.appendChild(cell);
cells.push(cell);
}
}

function handleClick(e){
let index=e.target.getAttribute("data-index");

if(gameState[index]!=="" || !gameActive) return;

makeMove(index,"X");

if(gameActive){
setTimeout(aiMove,600);
}
}

function makeMove(index,player){
gameState[index]=player;
cells[index].textContent=player;
cells[index].classList.add(player.toLowerCase());

checkResult();
}

function aiMove(){
let bestMove = minimax(gameState,"O").index;
makeMove(bestMove,"O");
}

function minimax(newBoard,player){
let availSpots = newBoard.map((v,i)=>v===""?i:null).filter(v=>v!==null);

if(checkWin(newBoard,"X")) return {score:-10};
if(checkWin(newBoard,"O")) return {score:10};
if(availSpots.length===0) return {score:0};

let moves=[];

for(let i=0;i<availSpots.length;i++){
let move={};
move.index=availSpots[i];
newBoard[availSpots[i]]=player;

if(player==="O"){
let result=minimax(newBoard,"X");
move.score=result.score;
}else{
let result=minimax(newBoard,"O");
move.score=result.score;
}

newBoard[availSpots[i]]="";
moves.push(move);
}

let bestMove;
if(player==="O"){
let bestScore=-10000;
for(let i=0;i<moves.length;i++){
if(moves[i].score>bestScore){
bestScore=moves[i].score;
bestMove=i;
}
}
}else{
let bestScore=10000;
for(let i=0;i<moves.length;i++){
if(moves[i].score<bestScore){
bestScore=moves[i].score;
bestMove=i;
}
}
}
return moves[bestMove];
}

function checkWin(board,player){
return winPatterns.some(pattern=>{
return pattern.every(index=>board[index]===player);
});
}
function updateStatus(message) {
    statusText.innerText = message;
}
//here is the function who added for update status 
function checkResult(){
if(checkWin(gameState,"X")){
statusText.textContent="You Win!";
gameActive=false;
restartBtn.classList.remove("hidden");
}
else if(checkWin(gameState,"O")){
statusText.textContent="AI Wins!";
gameActive=false;
restartBtn.classList.remove("hidden");
}
else if(!gameState.includes("")){
statusText.textContent="Draw!";
gameActive=false;
restartBtn.classList.remove("hidden");
}
}

restartBtn.addEventListener("click",createBoard);

createBoard();