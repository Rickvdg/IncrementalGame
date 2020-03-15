
function collectWheat(caller) {
    collect(caller, "wheat", 1);
}

function collectStone(caller) {
    collect(caller, "stone", 1);
}

function collectWood(caller) {
    collect(caller, "wood", 1);
}

function collect(caller, resource, amount) {
    let element;
    const $progressBar = $(caller).parents(".form-group").find(".progress-bar");
    
    try {
        element = elements[resource];
    } catch {
        console.error("Resource " + resource + " not found.");
    }
    

    // Only add the resource if conditions are met
    if (amount < element.stockpile && !$progressBar.hasClass("active")) {
        // Set the loading bar to active to play the animation
        $progressBar.addClass("active");

        // Add the resource to the total amount after the loading bar animation
        setTimeout(function() {
            $progressBar.removeClass("active");
            element.amount = element.amount + amount;
            reloadResources();
        }, 1000);
    }
}

function reloadResources() {
    $(".resourse-amount").each(function (index, elem) {
        const name = $(elem).attr("id").split("amount-")[1];
        const amount = elements[name].amount;
        $(this).text(amount);
    });
}

// Use timeouts instead of intervals to make use of changing game loop speeds
var gameloopSpeed = 1000;
(function loop(timer) {
    setTimeout(function() {
        // Collect the automated values
        collect(null, "wheat", elements.wheat.autoincrease);
        collect(null, "stone", elements.stone.autoincrease);
        collect(null, "wood", elements.wood.autoincrease);

        loop(gameloopSpeed);
    }, timer)
})(1000);