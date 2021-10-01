console.log('here');

$( () => {
    $("form").on("submit", (event) => {
        event.preventDefault();

        console.log($("#character").val());
        console.log($("#init-active-frame").val());
        console.log($("#total-active-frames").val());
        console.log($("#endlag").val());

        $(event.currentTarget).trigger("reset");
    })
})
