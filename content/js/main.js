
function collectWheat(caller) {
    log("Collected wheat.");
    collect(caller, "wheat", 1);
}

function collectStone(caller) {
    log("Collected stone.");
    collect(caller, "stone", 1);
}

function collectWood(caller) {
    log("Collected wood.");
    collect(caller, "wood", 1);
}

function collect(caller, resource, amount) {
    let element;
    const $progressBar = $(caller).parents(".form-group").find(".progress-bar");
    
    try {
        element = resources[resource];
    } catch {
        console.error("Resource " + resource + " not found.");
    }
    

    // Only add the resource if conditions are met
    if (element.amount < element.stockpile && !$progressBar.hasClass("active")) {
        // Set the loading bar to active to play the animation
        $progressBar.addClass("active");

        // Add the resource to the total amount after the loading bar animation
        setTimeout(function() {
            $progressBar.removeClass("active");
            element.amount = element.amount + amount;

            if (element.amount > element.stockpile) {
                element.amount = element.stockpile;
            }

            reloadResources();
        }, 1000);
    }
}

function log(message) {
    // Add the message as a div
    $("#console-window > .card-body").prepend("<div>" + message + "</div>");
    
    if ($("#console-window > .card-body > div").length > 50) {
        $("#console-window > .card-body > div:last-child").remove();
    }
}

function reloadResources() {
    $(".resourse-amount").each(function (index, elem) {
        const name = $(elem).attr("id").split("amount-")[1];
        const amount = resources[name].amount;
        $(this).text(amount);
    });

    $("#workers-amount").text(villagers.amount);
}

// Use timeouts instead of intervals to make use of changing game loop speeds
var gameloopSpeed = 1000;
(function loop(timer) {
    setTimeout(function() {
        // Collect the automated values
        collect(null, "wheat", resources.wheat.autoincrease);
        collect(null, "stone", resources.stone.autoincrease);
        collect(null, "wood", resources.wood.autoincrease);

        loop(gameloopSpeed);
    }, timer)
})(1000);