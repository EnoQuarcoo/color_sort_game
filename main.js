

//Grab all the containers
const colorContainers = document.querySelectorAll(".container"); 
let blocksPerContainer = 4; 

//Keeps track of what block and container have been lifted 
let liftedBlock = null; 
let liftedContainer = null; 

//Remove the lifted class from all blocks 
function removeAllLiftedClasses(){
    colorContainers.forEach(function(container){
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
    const fromBlock = getTopBlock(fromContainer); 
    const toBlock = getTopBlock(toContainer); 

    const toContainerIsEmpty = !toBlock;
    const sameColor = toBlock && toBlock.classList[1] === fromBlock.classList[1]

    if (toContainerIsEmpty || sameColor ){
        const movedBlock = fromContainer.removeChild(fromBlock);
        toContainer.appendChild(movedBlock); 
    } 
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



//Listen for a click on each container. Attach an event listener to each contianer
colorContainers.forEach( function(containerElement){
    containerElement.addEventListener("click", function(){
        const clickedContainer = containerElement;  
        //If a block is already lifted. 
    if (liftedBlock) {
        // We already have a lifted block

        removeAllLiftedClasses();

        if (clickedContainer !== liftedContainer) {
            const newTopBlock = getTopBlock(clickedContainer);
            const newContainerIsEmpty = !newTopBlock;
            const colorsMatch = newTopBlock && liftedBlock.classList[1] === newTopBlock.classList[1];

            if (newContainerIsEmpty || colorsMatch) {
            // Move lifted block to the new container (empty or matching color)
            moveBlock(liftedContainer, clickedContainer);
            resetLifted();
            
            if (checkWin(colorContainers)) {
                handleWin(); 
            }
            } else {
            // Colors don't match, drop lifted block and lift new top block if it exists
            if (newTopBlock) {
                liftBlock(newTopBlock, clickedContainer);
            } else {
                resetLifted();
            }
            }

        } else {
            // Clicked same container as lifted block, so just drop it
            resetLifted();
            
        }

    } else {
    // No block is lifted yet, so lift the top block in clicked container
    const topBlock = getTopBlock(clickedContainer);
    if (topBlock) {
        liftBlock(topBlock, clickedContainer);
    }
    }

    });
});


//Add move/drop logic + only allow valid moves

// or when it is the same color as the block in another container. 




//Update DOM visually so the nut “moves”

//Write win-check function

//80–120 min	Test edge cases + Add simple “You Win!” alert

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

/*
//Load JSON file in JS 

fetch("puzzles.json").then(function(response) {
    return response.json(); //returns text as JS object. 
}).then(function(gameList){
    //console.log("Loaded GameList: ", gameList)
    //Pick today's game using the current date c
    const today = new Date().getDate();
    const index = today % gameList.length;
    const todayGame = gameList[index];

    console.log("Today's game is: ", todayGame); 

    initGame(todayGame);

})



function initGame(puzzle) {
  // 1. Clear previous containers
  const wrapper = document.getElementById("all-containers");
  wrapper.innerHTML = "";

  // 2. Build new containers based on puzzle
  puzzle.forEach((containerData) => {
    const container = document.createElement("div");
    container.classList.add("container");

    // Add blocks from bottom to top (reverse loop)
    for (let i = containerData.length - 1; i >= 0; i--) {
      const block = document.createElement("div");
      block.classList.add("color-block", containerData[i]);
      container.appendChild(block);
    }

    wrapper.appendChild(container);
  });

  // 3. Update grid layout class
  wrapper.className = ""; // remove old grid class
  wrapper.classList.add(`grid-${puzzle.length}`);

  // 4. Reset and reattach event listeners
  liftedBlock = null;
  liftedContainer = null;
  setupContainerListeners();
}
*/

