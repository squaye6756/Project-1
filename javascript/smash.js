console.log('here');

// const validCharArray = [
//     'Bayonetta','Bowser','BowserJr','CaptainFalcon','Charizard','Cloud','Corrin',
//     'DarkPit','DiddyKong','DonkeyKong','DrMario','DuckHunt','Falco','Fox','Ganondorf',
//     'Greninja','Ike','Jigglypuff','KingDedede','Kirby','Link','LittleMac','Lucario',
//     'Lucas','Lucina','Luigi','Mario','Marth','MegaMan','MetaKnight','Mewtwo',
//     'MiiSwordfighter','MiiBrawlwer','MiiGunner','MrGameWatch','Ness','Olimar',
//     'Pac-man','Palutena','Peach','Pikachu','Pit','Rob','Robin','RosalinaLuma',
//     'Roy','Ryu','Samus','Sheik',''
// ]

const validCharArr = [
    'Mario','DonkeyKong','Link','Samus','DarkSamus','Yoshi','Kirby','Fox',
    'Pikacu','Luigi','Ness','Peach','Daisy','Bowser','IceClimbers','Sheik',
    'Zelda','DrMario','Pichu','Falco','Marth','Lucina','YoungLink','Ganondorf',
    'Mewtwo','Roy','Chrom','MrGameWatch','MetaKnight','Pit','DarkPit',
    'ZeroSuitSamus','PokemonTrainer','DiddyKong','DiddyKong','Lucas','Sonic',
    'KingDedede','Squirtle','Ivysaur','Charizard','Olimar','Lucario','Rob',
    'ToonLink','Wolf','Villager','MegaMan','WiiFitTrainer','RosalinaLuma',
    'LittleMac','Greninja','MiiSwordfighter','MiiGunner','MiiBrawlwer',
    'Palutena','PacMan','Robin','Shulk','BowserJr','DuckHunt','Ryu','Ken',
    'Cloud','Corrin','Bayonetta','Inkling','Ridley','Simon','Richter',
    'KingKRool','Isabelle','Incineroar','PiranhaPlant','Joker','Hero',
    'BanjoKazooie','Terry',/*'Byleth',*/'MinMin',/*'Steve','Alex',*/'Sephiroth',
    'Pyra','Mythra'/*,'Kazuya'*/
]

const noInfo = ['Kazuya','Byleth','Alex','Steve'];
//byleth,steve/alex, and kazuya not in list
// console.log(validCharArr.length);

const desiredMoveList = [];

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

const calcTotalActiveFrames = (activeFramesStr) => {
    if (activeFramesStr == null) {
        return "N/A";
    }
    if (activeFramesStr.includes("-")) {
        const firstFrame = activeFramesStr.split("-")[0];
        const lastFrame = activeFramesStr.split("-")[1];
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
        return parseInt(earliestActionFrame) - parseInt(lastFrame);
    }
    return parseInt(earliestActionFrame) - parseInt(activeFramesStr);
}

const makeCarousel = () => {
    const $moveCarousel = $("<div>").addClass("move-carousel");
    $moveCarousel.css({'display':'flex','justify-content':'space-between'});
    const $prevBtn = $("<button>").text("previous");
    const $nextBtn = $("<button>").text("next");
    const $moveDisplay = $("<div>").addClass("move-display");
    for (const move of desiredMoveList) {
        const $desiredMove = $("<div>");
        $desiredMove.css({'display':'flex','flex-direction':'column'});
        $desiredMove.css({'justify-content':'space-around'});
        const $moveTitle = $("<h1>").text(move.name);
        const $moveInitActFrame = $("<p>");
        const $moveTotalActFrames = $("<p>");
        const $moveEndlag = $("<p>");
        $moveInitActFrame.text(`First Active Frame: ${move.initActFrame}`);
        $moveTotalActFrames.text(`Total Active Frames: ${move.totalActFrames}`);
        $moveEndlag.text(`Endlag: ${move.endingLag}`);
        $desiredMove.append($moveTitle);
        $desiredMove.append($moveInitActFrame);
        $desiredMove.append($moveTotalActFrames);
        $desiredMove.append($moveEndlag);
        $moveDisplay.append($desiredMove);
    }
    $moveCarousel.append($prevBtn);
    $moveCarousel.append($moveDisplay);
    $moveCarousel.append($nextBtn);
    $("#desired-move-container").append($moveCarousel);
}

$( () => {
    $("form").on("submit", (event) => {
        event.preventDefault();

        console.log($("#character").val());
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

        // initActiveFrameDesired = initActiveFrameDesired == "" ?
        //     10000 : parseInt(initActiveFrameDesired);
        // totalActiveFramesDesired = totalActiveFramesDesired == ""?
        //     0 : parseInt(totalActiveFramesDesired);
        // endlagDesired = endlagDesired == "" ?
        //     10000 : parseInt(endlagDesired);

        let char = charSelected.split(" ").join("");
        // console.log(char);
        char = stripSymbols(char);
        // console.log(char);

        // let ajaxLink = `https://api.kuroganehammer.com/api/characters/name/${char}/moves?game=ultimate`;
        let ajaxLinkTwo = `https://api.kuroganehammer.com/api/characters/name/${char}/moves?expand=false?game=ultimate`;

        $.ajax({
            url: ajaxLinkTwo
        }).then(
            (data) => {
                for (const dataPoint of data) {
                    // console.log(dataPoint);
                    const firstActiveFrame = calcFirstActiveFrame(dataPoint.HitboxActive);
                    console.log("First Active Frame:", firstActiveFrame);
                    const totalActiveFrames = calcTotalActiveFrames(dataPoint.HitboxActive);
                    console.log("Total Active Frames:", totalActiveFrames);
                    const endlag = calcEndlag(dataPoint.HitboxActive, dataPoint.FirstActionableFrame);
                    console.log("EndLag:", endlag);

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
                        const desiredMove = {
                            name: dataPoint.Name,
                            initActFrame: firstActiveFrame,
                            totalActFrames: totalActiveFrames,
                            endingLag: endlag
                        }
                        desiredMoveList.push(desiredMove);
                    }
                }
                makeCarousel()
            },
            () => {
                console.log('bad request');
            }
        )

        $(event.currentTarget).trigger("reset");
    })
})
// bad: 84,85,86
// 83
