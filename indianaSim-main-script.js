// Your web app's Firebase configuration
  const table = document.querySelector('table')

  var firebaseConfig = {
    apiKey: "AIzaSyB9d2uLbaWtqiBv2UosQ-8MaSHz70kZZ0c",
    authDomain: "indianasim-d1e13.firebaseapp.com",
    databaseURL: "https://indianasim-d1e13.firebaseio.com",
    projectId: "indianasim-d1e13",
    storageBucket: "indianasim-d1e13.appspot.com",
    messagingSenderId: "223949345056",
    appId: "1:223949345056:web:fb2aaf3d27a5ac68ee4745",
    measurementId: "G-88CP9BDCF0"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();

  var mapHeight = 8;
  var mapWidth = 8;

  const player1 = document.querySelector('#player1');
  const player1Score = document.querySelector('#player1Score');
  const player2 = document.querySelector('#player2');
  const player2Score = document.querySelector('#player2Score');
  const cells = document.querySelectorAll('td');

  var width = null;
  var height = null;

  var coorx = 0;
  var coory = 0;

  var score = 0;
  var cellsInt = '001100021021110110101010010202011101000010000110021200121000122';

  let isTurn = true;

  window.onload= () => {
      resize();
      updatePlayer1(0, 0, 0);
}

function winnerFound(){
    let winner = true;
    for(let i = 0; i < cells.length; i++){
        if(!(cells[i].classList.contains('noCorn'))){
            winner = false;
        }
    }

    if(winner) {
        window.location.href = "indianaSim-end.html";
    }
}



  function resize() {
    width = cells[0].offsetWidth;
    height = cells[0].offsetHeight;

    // adjust player size
    var playerWidth = width*2/3;
    var playerHeight = height*2/3;
    player1.style.width = playerWidth + "px";
    player1.style.height = playerHeight + "px";
    player2.style.width = playerWidth + "px";
    player2.style.height = playerHeight + "px";

  // adjust player postition
    player1.style.left = (width/2 - playerWidth/2) + "px";
    player1.style.top = (height/2 - playerHeight/2) + "px";
    player2.style.left = (width/2 - playerWidth/2) + "px";
    player2.style.top = (height/2 - playerHeight/2) + "px";


     for(let i = 0; i < cellsInt.length; i++){
        if(cellsInt.charAt(i) == '0'){
           cells[i].classList.add('noCorn');
        } else if(cellsInt.charAt(i) == '1') {
               cells[i].classList.add('corn');
        } else if(cellsInt.charAt(i) == '2') {
               cells[i].classList.add('primeCorn');
        }
     }

    const gameStateRefObject = database.ref().child('player1').set({
        score: score,
        x: coorx,
        y: coory
    });




  }



  var database = firebase.database();
  const gameStateRefObject = database.ref().child('player2');

  gameStateRefObject.on('value', snap => {
       updatePlayer2(snap.val());
       isTurn = true;
  });



  function updatePlayer2(objVal) {
      if(width != null && height != null){
          let x = objVal.x;
          let y = objVal.y;

          player2.style.left = (x * width) + "px";
          player2.style.top = (y * height) + "px";
          player2.innerHTML = `<center>${objVal.score}</center>`;

          updateTerrainPlayer2(table.firstElementChild.rows[y].cells[x]);
      }

  }

  function updatePlayer1(coorX, coorY, score){
      database.ref().child('player1').set({
          score: score,
          x: coorx,
          y: coory
      });
  }

  function updateTerrain(coorX, coorY) {
    if (cells[coorX + (mapWidth * coorY)].classList.contains('corn')) {
      /// REVIEW: update scores for corn
      cells[coorX + (mapWidth * coorY)].classList.remove('corn');
      cells[coorX + (mapWidth * coorY)].classList.add('noCorn');
      incScore(1);
    } else if (cells[coorx + (mapWidth * coorY)].classList.contains('primeCorn')) {
      // REVIEW: update score for prme corn

      cells[coorX + (mapWidth * coorY)].classList.remove('primeCorn');
      cells[coorX + (mapWidth * coorY)].classList.add('noCorn');
      incScore(2);
    }
  }

  function updateTerrainPlayer2(player2Cell) {
      if (player2Cell.classList.contains('corn')) {
        /// REVIEW: update scores for corn
        player2Cell.classList.remove('corn');
        player2Cell.classList.add('noCorn');
    } else if (player2Cell.classList.contains('primeCorn')) {
        // REVIEW: update score for prme corn
        player2Cell.classList.remove('primeCorn');
        player2Cell.classList.add('noCorn');
      }
      winnerFound();
  }

  function incScore(toAddScore){
      score += toAddScore;
      updatePlayer1(coorx, coory, score);
      player1.innerHTML = `<center>${score}</center>`
  }


  // Player movement
  function move(event) {
    var k = event.keyCode,

      chr = {
          updown: function () {
              var y = player1.offsetTop;
              if (k == 38) {
                if (coory > 0) {
                  --coory;

                  updatePlayer1(coorx, coory, score);
                  y = y - height;
                  updateTerrain(coorx, coory);
                  window.scrollY -= `${100}px`;
                  isTurn = false;

                }
            } else if (k == 40) {
                if (coory < mapHeight-1) {
                  ++coory;
                  updatePlayer1(coorx, coory, score);
                  y = y + height;
                  updateTerrain(coorx, coory);
                  isTurn = false;

                }
              }

              return y;
          },

          leftright: function () {
              var x = player1.offsetLeft;
              if (k == 37) {
                if (coorx > 0) {
                  --coorx;
                  updatePlayer1(coorx, coory, score);
                  x = x - width;
                  updateTerrain(coorx, coory);
                  isTurn = false;

                }
              } else if (k == 39) {
                if (coorx < mapWidth-1) {
                  ++coorx;
                  updatePlayer1(coorx, coory, score);
                  x = x + width;
                  updateTerrain(coorx, coory);
                  isTurn = false;


                }
              }

              return x;
          }
      };

      player1.style.top = (chr.updown()) + "px";
      player1.style.left = (chr.leftright()) + "px";
      isTurn = false;
      winnerFound();

  }

  document.addEventListener('keydown', (e) => {
      if(isTurn){
          move(e);
      }
  });
