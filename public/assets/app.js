$("#scrape").on("click", function () {
    $.get("/scrape", function (data) {
        console.log(data)
        window.location = "/"
    })
});

$(".save-btn").on("click", function () {
    var articleId = $(this).attr("id");
    console.log(articleId);

    $.ajax({
        method: "POST",
        url: "/save/" + articleId,
    })
        .then(function (data) {
            console.log(data);
            window.location = "/"
        })
});

$(".delete-btn").on("click", function () {
    var articleId = $(this).attr("id");
    console.log(articleId);

    $.ajax({
        method: "POST",
        url: "/delete/" + articleId,
    })
        .then(function (data) {
            console.log(data);
            window.location = "/saved"
        })
});