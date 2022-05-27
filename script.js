const citiesStats = [
    {name: "alexandria",    wonderScores : [3, 0, 7], wonderScoresB : [0, 0, 7]},
    {name: "babylon",       wonderScores : [3, 0, 7], wonderScoresB : [0, 0]},
    {name: "ephesus",       wonderScores : [3, 0, 7], wonderScoresB : [2, 3, 5]},
    {name: "giza",          wonderScores : [3, 5, 7], wonderScoresB : [3, 5, 5, 7]},
    {name: "halicarnassus", wonderScores : [3, 0, 7], wonderScoresB : [2, 1, 0]},
    {name: "olympia",       wonderScores : [3, 0, 7], wonderScoresB : [2, 3, 5]},
    {name: "rhodes",        wonderScores : [3, 0, 7], wonderScoresB : [3, 4]},
];

const Science = Object.freeze({
    gear:    0,
    tablet:  1,
    compass: 2,
});

class City {
    constructor() {}

    _index = 0
    set index(value) {
        this._index = value;
        if (this.constructedStages > this.wonderStages().length) {
            this.constructedStages = this.wonderStages().length;
        }
    }
    get index() {
        return this._index;
    }

    _sideB = false
    set sideB(value) {
        this._sideB = value;
        if (this.constructedStages > this.wonderStages().length) {
            this.constructedStages = this.wonderStages().length;
        }
    }
    get sideB() {
        return this._sideB;
    }

    constructedStages = 0

    treasure = 0

    victoryNum = 0
    defeatNum = 0

    bluePointsNum = 0

    gearCardsNum = 0
    tabletCardsNum = 0
    compassCardsNum = 0

    greyCardsNum = 0
    brownCardNum = 0
    yellowCardsNum = 1
    redCardsNum = 0
    purpleCardsNum = 1

    commerceArena = false
    commerceChamber = false
    commerceHaven = false
    commerceLighthouse = false
    commerceLudus = false

    guildScientists = false
    guildWorkers = false
    guildCraftsmens = false
    guildMagistrates = false
    guildTraders = false
    guildBuilders = false
    guildSpies = false
    guildPhilosophers = false
    guildDecorators = false
    guildShipowners = false

    neighboursBrownCardsNum = 0
    neighboursGreyCardsNum = 0
    neighboursBlueCardsNum = 0
    neighboursYellowCardsNum = 0
    neighboursRedCardsNum = 0
    neighboursGreenCardsNum = 0

    neighboursWonderStages = 0

    wonderStages() {
        const stats = citiesStats[this.index];
        return this.sideB ? stats.wonderScoresB : stats.wonderScores;
    }

    wonderScore() {
        var score = 0;
        for (let i = 0; i < this.constructedStages; i++) {
            score += this.wonderStages()[i];
        }
        return score;
    }

    treasureScore() {
        return Math.floor(this.treasure/3);
    }

    militaryScore() {
        return this.victoryNum - this.defeatNum;
    }

    civicScore() {
        return this.bluePointsNum;
    }

    commerceScore() {
        var result = 0;
        if (this.commerceArena) {
            result += 1*this.constructedStages;
        }
        if (this.commerceChamber) {
            result += 2*this.greyCardsNum;
        }
        if (this.commerceHaven) {
            result += 1*this.brownCardNum;
        }
        if (this.commerceLighthouse) {
            result += 1*this.yellowCardsNum;
        }
        if (this.commerceLudus) {
            result += 1*this.redCardsNum;
        }
        return result;
    }

    scienceWildcardsNum() {
        var result = 0;
        if (citiesStats[this.index].name == "babylon" && this.constructedStages >= 2) {
            result++;
        }
        if (this.guildScientists) {
            result++;
        }
        return result;
    }

    scienceScore() {
        var arr = Array(this.scienceWildcardsNum()).fill(0);
        return optimizeScience(this.gearCardsNum, this.tabletCardsNum, 
                this.compassCardsNum, arr);
    }

    guildsScore() {
        var result = 0;
        if (this.guildWorkers) {
            result += 1*this.neighboursBrownCardsNum;
        }
        if (this.guildCraftsmens) {
            result += 1*this.neighboursGreyCardsNum;
        }
        if (this.guildMagistrates) {
            result += 1*this.neighboursBlueCardsNum;
        }
        if (this.guildTraders) {
            result += 1*this.neighboursYellowCardsNum;
        }
        if (this.guildBuilders) {
            result += 1*this.neighboursWonderStages;
            result += 1*this.constructedStages;
        }
        if (this.guildSpies) {
            result += 1*this.neighboursRedCardsNum;
        }
        if (this.guildPhilosophers) {
            result += 1*this.neighboursGreenCardsNum;
        }
        if (this.guildDecorators) {
            if (this.constructedStages == this.wonderStages().length) {
                result += 7;
            }
        }
        if (this.guildShipowners) {
            result += 1*this.brownCardNum;
            result += 1*this.greyCardsNum;
            result += 1*this.purpleCardsNum;
        }
        
        return result;
    }

    score() {
        return this.wonderScore() + this.treasureScore() + this.militaryScore()
                + this.civicScore() + this.commerceScore() + this.scienceScore()
                + this.guildsScore();
    }
}

city = new City();

function updateView(city) {
    const stats = citiesStats[city.index];
    const wonderScores = city.sideB ? stats.wonderScoresB : stats.wonderScores;

    document.getElementById("constructed-stages").childNodes.forEach((child) => {
        child.disabled = Number(child.value) > wonderScores.length;
        if (Number(child.value) == city.constructedStages) {
            child.selected = true;
        }
    });

    document.getElementById("science-wildcards-babylon2").checked = 
            stats.name == "babylon" && city.constructedStages >= 2;

    document.getElementById("commerce-arena-wonderstages").value = city.constructedStages;
    document.getElementById("guild-builders-stages").value = city.constructedStages;
    document.getElementById("guild-decorators-constructedwonder").checked = 
            city.constructedStages == city.wonderStages().length;

    document.getElementById("total-wonder").textContent = city.wonderScore();
    document.getElementById("total-treasure").textContent = city.treasureScore();
    document.getElementById("total-military").textContent = city.militaryScore();
    document.getElementById("total-civic").textContent = city.civicScore();
    document.getElementById("total-commerce").textContent = city.commerceScore();
    document.getElementById("total-science").textContent = city.scienceScore();
    document.getElementById("total-guilds").textContent = city.guildsScore();
    document.getElementById("grand-total").textContent = city.score();

    var gearNum = city.gearCardsNum;
    var tabletNum = city.tabletCardsNum;
    var compassNum = city.compassCardsNum;

    var arr = Array(city.scienceWildcardsNum()).fill(0);
    var r = optimizeScience(gearNum, tabletNum, compassNum, arr);
    arr.forEach((el) => {
        switch (el) {
            case Science.gear:
                gearNum++; break;
            case Science.tablet:
                tabletNum++; break;
            case Science.compass:
                compassNum++; break;
        }
    });

    const setof3Num = Math.min.apply(null, [gearNum, tabletNum, compassNum]);

    document.getElementById("formula-gears").textContent = gearNum;
    document.getElementById("formula-tablets").textContent = tabletNum;
    document.getElementById("formula-compasses").textContent = compassNum;
    document.getElementById("formula-total-identical").textContent = 
            gearNum*gearNum + tabletNum*tabletNum + compassNum*compassNum;
    document.getElementById("formula-setsof3").textContent = setof3Num;
    document.getElementById("formula-total-setsof3").textContent = (setof3Num*7);


}

function scienceScore(gearNum, tabletNum, compassNum) {
    const setNum = Math.min.apply(null, [gearNum, tabletNum, compassNum]);
    return gearNum*gearNum + tabletNum*tabletNum + compassNum*compassNum + setNum*7;
}

function optimizeScience(gearNum, tabletNum, compassNum, out_wildcards) {
    function optimizeScienceImpl(gearNum, tabletNum, compassNum, out_wildcards, depth, data) {
        if (depth == out_wildcards.length) {
            return scienceScore(gearNum, tabletNum, compassNum);
        }
        else {
            [Science.gear, Science.tablet, Science.compass].forEach((symbol) => {
                var arr = [gearNum, tabletNum, compassNum];
                arr[symbol] += 1;
                data.wildcards[depth] = symbol;
                const currResult = optimizeScienceImpl(arr[0], arr[1], arr[2], 
                        out_wildcards, depth + 1, data);
                if (currResult > data.bestScore) {
                    data.bestScore = currResult;
                    data.wildcards.forEach((el, i) => {
                        out_wildcards[i] = el;
                    })
                }
            })
            return data.bestScore;
        }
    }
    return optimizeScienceImpl(gearNum, tabletNum, compassNum, out_wildcards, 0, 
                {wildcards : Array(out_wildcards.length).fill(0), bestScore : 0});
}

window.onload = function (_) {

    document.getElementById("lang-selector").addEventListener('change', (event) => {
        window.location.href='../'+event.target.value;
    });

    document.getElementById("city").addEventListener("change", (event) => {
        city.index = citiesStats.findIndex((el) => el.name == event.target.value);
        updateView(city);
    });

    document.getElementById("sideb").addEventListener("change", (event) => {
        city.sideB = event.target.checked;
        updateView(city);
    });

    document.getElementById("constructed-stages").addEventListener("change", (event) => {
        var val = event.target.value;
        city.constructedStages = Number(event.target.value);
        updateView(city);
    });

    document.getElementById("coin-num").addEventListener('change', (event) => {
        city.treasure = Number(event.target.value);
        updateView(city);
    });

    document.getElementById("victory-num").addEventListener('change', (event) => {
        city.victoryNum = Number(event.target.value);
        updateView(city);
    });
    document.getElementById("defeat-num").addEventListener('change', (event) => {
        city.defeatNum = Number(event.target.value);
        updateView(city);
    });

    document.getElementById("civic-points").addEventListener('change', (event) => {
        city.bluePointsNum = Number(event.target.value);
        updateView(city);
    });


    document.getElementById("commerce-arena").addEventListener('change', (event) => {
        city.commerceArena = event.target.checked;
        updateView(city);
    });
    document.getElementById("commerce-chamber").addEventListener('change', (event) => {
        city.commerceChamber = event.target.checked;
        updateView(city);
    });
    document.getElementById("commerce-haven").addEventListener('change', (event) => {
        city.commerceHaven = event.target.checked;
        updateView(city);
    });
    document.getElementById("commerce-lighthouse").addEventListener('change', (event) => {
        city.commerceLighthouse = event.target.checked;
        updateView(city);
    });
    document.getElementById("commerce-ludus").addEventListener('change', (event) => {
        city.commerceLudus = event.target.checked;
        updateView(city);
    });

    document.getElementById("commerce-chamber-greycards").addEventListener('change', (event) => {
        document.getElementById("guild-shipowners-greycards").value = event.target.value;
        city.greyCardsNum = Number(event.target.value);
        updateView(city);
    });
    document.getElementById("commerce-haven-browncards").addEventListener('change', (event) => {
        document.getElementById("guild-shipowners-browncards").value = event.target.value;
        city.brownCardNum = Number(event.target.value);
        updateView(city);
    });
    document.getElementById("commerce-lighthouse-yellowcards").addEventListener('change', (event) => {
        city.yellowCardsNum = Number(event.target.value);
        updateView(city);
    });
    document.getElementById("commerce-ludus-redcards").addEventListener('change', (event) => {
        city.redCardsNum = Number(event.target.value);
        updateView(city);
    });
    

    document.getElementById("science-gearcards").addEventListener('change', (event) => {
        city.gearCardsNum = Number(event.target.value);
        updateView(city);
    });
    document.getElementById("science-tabletcards").addEventListener('change', (event) => {
        city.tabletCardsNum = Number(event.target.value);
        updateView(city);
    });
    document.getElementById("science-compasscards").addEventListener('change', (event) => {
        city.compassCardsNum = Number(event.target.value);
        updateView(city);
    });


    document.getElementById("guild-scientists").addEventListener('change', (event) => {
        city.guildScientists = event.target.checked;
        updateView(city);
    });
    document.getElementById("guild-workers").addEventListener('change', (event) => {
        city.guildWorkers = event.target.checked;
        updateView(city);
    });
    document.getElementById("guild-craftsmens").addEventListener('change', (event) => {
        city.guildCraftsmens = event.target.checked;
        updateView(city);
    });
    document.getElementById("guild-magistrates").addEventListener('change', (event) => {
        city.guildMagistrates = event.target.checked;
        updateView(city);
    });
    document.getElementById("guild-traders").addEventListener('change', (event) => {
        city.guildTraders = event.target.checked;
        updateView(city);
    });
    document.getElementById("guild-builders").addEventListener('change', (event) => {
        city.guildBuilders = event.target.checked;
        updateView(city);
    });
    document.getElementById("guild-spies").addEventListener('change', (event) => {
        city.guildSpies = event.target.checked;
        updateView(city);
    });
    document.getElementById("guild-philosophers").addEventListener('change', (event) => {
        city.guildPhilosophers = event.target.checked;
        updateView(city);
    });
    document.getElementById("guild-decorators").addEventListener('change', (event) => {
        city.guildDecorators = event.target.checked;
        updateView(city);
    });
    document.getElementById("guild-shipowners").addEventListener('change', (event) => {
        city.guildShipowners = event.target.checked;
        updateView(city);
    });

    document.getElementById("guild-workers-neighbours-browncards").addEventListener('change', (event) => {
        city.neighboursBrownCardsNum = Number(event.target.value);
        updateView(city);
    });
    document.getElementById("guild-craftsmens-neighbours-greycards").addEventListener('change', (event) => {
        city.neighboursGreyCardsNum = Number(event.target.value);
        updateView(city);
    });
    document.getElementById("guild-magistrates-neighbours-bluecards").addEventListener('change', (event) => {
        city.neighboursBlueCardsNum = Number(event.target.value);
        updateView(city);
    });
    document.getElementById("guild-traders-neighbours-yellowcards").addEventListener('change', (event) => {
        city.neighboursYellowCardsNum = Number(event.target.value);
        updateView(city);
    });
    document.getElementById("guild-spies-neighbours-redcards").addEventListener('change', (event) => {
        city.neighboursRedCardsNum = Number(event.target.value);
        updateView(city);
    });
    document.getElementById("guild-philosophers-neighbours-greencards").addEventListener('change', (event) => {
        city.neighboursGreenCardsNum = Number(event.target.value);
        updateView(city);
    });

    document.getElementById("guild-builders-neighbours-stages").addEventListener('change', (event) => {
        city.neighboursWonderStages = Number(event.target.value);
        updateView(city);
    });

    document.getElementById("guild-shipowners-greycards").addEventListener('change', (event) => {
        document.getElementById("commerce-chamber-greycards").value = event.target.value;
        city.greyCardsNum = Number(event.target.value);
        updateView(city);
    });
    document.getElementById("guild-shipowners-browncards").addEventListener('change', (event) => {
        document.getElementById("commerce-haven-browncards").value = event.target.value;
        city.brownCardNum = Number(event.target.value);
        updateView(city);
    });
    document.getElementById("guild-shipowners-purplecards").addEventListener('change', (event) => {
        city.purpleCardsNum = Number(event.target.value);
        updateView(city);
    });

    
}