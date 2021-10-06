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
    'King K. Rool','Incineroar','Piranha Plant','Joker','Hero',
    'Banjo Kazooie','Terry',/*'Byleth',*/'Min Min',/*'Steve','Alex',*/'Sephiroth',
    'Pyra','Mythra'/*,'Kazuya'*/
]

const noInfo = ['Kazuya','Byleth','Alex','Steve','Dark Samus','Isabelle'];
//byleth,steve/alex, and kazuya not in list
// console.log(validCharArr.length);

const desiredMoveList = [];

//creates dropdown menu options
const fillOptions = () => { //HTML & CSS by Jon Duckett
    for (const char of validCharArr) {
        $("#character").append($("<option>").text(char));
    }
}

//strips symbols from dropdown menu options to make them valid in url
const stripSymbols = (word) => {
    while (word.includes(".")) {
        word = word.replace(".","");
    }
    while (word.includes("&")) {
        word = word.replace("&","");
    }
    return word;
}

//function to calculate the first active frame for a move
const calcFirstActiveFrame = (activeFramesStr) => {
    //tests if data pulled (activeFramesStr) is in digit-digit format
    const regexDigitDashDigit = /\d-\d/;
    let regexTest = new RegExp(regexDigitDashDigit).test(activeFramesStr);
    if (regexTest) {
        return parseInt(activeFramesStr.split("-")[0]);
    }
    //tests if data pulled (activeFramesStr) is in digit- format
    const regexDigitDash = /\d-/;
    regexTest = new RegExp(regexDigitDash).test(activeFramesStr);
    if (regexTest) {
        return parseInt(activeFramesStr.split("-")[0]);
    }
    //tests if data pulled (activeFramesStr) is in digit format
    const regexDigit = /\d/;
    regexTest = new RegExp(regexDigit).test(activeFramesStr);
    if (regexTest) {
        return parseInt(activeFramesStr);
    }
    // const regexDigitAndCommas = /(\b\d,)/;
    // regexTest = new RegExp(regexDigitDash).test(activeFramesStr);
    // console.log(regexTest);
    return "N/A";
}
//https://www.w3schools.com/jsref/jsref_regexp_test.asp
//https://www.w3schools.com/jsref/jsref_obj_regexp.asp

//function to calculate the total amount of active frames for a move
const calcTotalActiveFrames = (activeFramesStr, earliestActionFrame) => {
    //tests if data pulled (activeFramesStr) is in digit-digit format
    const regexDigitDashDigit = /\d-\d/;
    regexTest = new RegExp(regexDigitDashDigit).test(activeFramesStr);
    if (regexTest) {
        const firstFrame = activeFramesStr.split("-")[0];
        const lastFrame = activeFramesStr.split("-")[1];
        return parseInt(lastFrame) - parseInt(firstFrame) + 1;
    }
    //tests if data pulled (earliestActionFrame) has no value
    if (earliestActionFrame === "-") {
        return "N/A";
    }
    //tests if data pulled (activeFramesStr) is in digit- format
    const regexDigitDash = /\d-/;
    regexTest = new RegExp(regexDigitDash).test(activeFramesStr);
    if (regexTest) {
        return parseInt(earliestActionFrame) - parseInt(activeFramesStr.split("-")[0]);
    }
    //tests if data pulled (activeFramesStr) is in digit format
    const regexDigit = /\d/;
    regexTest = new RegExp(regexDigit).test(activeFramesStr);
    if (regexTest) {
        return parseInt(earliestActionFrame) - parseInt(activeFramesStr);
    }
    return "N/A";
}

//function to calculate the endlag for a move
const calcEndlag = (activeFramesStr, earliestActionFrame) => {
    //tests if data pulled (activeFramesStr, earliestActionFrame) has no value
    if (activeFramesStr == null || earliestActionFrame === "-") {
        return "N/A";
    }
    //tests if data pulled (activeFramesStr) is in digit-digit format
    const regexDigitDashDigit = /\d-\d/;
    regexTest = new RegExp(regexDigitDashDigit).test(activeFramesStr);
    if (regexTest) {
        const firstFrame = activeFramesStr.split("-")[0];
        const lastFrame = activeFramesStr.split("-")[1];
        return parseInt(earliestActionFrame) - parseInt(lastFrame);
    }
    //tests if data pulled (activeFramesStr) is in digit- format
    const regexDigitDash = /\d-/;
    regexTest = new RegExp(regexDigitDash).test(activeFramesStr);
    if (regexTest) {
        return "N/A";
    }
    //tests if data pulled (activeFramesStr) is in digit format
    const regexDigit = /\d/;
    regexTest = new RegExp(regexDigit).test(activeFramesStr);
    if (regexTest) {
        return parseInt(earliestActionFrame) - parseInt(activeFramesStr);
    }
    return "N/A";
}

//adds image of the character searched for
const addImage = (name) => {
    //removes previous display
    $("#desired-move-container").empty();
    const $charImage = $("<img>").attr('src',`./images/${name}.png`);
    $charImage.addClass('char-img');
    $("#desired-move-container").append($charImage);
}

//function to create and display carousel
const makeCarousel = () => {
    //tells user their search yielded no results
    if (desiredMoveList.length === 0) {
        $("#desired-move-container").append($("<h2>").text("No Matches of Search"));
        return;
    }
    //num used for truthy-falsy evalution to hide/display a carousel item
    let hide = 0;
    //index for each item in the carousel
    let currDisplayIndex = 0;
    //max index value in the carousel
    const maxValidMoveIndex = desiredMoveList.length - 1;
    //shows user results of their search and where they are in the search
    const $carouselNote = $("<p>").css('font-weight','bold');
    $carouselNote.text(`${currDisplayIndex + 1} of ${maxValidMoveIndex + 1}`);
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
        $carouselNote.text(`${currDisplayIndex + 1} of ${maxValidMoveIndex + 1}`);
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
        $carouselNote.text(`${currDisplayIndex + 1} of ${maxValidMoveIndex + 1}`);
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
    $("#desired-move-container").append($carouselNote);
}

$( () => {
    //invokes function to create dropdown menu options
    fillOptions();
    $("form").on("submit", (event) => { //once form submission happens
        event.preventDefault();

        //retrieve values from each input field
        const charSelected = $("#character").val();
        let initActiveFrameDesired = $("#init-active-frame").val();
        let totalActiveFramesDesired = $("#total-active-frames").val();
        let endlagDesired = $("#endlag").val();

        /*booleans to determine whether an input should be considered during the
        search*/
        const searchInitFrame = initActiveFrameDesired === "" ? false : true;
        const searchActiveFrames = totalActiveFramesDesired === "" ? false : true;
        const searchEndlag = endlagDesired === "" ? false : true;

        //detects if user has tried to search using invalid input
        let invalidInput = false;
        //checks if input field "Initial Active Frame" has invalid input
        if (searchInitFrame) {
            let lengthOfStr = initActiveFrameDesired.length;
            let lengthOfNum = parseInt(initActiveFrameDesired).toString().length;
            if (lengthOfStr !== lengthOfNum) {
                alert("Invalid input for initial active frame (must be a number).");
                invalidInput = true;
            }
        }
        //checks if input field "Total Active Frames" has invalid input
        if (searchActiveFrames) {
            lengthOfStr = totalActiveFramesDesired.length;
            lengthOfNum = parseInt(totalActiveFramesDesired).toString().length;
            if (lengthOfStr !== lengthOfNum) {
                alert("Invalid input for total active frames (must be a number).");
                invalidInput = true;
            }
        }
        //checks if input field "Endlag" has invalid input
        if (searchEndlag) {
            lengthOfStr = endlagDesired.length;
            lengthOfNum = parseInt(endlagDesired).toString().length;
            if (lengthOfStr !== lengthOfNum) {
                alert("Invalid input for endlag (must be a number).");
                invalidInput = true;
            }
        }

        if (!invalidInput) { //ajax pull only happens if no invalid input
            let char = charSelected;
            //handles an exception for url link
            if (!(charSelected === "Min Min")) {
                //stips character name of spaces for url link
                char = charSelected.split(" ").join("");
            }

            //invokes function to strip character of symbols for url link
            char = stripSymbols(char);

            // let ajaxLink = `https://api.kuroganehammer.com/api/characters/name/${char}/moves?game=ultimate`;

            //link passed changes based on character selected
            let ajaxLinkTwo = `https://api.kuroganehammer.com/api/characters/name/${char}/moves/`;

            $.ajax({
                url: ajaxLinkTwo
            }).then(
                (data) => {
                    //loops over all moves the character has
                    for (const dataPoint of data) {
                        //invokes function to calculate first active frame of move
                        const firstActiveFrame = calcFirstActiveFrame(dataPoint.HitboxActive);
                        //invokes function to calculate total active frames of move
                        const totalActiveFrames = calcTotalActiveFrames(dataPoint.HitboxActive, dataPoint.FirstActionableFrame);
                        //invokes function to calculate endlag of move
                        const endlag = calcEndlag(dataPoint.HitboxActive, dataPoint.FirstActionableFrame);

                        //determines if move fits user's search criteria
                        /*compares move's initial active frame with user input
                        (valid if equal or less) if it must be considered*/
                        let validByInitFrame = true;
                        if (searchInitFrame) {
                            if (!(firstActiveFrame <= initActiveFrameDesired)) {
                                validByInitFrame = false;
                            }
                        }
                        /*compares move's total active frames with user input
                        (valid if equal or more) if it must be considered*/
                        let validByActiveFrames = true;
                        if (searchActiveFrames) {
                            if (!(totalActiveFrames >= totalActiveFramesDesired)) {
                                validByActiveFrames = false;
                            }
                        }
                        /*compares move's endlag with user input
                        (valid if equal or less) if it must be considered*/
                        let validByEndlag = true;
                        if (searchEndlag) {
                            if (!(endlag <= endlagDesired)) {
                                validByEndlag = false;
                            }
                        }

                        //checks if move is valid by all criteria
                        if (validByEndlag && validByInitFrame && validByActiveFrames) {
                            if (!(dataPoint.Name).includes("throw")) {//throws are discarded
                                //creates object holding relevant data of move
                                const desiredMove = {
                                    name: dataPoint.Name,
                                    initActFrame: firstActiveFrame,
                                    totalActFrames: totalActiveFrames,
                                    endingLag: endlag
                                }
                                //adds valid move to array
                                desiredMoveList.push(desiredMove);
                            }
                        }
                    }
                    //invokes function to add the character's photo to the page
                    addImage(char);
                    //invokes function to add list of valid moves to page via a carousel
                    makeCarousel();
                    //empties the array holding valid moves to prep for next search
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
