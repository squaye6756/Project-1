const validCharArr = [
    'Mario','Donkey Kong','Link','Samus','Yoshi','Kirby','Fox',
    'Pikachu','Luigi','Ness','Peach','Daisy','Bowser','Ice Climbers','Sheik',
    'Zelda','Dr. Mario','Pichu','Falco','Marth','Lucina','Young Link','Ganondorf',
    'Mewtwo','Roy','Chrom','Mr. Game & Watch','Meta Knight','Pit','Dark Pit',
    'Zero Suit Samus','Diddy Kong','Lucas','Sonic','King Dedede',
    'Squirtle','Ivysaur','Charizard','Olimar','Lucario','Rob',
    'Toon Link','Wolf','Villager','Mega Man','Wii Fit Trainer','Rosalina & Luma',
    'Little Mac','Greninja','Mii Swordfighter','Mii Gunner','Mii Brawler',
    'Palutena','Pac-Man','Robin','Shulk','Bowser Jr.','Duck Hunt','Ryu','Ken',
    'Cloud','Corrin','Bayonetta','Inkling','Ridley','Simon','Richter',
    'King K. Rool','Isabelle','Incineroar','Piranha Plant','Joker','Hero',
    'Banjo Kazooie','Terry',/*'Byleth',*/'Min Min',/*'Steve','Alex',*/'Sephiroth',
    'Pyra','Mythra'/*,'Kazuya'*/
]

const noInfo = ['Kazuya','Byleth','Alex','Steve','Dark Samus'];
//byleth,steve/alex, and kazuya not in list
// console.log(validCharArr.length);

const desiredMoveList = [];

const fillOptions = () => { //HTML & CSS by Jon Duckett
    for (const char of validCharArr) {
        $("#character").append($("<option>").text(char));
    }
}

const stripSymbols = (word) => {
    while (word.includes(".")) {
        // console.log(`${word} included "."`);
        word = word.replace(".","");
    }
    while (word.includes("&")) {
        // console.log(`${word} included "&"`);
        word = word.replace("&","");
    }
    return word;
}

const calcFirstActiveFrame = (activeFramesStr) => {
    // console.log(activeFramesStr);
    if (activeFramesStr == null) {
        return "N/A";
    }
    if (activeFramesStr.includes("-")) {
        return parseInt(activeFramesStr.split("-")[0]);
    }
    return parseInt(activeFramesStr);
}

const calcTotalActiveFrames = (activeFramesStr, earliestActionFrame) => {
    if (activeFramesStr == null) {
        return "N/A";
    }
    if (activeFramesStr.includes("-")) {
        // console.log(activeFramesStr);
        // console.log(activeFramesStr.split("-"));
        const firstFrame = activeFramesStr.split("-")[0];
        const lastFrame = activeFramesStr.split("-")[1];
        if (activeFramesStr.split("-")[1] === "") {
            return parseInt(earliestActionFrame) - parseInt(activeFramesStr.split("-")[0]);
        }
        return parseInt(lastFrame) - parseInt(firstFrame) + 1;
    }
    return 1;
}

const calcEndlag = (activeFramesStr, earliestActionFrame) => {
    if (activeFramesStr == null || earliestActionFrame === "-") {
        return "N/A";
    }
    if (activeFramesStr.includes("-")) {
        const lastFrame = activeFramesStr.split("-")[1];
        if (lastFrame === "") {
            return 0;
        }
        return parseInt(earliestActionFrame) - parseInt(lastFrame);
    }
    return parseInt(earliestActionFrame) - parseInt(activeFramesStr);
}

const addImage = (name) => {
    //removes previous display
    $("#desired-move-container").empty();
    const $charImage = $("<img>").attr('src',`./images/${name}.png`);
    $charImage.addClass('char-img');
    $("#desired-move-container").append($charImage);
}

//function to create and display carousel
const makeCarousel = () => {
    let hide = 0;
    let currDisplayIndex = 0;
    const maxValidMoveIndex = desiredMoveList.length - 1;
    //creates carousel container
    const $moveCarousel = $("<div>").addClass("move-carousel");
    $moveCarousel.css({'display':'flex','justify-content':'space-between'});
    $moveCarousel.css({'align-items':'center'});
    //button to see the next valid move
    const $prevBtn = $("<button>").text("<").addClass('carousel-btn');
    //function to see previous valid move in carousel
    $prevBtn.on('click', (event) => {
        const $btnParent = $(event.currentTarget).parent();
        const $moveDivList = $btnParent.children().eq(1);
        // console.log($moveDivList);
        $moveDivList.children().eq(currDisplayIndex).css('display','none');
        if (currDisplayIndex === 0) {
            currDisplayIndex = maxValidMoveIndex;
        } else {
            currDisplayIndex--;
        }
        $moveDivList.children().eq(currDisplayIndex).css('display','flex');
    });
    //button to see the previous valid move
    const $nextBtn = $("<button>").text(">").addClass('carousel-btn');
    //function to see next valid move in carousel
    $nextBtn.on('click', (event) => {
        const $btnParent = $(event.currentTarget).parent();
        const $moveDivList = $btnParent.children().eq(1);
        // console.log($moveDivList);
        $moveDivList.children().eq(currDisplayIndex).css('display','none');
        if (currDisplayIndex === maxValidMoveIndex) {
            currDisplayIndex = 0;
        } else {
            currDisplayIndex++;
        }
        $moveDivList.children().eq(currDisplayIndex).css('display','flex');
    })
    //div to hold all moves in carousel
    const $moveDisplay = $("<div>").addClass("move-display");
    //loops through each valid move and creates "display boxes" for them
    for (const move of desiredMoveList) {
        //div to hold contents of the move
        const $desiredMove = $("<div>");
        $desiredMove.css({'display':'flex','flex-direction':'column'});
        $desiredMove.css({'justify-content':'space-around'});
        //contents of each move to be displayed
        const $moveTitle = $("<h1>").text(move.name);
        const $moveInitActFrame = $("<p>");
        const $moveTotalActFrames = $("<p>");
        const $moveEndlag = $("<p>");
        //text added
        $moveInitActFrame.text(`First Active Frame: ${move.initActFrame}`);
        $moveTotalActFrames.text(`Total Active Frames: ${move.totalActFrames}`);
        $moveEndlag.text(`Endlag: ${move.endingLag}`);
        //contents added to its div holder
        $desiredMove.append($moveTitle);
        $desiredMove.append($moveInitActFrame);
        $desiredMove.append($moveTotalActFrames);
        $desiredMove.append($moveEndlag);
        //if clause to ensure that the carousel displays only one div initially
        if (hide) {
            $desiredMove.css('display','none');
        }
        hide++;
        //move added to container of all moves
        $moveDisplay.append($desiredMove);
    }
    //previous button added to carousel
    $moveCarousel.append($prevBtn);
    //conatiner of moves added to carousel
    $moveCarousel.append($moveDisplay);
    //next button added to carousel
    $moveCarousel.append($nextBtn);
    //carousel displayed to screen
    $("#desired-move-container").append($moveCarousel);
}

$( () => {
    fillOptions();
    $("form").on("submit", (event) => {
        event.preventDefault();

        // console.log($("#character").val());
        // console.log($("#init-active-frame").val());
        // console.log($("#total-active-frames").val());
        // console.log($("#endlag").val());
        const charSelected = $("#character").val();
        let initActiveFrameDesired = $("#init-active-frame").val();
        let totalActiveFramesDesired = $("#total-active-frames").val();
        let endlagDesired = $("#endlag").val();

        const searchInitFrame = initActiveFrameDesired === "" ? false : true;
        const searchActiveFrames = totalActiveFramesDesired === "" ? false : true;
        const searchEndlag = endlagDesired === "" ? false : true;

        let invalidInput = false;

        if (searchInitFrame) {
            let lengthOfStr = initActiveFrameDesired.length;
            let lengthOfNum = parseInt(initActiveFrameDesired).toString().length;
            if (lengthOfStr !== lengthOfNum) {
                alert("Invalid input for initial active frame (must be a number).");
                invalidInput = true;
            }
        }

        if (searchActiveFrames) {
            lengthOfStr = totalActiveFramesDesired.length;
            lengthOfNum = parseInt(totalActiveFramesDesired).toString().length;
            if (lengthOfStr !== lengthOfNum) {
                alert("Invalid input for total active frames (must be a number).");
                invalidInput = true;
            }
        }

        if (searchEndlag) {
            lengthOfStr = endlagDesired.length;
            lengthOfNum = parseInt(endlagDesired).toString().length;
            if (lengthOfStr !== lengthOfNum) {
                alert("Invalid input for endlag (must be a number).");
                invalidInput = true;
            }
        }

        if (!invalidInput) {
            let char = charSelected;
            if (!(charSelected === "Min Min")) {
                char = charSelected.split(" ").join("");
            }

            // console.log(char);
            char = stripSymbols(char);
            // console.log(char);

            // let ajaxLink = `https://api.kuroganehammer.com/api/characters/name/${char}/moves?game=ultimate`;
            let ajaxLinkTwo = `https://api.kuroganehammer.com/api/characters/name/${char}/moves/`;

            $.ajax({
                url: ajaxLinkTwo
            }).then(
                (data) => {
                    for (const dataPoint of data) {
                        // console.log(dataPoint);
                        const firstActiveFrame = calcFirstActiveFrame(dataPoint.HitboxActive);
                        // console.log("First Active Frame:", firstActiveFrame);
                        const totalActiveFrames = calcTotalActiveFrames(dataPoint.HitboxActive, dataPoint.FirstActionableFrame);
                        // console.log("Total Active Frames:", totalActiveFrames);
                        const endlag = calcEndlag(dataPoint.HitboxActive, dataPoint.FirstActionableFrame);
                        // console.log("EndLag:", endlag);

                        let validByInitFrame = true;
                        if (searchInitFrame) {
                            if (!(firstActiveFrame <= initActiveFrameDesired)) {
                                validByInitFrame = false;
                            }
                        }
                        let validByActiveFrames = true;
                        if (searchActiveFrames) {
                            if (!(totalActiveFrames >= totalActiveFramesDesired)) {
                                validByActiveFrames = false;
                            }
                        }
                        let validByEndlag = true;
                        if (searchEndlag) {
                            if (!(endlag <= endlagDesired)) {
                                validByEndlag = false;
                            }
                        }

                        if (validByEndlag && validByInitFrame && validByActiveFrames) {
                            if (!(dataPoint.Name).includes("throw")) {
                                const desiredMove = {
                                    name: dataPoint.Name,
                                    initActFrame: firstActiveFrame,
                                    totalActFrames: totalActiveFrames,
                                    endingLag: endlag
                                }
                                desiredMoveList.push(desiredMove);
                            }
                        }
                    }
                    addImage(char);
                    makeCarousel();
                    desiredMoveList.splice(0, desiredMoveList.length);
                },
                () => {
                    console.log('bad request');
                }
            )

            $(event.currentTarget).trigger("reset");
        }
    })
})
