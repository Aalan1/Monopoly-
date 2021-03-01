
var board_x = [900,800,700,620,540,460,380,310,230,120,5,5,5,5,5,5,5,5,5,5,5,120,230,310,380,460,540,620,700,800,900,900,900,900,900,900,900,900,900,900];
var board_y = [780,780,780,780,780,780,780,780,780,780,780,705,635,560,490,415,340,275,180,110,5,5,5,5,5,5,5,5,5,5,5,110,180,275,340,415,490,560,635,705];

class Player {
   constructor(name, doubles, money, jailCard, position_x,position_y, position) {
      this.name=name;
      this.doubles=doubles;
      this.money=money;
      this.jailCard=jailCard;
      this.jail=false;
      this.x=position_x;
      this.y=position_y;
      this.position=0;
   }
   getMoney() {
      return "$" + this.money;
   }

   addMoney(amount) {
      this.money = this.money + amount;
   }
   removeMoney(amount) {
      this.money = this.money - amount;
   }
   addJailCard(){
      this.jailCard = 1;
   }
   rolledDouble(){
      this.doubles = this.doubles + 1;
   }
   resetDoubles(){
      this.doubles = 0;
   }
   setPosition(boardIndex){
      if (this.name=="Dog"){
         this.x=board_x[boardIndex];
         this.y=board_y[boardIndex];
      } else if (this.name=="Tophat") {
         this.x=board_x[boardIndex]+40;
         this.y=board_y[boardIndex];
      } else if (this.name=="Boot") {
         this.x=board_x[boardIndex];
         this.y=board_y[boardIndex]+40;
      } else {
         this.x=board_x[boardIndex]+40;
         this.y=board_y[boardIndex]+40;
      }
   }
}

let player1 = new Player("Dog",0,1500,0,900,780,0);
let player2 = new Player("Tophat",0,1500,0,940,780,0);
let player3 = new Player("Boot",0,1500,0,900,820,0);
let player4 = new Player("Battleship",0,1500,0,940,820,0);

var current_player = 0;

var playerList = [player1,player2,player3,player4];

function updateBank() {
    document.getElementById("playerMoney1").innerHTML = player1.getMoney();
    document.getElementById("playerMoney2").innerHTML = player2.getMoney();
    document.getElementById("playerMoney3").innerHTML = player3.getMoney();
    document.getElementById("playerMoney4").innerHTML = player4.getMoney();
}


//Load the board onto the canvas
window.onload = function loadBoard() {
    updateBank();
    var canvas = document.getElementById("MonopolyCanvas");
    var ctx = canvas.getContext("2d");
    var img = document.getElementById("MonopolyBoard");
    ctx.drawImage(img, 0, 0);
    var token = document.getElementById("Dog");
    var token2 = document.getElementById("Tophat");
    var token3 = document.getElementById("Boot");
    var token4 = document.getElementById("Battleship");
    // Load token starting positions
    ctx.drawImage(token,900,780,40,40);
    ctx.drawImage(token2,940,780,40,40);
    ctx.drawImage(token3,900,820,40,40);
    ctx.drawImage(token4,940,820,40,40);
}

function moveToken(board_index) {
    var canvas = document.getElementById("MonopolyCanvas");
    var ctx = canvas.getContext("2d");
    var img = document.getElementById("MonopolyBoard");
    ctx.drawImage(img, 0, 0);
    var token = document.getElementById("Dog");
    var token2 = document.getElementById("Tophat");
    var token3 = document.getElementById("Boot");
    var token4 = document.getElementById("Battleship");
    // Move only the token, leave the rest of the others in their positions
    playerList[current_player].setPosition(board_index);
    ctx.drawImage(token,player1.x,player1.y,40,40);
    ctx.drawImage(token2,player2.x,player2.y,40,40);
    ctx.drawImage(token3,player3.x,player3.y,40,40);
    ctx.drawImage(token4,player4.x,player4.y,40,40);    
}

function rollDice() {

   var firstDie = Math.floor(Math.random() * 6) + 1;
   var secondDie = Math.floor(Math.random() * 6) + 1;
   var dub = 0;
   // change the dice images
   document.getElementById("firstDieImage").src = "Monopoly/Dice/" + firstDie + ".png";
   document.getElementById("secondDieImage").src = "Monopoly/Dice/" + secondDie + ".png";

   alert(playerList[current_player].name + " rolled a " + firstDie + " and a " + secondDie)

   // check to see if double
   if (firstDie == secondDie) {
       dub = 1;
       alert("Rolled a double!")
       playerList[current_player].rolledDouble();
   } else {
       playerList[current_player].resetDoubles();
   }
   if (playerList[current_player].doubles == 3) {
       // Go to jail
       playerList[current_player].position = 10;
       playerList[current_player].jail = true;
       playerList[current_player].resetDoubles();
       moveToken(playerList[current_player].position);
   } else {
       // move player token
       if ((firstDie + secondDie + playerList[current_player].position) > 39){
           // pass Go, collect $200
	   alert("Passed GO, collect $200!")
           playerList[current_player].position = ((firstDie + secondDie + playerList[current_player].position) - 40);
           playerList[current_player].addMoney(200);
           updateBank();
       } else {
           playerList[current_player].position = playerList[current_player].position + firstDie + secondDie;
       }
       moveToken(playerList[current_player].position);
       landedOn();
   }
   if (dub == 0) {
	current_player = current_player + 1;
        if (current_player == 4){
            current_player = 0;
        }
        if (playerList[current_player].jail) {
             alert("In Jail, pay $50 fine")
             playerList[current_player].jail = false;
        }
   }
}

function landedOn(){
   var communityChest = [2,17,33];
   var chance = [7,22,36];
   if (playerList[current_player].position == 4){
        alert("Income Tax, pay $200")
        playerList[current_player].removeMoney(200);
        updateBank();
   } else if (playerList[current_player].position == 38) {
	alert("Luxury Tax, pay $100")
        playerList[current_player].removeMoney(100);
        updateBank();
   } else if (playerList[current_player].position == 30) {
        alert("Go to Jail!")
        playerList[current_player].position = 10;
        moveToken(playerList[current_player].position);
        playerList[current_player].jail = true;
        playerList[current_player].resetDoubles();
   } else if (communityChest.includes(playerList[current_player].position)){
        alert("Landed on Community Chest!");
   } else if (chance.includes(playerList[current_player].position)){
   	alert("Landed on Chance!");
   } else if (playerList[current_player].position == 10) {
	alert("Just Visiting");
   } else if (playerList[current_player].position == 20) {
  	alert("Free Parking!");
   } else {
        buyProperty(playerList[current_player].position);
        updateBank();
   }
}

class Property {
      constructor(name, color, rentLst, prices) {
          this.name = name;
          this.color = color;
          this.rent = rentLst;
          this.price = Prices;
          this.owner = null;
          this.current_rent=this.rent;
          this.mortgage=0;
      }
      getRentCost(option){
          return this.rent[option];
      } 
      getPropertyPrice() {
          return this.prices[0];
      }  
      getMortgagePrice() {
          return this.prices[1];
      }
      getHousePrice(){
          return this.prices[2];
      }
}

var Brown1 = Property("Mediterranean Avenue", [2,4,10,30,90,160,250],[60,30,50]);
var Brown2 = Property("Baltic Avenue", [4,8,20,60,180,320,450],[60,30,50]);
var LightBlue1 = Property("Oriental Avenue", [6,12,30,90,270,400,500],[100,50,50]);
var LightBlue2 = Property("Vermont Avenue", [6,12,30,90,270,400,550],[100,50,50]);
var LightBlue3 = Property("Connecticut Avenue", [8,16,40,100,300,450,600],[120,60,50]);
var Pink1 = Property("St. Charles Avenue", [10,20,50,150,450,625],[140,70,100]);
var Pink2 = Property("States Avenue", [10,20,50,150,450,625,750],[140,70,100]);
var Pink3 = Property("Virginia Avenue", [12,24,60,180,500,700,900],[160,80,100]);
var Orange1 = Property("St. James Place", [14,28,70,200,550,750,950],[180,90,100]);
var Orange2 = Property("Tennessee Avenue", [14,28,70,200,550,750,950],[180,90,100]);
var Orange3 = Property("New York Avenue", [16,32,80,220,600,800,1000],[200,100,100]);
var Red1 = Property("Kentucky Avenue", [18,36,90,250,700,875,1050],[220,110,150]);
var Red2 = Property("Indiana Avenue", [18,36,90,250,700,875,1050],[220,110,150]);
var Red3 = Property("Illinois Avenue", [20,40,100,300,750,925,1100],[240,120,150]);
var Yellow1 = Property("Atlantic Avenue", [22,44,110,330,800,975,1150],[260,130,150]);
var Yellow2 = Property("Ventnor Avenue", [22,44,110,330,800,975,1150],[260,130,150]);
var Yellow3 = Property("Marvin Gardens", [24,48,120,360,850,1025,1200],[280,140,150]);
var Green1 = Property("Pacific Avenue", [26,52,130,390,900,1100,1275],[300,150,200]);
var Green2 = Property("North Carolina Avenue", [26,52,130,390,900,1100,1275],[300,150,200]);
var Green3 = Property("Pennsylvania Avenue", [28,56,150,450,1000,1200,1400],[320,160,200]);
var Blue1 = Property("Park Place", [35,70,175,500,1100,1300,1500],[350,175,200]);
var Blue2 = Property("Boardwalk", [50,100,200,600,1400,1700,2000],[400,200,200]);
var Station1 = Property("Reading Railroad", [25,50,100,200], [200,100]);
var Station2 = Property("Pennsylvania Railroad", [25,50,100,200], [200,100]);
var Station3 = Property("B. & O. Railroad", [25,50,100,200], [200,100]);
var Station4 = Property("Short Line", [25,50,100,200], [200,100]);
var Utility1 = Property("Electric Company", [4,10], [150,75]);
var Utility2 = Property("Water Works", [4,10], [150,75]);

var propertyList = [Brown1, null, Brown2, null, Station1, LightBlue1, null, LightBlue2, LightBlue2,
 null, Pink1, Utility1, Pink2, Pink3, Station2, Orange1, null, Orange2,Orange3,
null, Red1, null, Red2, Red3, Station3, Yellow1, Yellow2, Utility2, Yellow3, null,
Green1, Green2, null, Green3, Station4, null, Blue1, null, Blue2]

function buyProperty(propertyIndex){
   if (current_player == 0){
       var table = document.getElementById("Portfolio1");
   } else if (current_player == 1){
       var table = document.getElementById("Portfolio2");
   } else if (current_player == 2){
       var table = document.getElementById("Portfolio3");
   } else {
       var table = document.getElementById("Portfolio4");
   }
   var row = table.insertRow();
   var cell1 = row.insertCell(0);
   var cell2 = row.insertCell(1);
   var cell3 = row.insertCell(2);
   cell1.innerHTML = propertyList[propertyIndex].name;
   cell2.innerHTML = propertyList[propertyIndex].current_rent;
   cell3.innerHTML = "None";
   propertyList[propertyIndex].owner = current_player;
   playerList[current_player].removeMoney(propertyList[propertyIndex].getPropertyPrice());
}

