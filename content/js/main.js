
function collectWheat(caller) {
    collect(caller, "wheat", 1, function () {
        log("Collected wheat.");
    });
}

function collectStone(caller) {
    collect(caller, "stone", 1, function() {
        log("Collected stone.");
    });
}

function collectWood(caller) {
    collect(caller, "wood", 1, function() {
        log("Collected wood.");
    });
}

function collect(caller, resource, amount, callback) {
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

            if (callback != null && typeof callback === "function") {
                callback();
            }
        }, 1000);
    }
}

function addWorker(resource) {
    switch(resource) {
        case "wheat":
            workers.farmers.amount = workers.farmers.amount + 1;
            resources.wheat.autoincrease = resources.wheat.autoincrease + 1; 
            break;
        case "stone":
            workers.stoneminers.amount = workers.stoneminers.amount + 1;
            resources.stone.autoincrease = resources.stone.autoincrease + 1; 
            break;
        case "wood":
            workers.lumberjacks.amount = workers.lumberjacks.amount + 1;
            resources.wood.autoincrease = resources.wood.autoincrease + 1; 
            break;
    }
    
    reloadResources();
}

function removeWorker(resource) {
    switch(resource) {
        case "wheat":
            if (workers.farmers.amount === 0) {
                log("You don't have any farmers to sell.")
                return;
            }
            workers.farmers.amount = workers.farmers.amount - 1;
            resources.wheat.autoincrease = resources.wheat.autoincrease - 1; 
            break;
        case "stone":
            if (workers.stoneminers.amount === 0) {
                log("You don't have any stone miners to sell.")
                return;
            }
            workers.stoneminers.amount = workers.stoneminers.amount - 1;
            resources.stone.autoincrease = resources.stone.autoincrease - 1; 
            break;
        case "wood":
            if (workers.lumberjacks.amount === 0) {
                log("You don't have any lumberjacks to sell.")
                return;
            }
            workers.lumberjacks.amount = workers.lumberjacks.amount - 1;
            resources.wood.autoincrease = resources.wood.autoincrease - 1; 
            break;
    }
    
    reloadResources();
}

function log(message) {
    // Add the message as a div
    $("#console-window > .card-body").prepend("<div>" + message + "</div>");
    
    if ($("#console-window > .card-body > div").length > 50) {
        $("#console-window > .card-body > div:last-child").remove();
    }
}

function reloadResources() {
    $(".resource-amount").each(function (index, elem) {
        const name = $(elem).attr("id").split("amount-")[1];
        const amount = resources[name].amount;
        $(this).text(amount);
    });
    // Possibly in seperate reloadWorkers function
    $(".worker-amount-div > div > span").each(function (index, elem) {
        console.log(elem);
        const name = $(elem).attr("id").split("amount-")[1];
        const amount = workers[name].amount;
        $(this).html(amount);
    });
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