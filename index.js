let GameBoard = (function (){
    let gameboard = new Array(9);
    gameboard = ['X','X','O','O','O','O','X','O','O'];

    let cellList = document.querySelectorAll(".cellInput");

    for(let i=0 ; i<9 ;i++){
        cellList[i].addEventListener("change",()=>{
            // let index = Number(cellList[i].getAttribute("data-index"));
            gameboard[i] = cellList[i].value;
            cellList[i].setAttribute("readOnly","true");
        });
    }

    return {gameboard};
    })();


let container = document.querySelector(".container");

let displayController = ( function(){
    //  for(let i =0 ; i<9; i++){
    //     let cell = document.createElement("div");
    //     cell.setAttribute("class","cell");
        
    //     let cellInput = document.createElement("input")
    //     cellInput.setAttribute("type","text");
    //     cellInput.setAttribute("class","cellInput");
    //     cellInput.setAttribute("value","");
    //     cellInput.setAttribute("maxlength","1");

    //     cell.appendChild(cellInput);
    //     container.appendChild(cell);

    //  }
    
})();

function game(){
    let gameboard = GameBoard.gameboard;
    let result = false;

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

        // while (result == true && start <= end){
        //     if(gameboard[start]!=val){
        //         result =  false ; 
                
        //     }
        //     start++;
        // }
        
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
            // while ( result == true && start <= 8){
            //     if(gameboard[start]!= val){
            //         result=false;
            //     }
            //     start+=4;
            // }
            result = checkingCondition(val,start,4);
        }
        else if (index==2 || index==4 || index==6){
            start = 2; 
            // while ( result == true && start <= 6){
            //     if(gameboard[start]!= val){
            //         result=false;
            //     }
            //     start+=2;
            // }
            result = checkingCondition(val,start,2);
        }
        else{}

        return result;
    }


    let i =0;
    for(i =0 ; i<9;i++){
        if(i==0 || i==6 ||i==4 ||i==6 ||i==8){
            result = checkingVertical(gameboard[i],i) || checkingHorizontal(gameboard[i],i) || checkingDiagonal(gameboard[i],i);
        }
        else{
            result = checkingVertical(gameboard[i],i) || checkingHorizontal(gameboard[i],i);
        }
        
        if ( result == true){
            break;
        }
    }
    console.log(`${gameboard[i]} wins`);
}

game();