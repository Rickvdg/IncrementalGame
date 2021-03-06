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

function getVillagerCost() {
    return villager.amount * 5 + 5;
}

function unlock(unlockable) {
    // Maybe cleaner way to do this
    let currentUnlockable = unlockables[unlockable];
    if (resources[currentUnlockable.resource].amount >= currentUnlockable.cost) {
        resources[currentUnlockable.resource].amount = resources[currentUnlockable.resource].amount - currentUnlockable.cost
        currentUnlockable.locked = false;
        $("#" + unlockable + "Img").css("opacity", "100");
        // Maybe better to remove the element
        $("#" + unlockable + "Unlock").css("display", "none");
        log("You unlocked the " + unlockable + ".");
    }
    else {
        log("You don't have enough " + currentUnlockable.resource + ".");
    }
    reloadResources();
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

function addVillager(resource) {
    let villager_cost = getVillagerCost();
    if (resources.stone.amount >= villager_cost) {
        villager.amount = villager.amount + 1;
        resources.stone.amount = resources.stone.amount - villager_cost;
        log("Succesfully bought a new villager.")
    }
    else {
        log("You don't have enough stone to buy a new villager.")
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
    // Possibly in seperate reloadVillagers function
    $(".villager-amount-div > div > span").html(villager.amount);
    $(".villager-cost").html("Villager: " + getVillagerCost() + " stone")
        
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