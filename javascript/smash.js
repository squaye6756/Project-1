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
console.log(validCharArr.length);

const stripSymbols = (word) => {
    while (word.includes(".")) {
        console.log(`${word} included "."`);
        word = word.replace(".","");
    }
    while (word.includes("&")) {
        console.log(`${word} included "&"`);
        word = word.replace("&","");
    }
    return word;
}


$( () => {
    $("form").on("submit", (event) => {
        event.preventDefault();

        console.log($("#character").val());
        console.log($("#init-active-frame").val());
        console.log($("#total-active-frames").val());
        console.log($("#endlag").val());
        const charSelected = $("#character").val();
        const initActiveFrameDesired = $("#init-active-frame").val();
        const totalActiveFramesDesired = $("#total-active-frames").val();
        const endlagDesired = $("#endlag").val();

        let char = charSelected.split(" ").join("");
        console.log(char);
        char = stripSymbols(char);
        console.log(char);

        let ajaxLink = `https://api.kuroganehammer.com/api/characters/name/${char}/moves?game=ultimate`
        let ajaxLinkTwo = `https://api.kuroganehammer.com/api/characters/${char}/moves?expand=false?game=ultimate`

        $(event.currentTarget).trigger("reset");
    })
})
// bad: 84,85,86
// 83
