//Grab all the containers
const colorContainers = document.querySelectorAll(".container"); 

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

function checkWin(){

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