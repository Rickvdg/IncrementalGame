let resources = {
    "wheat": {
        "id": 0,
        "amount": 0,
        "stockpile": 100,
        "autoincrease": 0
    },
    "stone": {
        "id": 1,
        "amount": 0,
        "stockpile": 100,
        "autoincrease": 0
    },
    "wood": {
        "id": 2,
        "amount": 0,
        "stockpile": 100,
        "autoincrease": 0
    }
}

let villager = {
    "amount": 0
}

let unlockables = {
    "craftingStation": {
        "locked": true,
        "cost": 20,
        "resource": "stone",
        "level": 1
    },
    "stoneQuarry": {
        "locked": true,
        "cost": 35,
        "resource": "wheat",
        "level": 1
    }
}

let craftingItems = {
    "bread": {
        "amount": 0,
        "cost": {
            "wheat": 20,
            "wood": 1
        }
    }
}
