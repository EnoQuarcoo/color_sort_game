console.log("Here");
//1. grab all the containers
const colorContainers = document.querySelectorAll(".container"); 


//2. listen for a click on each container. so attach an event listener to each one
colorContainers.forEach( function(colorContainer){
    colorContainer.addEventListener("click", function(){

        //3. remove the lifted class from all color blocks in every container. 
        colorContainers.forEach(function(colorContainer){
            const allColorBlocks = colorContainer.querySelectorAll(".color-block");
            allColorBlocks.forEach(function(block){
                block.classList.remove('lifted');
            })
        });

        // 4. grab all color blocks in the clicked container (no other containers)
        const clickedContainersColorBlocks = colorContainer.querySelectorAll(".color-block");
        
        //5. grab the topmost colorblock (last one in list because of colum-reverse)
        const topColorBlock = clickedContainersColorBlocks[clickedContainersColorBlocks.length - 1];

        
        //6. Add the 'lifted" class to make it float
        topColorBlock.classList.add("lifted");
        let liftedBlock = topColorBlock;
        let liftedBlocksContainer = colorContainer; 

        liftedBlock.addEventListener()
        

        
    
    });

});


//Add move/drop logic + only allow valid moves

// or when it is the same color as the block in another container. 




//Update DOM visually so the nut “moves”

//Write win-check function

//80–120 min	Test edge cases + Add simple “You Win!” alert