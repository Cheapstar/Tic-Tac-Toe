let container = document.querySelector(".container");
let cellList = document.querySelectorAll(".cellInput");
let turnCount =0;


// ['X','X','O','O','X','X','X','O','O']

let GameBoard = (function (){
    let gameboard = new Array(9);
    gameboard = ['P','P','P','P','P','P','P','P','P'];

    function reset(){
        for(let i = 0 ; i<9 ; i++){
            gameboard[i]='P';
        }
    }

    

    for(let i=0 ; i<9 ;i++){
        cellList[i].addEventListener("input",()=>{
            
            if(Game.playerOne.getLock()==1 && Game.playerTwo.getLock()==0){
                Game.playerOne.lockSwitch();
                Game.playerTwo.lockSwitch();
                displayController.toggleColor(2);
                fillAndCheck(i,Game.playerOne);
                
                
            }
            else if(Game.playerOne.getLock()==0 && Game.playerTwo.getLock()==1){
                Game.playerTwo.lockSwitch();                
                Game.playerOne.lockSwitch();
                displayController.toggleColor(2);
                fillAndCheck(i,Game.playerTwo);
                
            }
     
        });

        cellList[i].addEventListener("dblclick",()=>{
            cellList[i].dispatchEvent(new Event('input'));
        });
        
        
    }

    function fillAndCheck(i,player){
        gameboard[i]=player.marker;
        cellList[i].value=player.marker;
        cellList[i].setAttribute("readOnly","true");
        
        
        turnCount++;

        if(turnCount>=5){
            let result = Game.checkResult(i,player);
            displayController.satisfaction(result);
        }
    }
    


    return {gameboard,reset};
    })();



function Player(name,marker){
    let lock=0;

    function getLock(){
        return lock;
    }

    function lockSwitch(){
        if(lock==0){
            lock=1;
            return;
        }
        lock=0;
        return;
    }
    function resetLock(){
        lock=0;
    }
    return {name,marker,getLock,lockSwitch,resetLock};
}




let displayController = ( function(){
    //Modal dialog
    let modal = document.querySelector("#detailsForm");
    let startButton = document.querySelector(".startButton");

    startButton.addEventListener("click",()=>{
        modal.showModal();
    });

    //input fields
    let playerOneName = document.querySelector("#playerOneName");
    let playerTwoName = document.querySelector("#playerTwoName");

    //labels for Name
    let playerOne = document.querySelector(".playerOne");
    let playerTwo = document.querySelector(".playerTwo");

    let playButton = document.querySelector(".playButton button");
    let replayButton = document.querySelector(".replayButton");

    playButton.addEventListener("click",()=>{

        resetDisplay();
        GameBoard.reset();
        Game.gameReset();
        resetColor();
        

        playerOne.textContent = playerOneName.value;
        playerTwo.textContent = playerTwoName.value;
        Game.setName(playerOneName.value,playerTwoName.value);

        

        let checkedButton = document.querySelector("input[type='radio'][name=Choice]:checked");

        Game.activate(checkTurn(checkedButton.value));
        
    });

    replayButton.addEventListener("click",()=>{
        winnerDialog.close();
        startButton.dispatchEvent(new Event("click"));
    });


    //radio Buttons

    

    function checkTurn(value){
        
        if(value=='x'){
            return 'x';
        }
        else if(value=='o'){
            return'o';
        }
    }

    //class Toggle on the class
    function toggleColor(flag){
        if(flag==0){
            playerOne.classList.toggle("playing");
        }
        else if(flag==1){
            playerTwo.classList.toggle("playing");
        }
        else{
            playerOne.classList.toggle("playing");
            playerTwo.classList.toggle("playing");
        }
    } 

    function resetColor(){
        playerOne.classList.remove("playing");
        playerTwo.classList.remove("playing");
    }
    
    //Winner Modal Dialog
    let winnerDialog = document.querySelector("#winnerAnnouncement");
    let winner = document.querySelector("#winnerAnnouncement p");

    function satisfaction(result){
        if(result==true){
            winner.textContent=`${Game.winner.name}  wins`;  
             winnerDialog.showModal();
        }
        else if (result==false && Game.winner==100){
            winner.textContent=`Tie`;
            winnerDialog.showModal();
        }
        
    }

    //reset display
    function resetDisplay(){
        for(let i = 0; i<9;i++){
            cellList[i].value="";
        }
    }
    
    

    return {satisfaction,toggleColor,resetDisplay};
})();



let  Game = (function(){
    let gameboard = GameBoard.gameboard;
    let result = false;
    let winner = 101;

    let playerOne = Player("Player-1","x");
    let playerTwo = Player("Player-2","o");


    //activate
    function activate(val){
        if(val=='x'){
            playerOne.lockSwitch();
            displayController.toggleColor(0);
        }
        else{
            playerTwo.lockSwitch();
            displayController.toggleColor(1);
        }
    }
    //setting the Name of the players

    function setName(firstName,secondName){
        playerOne.name = firstName;
        playerTwo.name = secondName;
    }


    function gameReset(){
        result=false;
        this.winner=101;
        playerOne.resetLock();
        playerTwo.resetLock();
        turnCount=0;
    }

    //function checking the provided conditions
    function checkingCondition(val,index,increment){
        let result = true;
        for(let i=0 ; i<3 ; i++){
            if(gameboard[index]!=val){
                result =  false ; 
                break;
            }
            index+=increment;
        }
        return result;
    }

    


    // checks for the combination in checkingHorizontal row
    function checkingHorizontal(val,index){
        let start = 0;
        let result=true;

        if(index>=3 && index <6){
            start = 3;
        }
        else if (index >= 6){
             start = 6;
        }
        else {}
        
        result = checkingCondition(val,start,1);
        return result;
    }


    // checks for the combination in checkingVertical row
    function checkingVertical(val , index){
        let start = 0;
        let result =true;
        if(index==0 || index==3 || index==6){
            start = 0;
        }
        else if (index==1 || index==4 || index==7){
            start = 1;
        }
        else {
            start = 2;
        }
        
        result = checkingCondition(val,start,3);
        return result ;
    }


    // for checkingDiagonal 
    function checkingDiagonal(val , index){
        let result = true ;
        let start = 0;
        if(index==0 || index==4 || index==8){
            result = checkingCondition(val,start,4);
        }
        else if (index==2 || index==4 || index==6){
            start = 2; 
            result = checkingCondition(val,start,2);
        }
        else{}

        return result;
    }


    
    function checkResult(i,player){
        if(( i%2==0 )&&(checkingVertical(player.marker,i) || checkingHorizontal(player.marker,i) || checkingDiagonal(player.marker,i))){
            this.winner = player ; 
            return true;
        }
        else if (( i%2!=0 )&&(result = checkingVertical(player.marker,i) || checkingHorizontal(player.marker,i))){
            this.winner = player ;
            return true;
        }
        else if(turnCount == 9){
            this.winner = 100;
            return false;
        }
        return false;
    }
    return {playerOne,playerTwo,setName,activate,gameReset,winner , checkResult};
    
})();

