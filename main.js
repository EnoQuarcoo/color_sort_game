let blocksPerContainer;
let moves = 0; 
let firstMoveMade = false;
let totalTimeSpentAway = 0; 
let timeAwayStart = 0;
const todaysDate = new Date(); 
console.log(localStorage);
//localStorage.clear()
devMode = false; 

if (!devMode && todaysDate.toDateString() === localStorage.getItem("lastPlayedDate")) {
    console.log("Already played today. Showing win screen.");

    const timeDisplay = document.querySelector("#final-time");
    const movesDisplay = document.querySelector("#total-moves");
    timeDisplay.innerHTML = "Total Time : " + localStorage.getItem("lastTime");
    movesDisplay.innerHTML = "Total Moves : " + localStorage.getItem("lastMoves");

    fetch("puzzles.json")
        .then(response => response.json())
        .then(data => {
            let todaysGame = data[getTodaysPuzzle()];
            console.log("the game id is ", todaysGame.id);
            blocksPerContainer = todaysGame.blocksPerContainer;
            displayGame(todaysGame); // ⚠️ This draws the board
            handleWin();             // ⬅️ Show the win modal
            disableGame();
        });
        
} else {
    fetch("puzzles.json")
        .then(response => response.json())
        .then(data => {
            let todaysGame = data[getTodaysPuzzle()];
            console.log("the game id is ", todaysGame.id);
            blocksPerContainer = todaysGame.blocksPerContainer;
            displayGame(todaysGame); // ✅ Draw the board
            attachContainerListeners(); // ✅ Allow moves
        });
}

//Keeps track of what block and container have been lifted 
let liftedBlock = null; 
let liftedContainer = null; 

//Remove the lifted class from all blocks 
function removeAllLiftedClasses(){
    const containers = document.querySelectorAll(".container");
    containers.forEach(function(container){
                const allColorBlocks = container.querySelectorAll(".color-block");
                allColorBlocks.forEach(function(block){
                    block.classList.remove('lifted');
                })
            });
}

//Get top block from a container 
function getTopBlock(container){
    // Grab all color blocks in the clicked container (no other containers)
    const clickedContainersBlocks = container.querySelectorAll(".color-block");       
    //grab the topmost colorblock (last one in list because of colum-reverse)
    return clickedContainersBlocks[clickedContainersBlocks.length - 1];

}

function liftBlock(topBlock, colorContainer){
    topBlock.classList.add("lifted");
    liftedBlock = topBlock;
    liftedContainer = colorContainer;
}

function resetLifted(){
    liftedBlock = null;
    liftedContainer = null;
}

function moveBlock(fromContainer, toContainer ){
    //console.log("made a move")
    let fromBlock = getTopBlock(fromContainer); 
   // console.log("the from block is ",fromBlock)
    const toBlock = getTopBlock(toContainer); 
    const fromBlocksColor = fromBlock.classList[1]


    
    //Get all blocks in the fromContainer
    let blocksInFromContainer = fromContainer.querySelectorAll(".color-block");
    //console.log("blocks in frorm container",blocksInFromContainer)
    
    let sameColorBlocks = []
    
    
    for (let i = blocksInFromContainer.length - 1; i >= 0; i--){
        if (fromBlocksColor === blocksInFromContainer[i].classList[1]){
            sameColorBlocks.push(blocksInFromContainer[i]);
        } else{ 
            break; 
        }
    }
  
    const toContainerIsEmpty = !toBlock;
    const sameColor = toBlock && toBlock.classList[1] === fromBlock.classList[1]
    let spaceAvailable; 

    //if the the toContainer is empty, it should be able to hold the max blocks per container
    if (toContainerIsEmpty) {
        spaceAvailable = blocksPerContainer;
    } else {
        //it should be the difference b/n the max blocks Per Container - the number of items in the toContainer 
        spaceAvailable = blocksPerContainer - toContainer.querySelectorAll(".color-block").length
    }
    //console.log("the space avaible is ", spaceAvailable)

    if (toContainerIsEmpty || sameColor ){
        while (sameColorBlocks.length > 0 && spaceAvailable > 0){
            let fromBlock = getTopBlock(fromContainer);
            let movedBlock = fromContainer.removeChild(fromBlock);
            toContainer.appendChild(movedBlock); 
            spaceAvailable--;
            sameColorBlocks.pop()

        }
        
    } 

    //Increment the total number of moves. 
    moves++; 
    

}


function containerIsEmpty(container){
    return container.querySelectorAll(".color-block").length === 0;

}

function containerIsUniformColor(container){
    let isUniform = true;
    let containersTopBlock = getTopBlock(container);
    let  containersTopBlockColor = containersTopBlock.classList[1];
    //we need to grab all color blocks in the container in order to loop through them 
    let containersBlocks = container.querySelectorAll(".color-block"); 
    containersBlocks.forEach(function(block){
        if (block.classList[1] != containersTopBlockColor){
            isUniform = false; 
        }

    })
    return isUniform;  
}

function containerIsFull(container){
    return container.querySelectorAll(".color-block").length === blocksPerContainer;
}



function checkWin(colorContainers){
    let allAreWinningContainers = true;
    for (let container of colorContainers){
        if (containerIsEmpty(container)){
            continue; 
        }
        if (!containerIsUniformColor(container) || !containerIsFull(container)){
            allAreWinningContainers = false; 
        }
    }
    if (allAreWinningContainers == true){
        stopTime = stopTimer();
        let elapsedTime = getElapsedTime(startTime, stopTime)
        const timeDisplay = document.querySelector("#final-time");
        const movesDisplay = document.querySelector("#total-moves");
        timeDisplay.innerHTML = "Total Time : " + elapsedTime;
        movesDisplay.innerHTML = "Total Moves : " + moves; 
        
        localStorage.setItem('lastPlayedDate', new Date().toDateString());
        localStorage.setItem('lastTime', elapsedTime);
        localStorage.setItem('lastMoves', moves);

        console.log("Saved results to local storage");
    }

    

    return allAreWinningContainers;
    
}

function handleWin() {
  // Show the modal
  document.getElementById("win-modal").classList.remove("hidden");

  // Wait 100ms to allow modal to show, THEN launch confetti
  setTimeout(() => {
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
      zIndex: 2000  // 👈 this is the magic to bring it in front!
    });
  }, 100);

    setTimeout(() => {
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.4 }, zIndex: 2000 });
    confetti({ particleCount: 60, spread: 100, origin: { y: 0.6 }, zIndex: 2000 });
    } , 100);


}

function getTodaysPuzzle (){
    //Get today's date 
    
    const currentYear = todaysDate.getFullYear();
    const firstDayOfYear = new Date(currentYear, 0 , 1 );
    //Calculate difference in milliseconds 
    const diffInMs = todaysDate - firstDayOfYear  
    const dayOfYear = Math.floor(diffInMs / (1000 * 60 * 60 * 24)) + 1;
    //Calculate what today's game should be 
    const gameIndex = dayOfYear % puzzles.length;
    console.log("Today's game is", gameIndex )
    return gameIndex; 
}

function displayGame(todaysGame){
    //grab the containers array from that game. 
    numberOfContainers = todaysGame.containers.length
    //console.log("the number of containers is", numberOfContainers);
    const allContainersSection = document.querySelector("#all-containers");
    allContainersSection.innerHTML = "";
    todaysGame.containers.forEach((container) => {
        //console.log("coooool")
        const newContainer = document.createElement("div");
        allContainersSection.appendChild(newContainer);
        newContainer.classList.add("container")
        
        container.forEach((color) => {
            const newColorBlock = document.createElement("div")
            newColorBlock.classList.add("color-block", color);
            newContainer.appendChild(newColorBlock)
        })

    });
    
}



function attachContainerListeners() {
    //Grab all the containers
    const colorContainers = document.querySelectorAll(".container"); 

    //Listen for a click on each container. Attach an event listener to each contianer
    colorContainers.forEach( function(containerElement){
        containerElement.addEventListener("click", function(){
            const clickedContainer = containerElement;  
            //If a block is already lifted. 
        if (liftedBlock) {
            // We already have a lifted block
            removeAllLiftedClasses();
            if (clickedContainer === liftedContainer) {
                // same container, drop lifted block
                resetLifted()
            } 

            //First clicked container is different from second one and the second one is not full 
            else if (!containerIsFull(clickedContainer)) {
                 
                const newTopBlock = getTopBlock(clickedContainer);
                const newContainerIsEmpty = !newTopBlock;
                const colorsMatch = newTopBlock && liftedBlock.classList[1] === newTopBlock.classList[1];
                
                if (newContainerIsEmpty || colorsMatch) {
                // Move lifted block to the new container (empty or matching color)
                
                moveBlock(liftedContainer, clickedContainer);
                resetLifted();
                
                if (checkWin(colorContainers)) {
                    handleWin(); 
                    disableGame();
                }
                } else {
                // Colors don't match, drop lifted block and lift new top block if it exists
                if (newTopBlock) {
                    liftBlock(newTopBlock, clickedContainer);
                } else {
                    resetLifted();
                }
                }
            }

            else if (containerIsFull(clickedContainer)) {
                // lift top block from the full container
                const topBlock = getTopBlock(clickedContainer);
                liftBlock(topBlock, clickedContainer);
                
            }

        } else {
        // No block is lifted yet, so lift the top block in clicked container
        const topBlock = getTopBlock(clickedContainer);
        liftBlock(topBlock, clickedContainer);
        if (firstMoveMade === false){
            firstMoveMade = true 
            startTime = startTimer()
            startVisisbilityTracking()
            
        } 

        
        }

        });
    });
}

function startTimer(){
    const startTime = Date.now(); 
    console.log("the start time is",startTime);
    return startTime;
}

function stopTimer(){
    const stopTime = Date.now();
    console.log("The stop time is", stopTime);
    return stopTime;
    //called in checkWin function 
}


function getElapsedTime(startTime, stopTime){
    let elapsedTimeInMs = stopTime - startTime - totalTimeSpentAway;
    console.log("elasped time is ", elapsedTimeInMs); 

    const hours = Math.floor(elapsedTimeInMs / (100 * 60 * 60));
    const minutes = Math.floor((elapsedTimeInMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((elapsedTimeInMs % (1000 * 60)) / 1000)
    
    const hStr = hours.toString().padStart(2, '0');
    const mStr = minutes.toString().padStart(2, '0');
    const sStr = seconds.toString().padStart(2, '0');

    const formattedTime = `${hStr}:${mStr}:${sStr}`;
    console.log("Total time is ", formattedTime);

    return formattedTime;

}




function startVisisbilityTracking(){
    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            timeAwayStart = Date.now()
            console.log("User left at", timeAwayStart)
        } else  {
            let timeAwayStop = Date.now()
            totalTimeSpentAway += (timeAwayStop - timeAwayStart )
            console.log("The total time you spent away is ", totalTimeSpentAway)  
        }
    });
    

}

function disableGame() {
    const containers = document.querySelectorAll(".container");
    containers.forEach(container => {
        const newContainer = container.cloneNode(true); // clone the container (no listeners)
        container.replaceWith(newContainer);            // replace the old container

        // add click listener to the new one
       newContainer.addEventListener("click", handleWin);
    });
}



//Restart button logic. 
//1. Grab button from DOM 
const restartButton = document.querySelector("#restart-button");
//2. Add click event listener to reload the page.
restartButton.addEventListener("click", function(){
    window.location.reload()
})

//If how to play button is clicked 
const howToPlayButton = document.querySelector("#how-to-play-button");
const howToPlayModal = document.querySelector("#how-to-play-modal")
const closeModalButton = document.querySelector("#close-how-to-play-modal");

howToPlayButton.addEventListener("click", function(){
    howToPlayModal.classList.remove("hidden");  
})

//close how to play section
closeModalButton.addEventListener("click", function(){
    howToPlayModal.classList.add("hidden"); 
})

//close win modal
document.getElementById("close-win-modal").addEventListener("click", () => {
  document.getElementById("win-modal").classList.add("hidden");
});




//Load the JSON data 

// fetch("puzzles.json")
//     .then(response => response.json()) //Parsing JSON 
//     .then (data => {
//         //console.log(data)
//         let todaysGame = data[getTodaysPuzzle() + 1 ];
//         //console.log("Today's game is Game: ", todaysGame.id);
//         blocksPerContainer = todaysGame.blocksPerContainer;
//         //console.log("The containers look like this: ", todaysGame.containers);
//         displayGame(todaysGame);
        
//     }) 





