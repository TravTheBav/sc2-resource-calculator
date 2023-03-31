const MAX_WORKERS = 200;
const MAX_BASES = 8;
const MAX_MINERAL_NODES = 12;
const MINERAL_OPTIMAL_SATURATION = 16;
const MINERAL_SUBOPTIMAL_SATURATION = 24;
const VESPENE_OPTIMAL_SATURATION = 3;
const OPTIMAL_MINERAL_GATHER_RATE = 59;
const SUBOPTIMAL_MINERAL_GATHER_RATE = 25;
const VESPENE_GATHER_RATE = 53;

let raceSelect = document.querySelector('#race')
raceSelect.addEventListener("change", updateBaseCardIcons);
let createBaseButton = document.getElementById("create-base");
createBaseButton.addEventListener("click", createNewBase);
let deleteBaseButton = document.getElementById("delete-base");
deleteBaseButton.addEventListener("click", deleteLastBase);
let resetButton = document.getElementById("reset");
resetButton.addEventListener("click", resetBases);

let totalWorkerCounter = document.querySelector('span.total-worker-counter');
let totalBaseCounter = document.querySelector('span.total-base-counter');
let totalMineralCounter = document.querySelector('span.total-mineral-counter');
let totalVespeneCounter = document.querySelector('span.total-vespene-counter');

// creates a new base card
function createNewBase() {
    if (totalBases() < MAX_BASES) {
        let baseCard = document.createElement('div');
        baseCard.classList.add('base-card');
        updateTotalBases('up', 1);
        baseCard.id = "base-" + totalBases();
        document.querySelector('.base-wrapper').appendChild(baseCard);
        let race = raceSelect.value;
    
        setBaseCardIcons(race);
        setBaseCardWorkerCounters(baseCard);
        setBaseCardWorkerButtons(baseCard);
        setBaseCardIncome(baseCard, 'minerals');
        setBaseCardIncome(baseCard, 'gas');
        setBaseCardMineralNodeButtons(baseCard);
        setBaseCardSaturateButton(baseCard);
    }
}

function setBaseCardMineralNodeButtons(base) {
    let upButton = document.createElement('button');
    let downButton = document.createElement('button');
    upButton.textContent = '+ node';
    upButton.classList.add('mineral-node');
    upButton.classList.add('up');
    upButton.addEventListener('click', mineralNodeButtonClick);
    downButton.textContent = '- node';
    downButton.classList.add('mineral-node');
    downButton.classList.add('down');
    downButton.addEventListener('click', mineralNodeButtonClick);
    base.appendChild(upButton);
    base.appendChild(downButton);
}

function mineralNodeButtonClick() {
    let mineralWorkerCounter = this.parentNode.querySelector('.worker-counter.minerals');
    let currentWorkers = getNumerator(mineralWorkerCounter.textContent);
    let maxWorkers = getDenominator(mineralWorkerCounter.textContent);
    if (this.classList.contains('up') && maxWorkers < MAX_MINERAL_NODES * 2) {
        let str = `${currentWorkers}/${maxWorkers + 2}`;
        mineralWorkerCounter.textContent = str;
    }   else if (this.classList.contains('down') && maxWorkers > 0) {
        let str = `${currentWorkers}/${maxWorkers - 2}`;
        mineralWorkerCounter.textContent = str;
    }
}

function setBaseCardSaturateButton(base) {
    let button = document.createElement('button');
    button.classList.add('saturate');
    button.textContent = 'saturate';
    button.addEventListener('click', function() {
        saturateBase(base);
    })
    base.appendChild(button);
}

// sets a base's workers to optimal saturation (3 on each gas and 16 on minerals)
// OLD FUNCTION
//function saturateBase(base) {
//    resetBase(base);
//    updateTotalWorkers('up', 22);
//    totalMineralCounter.textContent = parseInt(totalMineralCounter.textContent) + (MINERAL_OPTIMAL_SATURATION * OPTIMAL_MINERAL_GATHER_RATE);
//    totalVespeneCounter.textContent = parseInt(totalVespeneCounter.textContent) + ((VESPENE_OPTIMAL_SATURATION * VESPENE_GATHER_RATE) * 2);
//    base.querySelector('.minerals-income-amount').textContent = MINERAL_OPTIMAL_SATURATION * OPTIMAL_MINERAL_GATHER_RATE;
//    base.querySelector('.gas-income-amount').textContent = (VESPENE_OPTIMAL_SATURATION * VESPENE_GATHER_RATE) * 2;
//    let pos = getBasePosition(base.id);
//    for (i = 2; i >= 0; i--) {
//        if (i == 1) {
//            workerCounterQuerySelector(base.id, (pos * 3) - i).textContent = "16/16";
//        }   else  {
//            workerCounterQuerySelector(base.id, (pos * 3) - i).textContent = "3/3";
//        }
//    }
//}

// NEW FUNCTION
function saturateBase(base) {
    let maxMineralWorkers = getDenominator(mineralWorkerCounterQuerySelector(base.id).textContent);
    resetBase(base);
    updateTotalWorkers('up', (6 + maxMineralWorkers));  // 6 for total vespene workers plus 2 * each mineral node
    totalMineralCounter.textContent = parseInt(totalMineralCounter.textContent) + (maxMineralWorkers * OPTIMAL_MINERAL_GATHER_RATE);
    totalVespeneCounter.textContent = parseInt(totalVespeneCounter.textContent) + ((VESPENE_OPTIMAL_SATURATION * VESPENE_GATHER_RATE) * 2);
    base.querySelector('.minerals-income-amount').textContent = maxMineralWorkers * OPTIMAL_MINERAL_GATHER_RATE;
    base.querySelector('.gas-income-amount').textContent = (VESPENE_OPTIMAL_SATURATION * VESPENE_GATHER_RATE) * 2;
    let pos = getBasePosition(base.id);
    for (i = 2; i >= 0; i--) {
        if (i == 1) {
            workerCounterQuerySelector(base.id, (pos * 3) - i).textContent = `${maxMineralWorkers}/${maxMineralWorkers}`;
        }   else  {
            workerCounterQuerySelector(base.id, (pos * 3) - i).textContent = "3/3";
        }
    }
}



// resets a base's worker counts, income, and updates totals at the top of page
function resetBase(base) {
    updateTotalWorkers('down', totalWorkersOnBase(base));
    updateTotalIncomeOnBaseDelete(base.id, 'minerals');
    updateTotalIncomeOnBaseDelete(base.id, 'gas');
    base.querySelector('.minerals-income-amount').textContent = 0;
    base.querySelector('.gas-income-amount').textContent = 0;
    let pos = getBasePosition(base.id);
    for (i = 2; i >= 0; i--) {
        workerCounterQuerySelector(base.id, (pos * 3) - i).textContent = "0/0";
    }
}

// deletes the last base card
function deleteLastBase() {
    if (totalBases() == 0) {
        return;
    } else {
        let lastBase = document.querySelector('.base-wrapper').lastChild;
        let workersFromLastBase = totalWorkersOnBase(lastBase);    
        
        updateTotalBases('down', 1);
        updateTotalWorkers('down', workersFromLastBase);
        updateTotalIncomeOnBaseDelete(lastBase.id, 'minerals');
        updateTotalIncomeOnBaseDelete(lastBase.id, 'gas');
        
        document.querySelector('.base-wrapper').removeChild(lastBase);        
    }    
}

// deletes all bases
function resetBases() {
    total = totalBases();
    for (i = 0; i < total; i++) {
        deleteLastBase();
    }
}

function setBaseCardIcons(race) {
    let baseBuildingIcon = document.createElement('img');
    baseBuildingIcon.classList.add('wire-frame');
    baseBuildingIcon.setAttribute('src', `assets/wireframe-${race}-base.png`);
    
    let vespeneBuildingIcon1 = document.createElement('img');
    vespeneBuildingIcon1.classList.add('wire-frame');
    vespeneBuildingIcon1.setAttribute('src', `assets/wireframe-${race}-gas.png`);

    let vespeneBuildingIcon2 = document.createElement('img');
    vespeneBuildingIcon2.classList.add('wire-frame');
    vespeneBuildingIcon2.setAttribute('src', `assets/wireframe-${race}-gas.png`);

    document.querySelector('.base-wrapper').lastChild.appendChild(vespeneBuildingIcon1);
    document.querySelector('.base-wrapper').lastChild.appendChild(baseBuildingIcon);
    document.querySelector('.base-wrapper').lastChild.appendChild(vespeneBuildingIcon2);
}

function updateBaseCardIcons() {
    let race = raceSelect.value
    let baseCards = document.querySelectorAll('.base-card');
    baseCards.forEach(baseCard => {
        let childNodes = baseCard.children;
        for (i = 0; i < 3; i++) {
            if (i % 2 == 0) {
                childNodes[i].setAttribute('src', `assets/wireframe-${race}-gas.png`);
            }   else  {
                childNodes[i].setAttribute('src', `assets/wireframe-${race}-base.png`);
            }
        }
    })
}

function setBaseCardWorkerCounters(baseCard) {
    let startIdx = (totalBases() * 3) - 2;

    let leftVespeneWorkerCounter = document.createElement('div');
    leftVespeneWorkerCounter.classList.add('worker-counter');
    leftVespeneWorkerCounter.id = "worker-counter-" + startIdx;
    leftVespeneWorkerCounter.textContent = "0/3";
    
    let mineralWorkerCounter = document.createElement('div');
    mineralWorkerCounter.classList.add('worker-counter');
    mineralWorkerCounter.classList.add('minerals');
    mineralWorkerCounter.id = "worker-counter-" + (startIdx + 1).toString();
    mineralWorkerCounter.textContent = "0/16";

    let rightVespeneWorkerCounter = document.createElement('div');
    rightVespeneWorkerCounter.classList.add('worker-counter');
    rightVespeneWorkerCounter.id = "worker-counter-" + (startIdx + 2).toString();
    rightVespeneWorkerCounter.textContent = "0/3";        

    baseCard.appendChild(leftVespeneWorkerCounter);
    baseCard.appendChild(mineralWorkerCounter);
    baseCard.appendChild(rightVespeneWorkerCounter);
}

function setBaseCardWorkerButtons(baseCard) {
    for (let i = (totalBases() * 3) - 2; i < (totalBases() * 3) + 1; i++) {
        let buttonGroup = document.createElement('div');
        buttonGroup.classList.add('up-down-buttons');
        buttonGroup.id = i;
        
        let downButton = document.createElement('button');
        downButton.classList.add('down');
        downButton.textContent = "-";
        downButton.addEventListener('click', function() { workerButtonDownClick(baseCard.id, buttonGroup.id); });
        
        let upButton = document.createElement('button');
        upButton.classList.add('up');
        upButton.textContent = "+";
        upButton.addEventListener('click', function() { workerButtonUpClick(baseCard.id, buttonGroup.id); });

        buttonGroup.appendChild(downButton);
        buttonGroup.appendChild(upButton);
        baseCard.appendChild(buttonGroup);
    }
}

function workerButtonDownClick(baseCardId, buttonGroupId) {
    let workerCounter = workerCounterQuerySelector(baseCardId, buttonGroupId);
    let str = workerCounter.textContent;
    let numerator = getNumerator(str);
    let denominator = getDenominator(str);
    if (validWorkerDownClick(numerator)) {
        numerator--;
        updateTotalWorkers('down', 1);
        workerCounter.textContent = numerator.toString() + "/" + denominator.toString();
        if (denominator == 3) {
            updateVespeneGatherRate(baseCardId);
            updateTotalVespeneGatherRate('down');
        }   else  {
            updateMineralGatherRate(numerator, baseCardId, denominator);
            updateTotalMineralGatherRate(numerator, 'down', denominator);
        }   
    }
}

function workerButtonUpClick(baseCardId, buttonGroupId) {
    let workerCounter = workerCounterQuerySelector(baseCardId, buttonGroupId);
    let str = workerCounter.textContent;
    let numerator = getNumerator(str);
    let denominator = getDenominator(str);
    if (validWorkerUpClick()) {
        numerator++;
        updateTotalWorkers('up', 1);
        workerCounter.textContent = numerator.toString() + "/" + denominator.toString();
        if (denominator == 3) {
            updateVespeneGatherRate(baseCardId);
            updateTotalVespeneGatherRate('up');
        }   else  {
            updateMineralGatherRate(numerator, baseCardId, denominator);
            updateTotalMineralGatherRate(numerator, 'up', denominator);
        }
    }    
}

function validWorkerDownClick(numerator) {
    if (numerator > 0) {
        return true;
    }
    return false;
}

function validWorkerUpClick() {
    if (totalWorkers() < MAX_WORKERS) {
        return true;
    }
    return false;    
}

// updates mineral gather rate for a single base
function updateMineralGatherRate(workers, baseCardId, denominator) {
    if (denominator == 0) {
        return;  // no need to calculate the mineral gather rate if there are no minerals!
    }
    
    let base = baseQuerySelector(baseCardId);
    let currentIncome = base.querySelector('.minerals-income-amount');
    if (workers <= denominator) {   // up to 2 workers per node
        currentIncome.textContent = workers * OPTIMAL_MINERAL_GATHER_RATE;
    }   else if (workers <= (denominator * 1.5)) {  // when there is a least one mineral patch with 3 workers
        currentIncome.textContent = (denominator * OPTIMAL_MINERAL_GATHER_RATE) +
                                    ((workers - denominator) * SUBOPTIMAL_MINERAL_GATHER_RATE);
    }
}

// updates total minerals across all bases when a worker is added/subtracted
function updateTotalMineralGatherRate(workers, flag, denominator) {
    if (denominator == 0) {
        return;  // no need to calculate the mineral gather rate if there are no minerals
    }

    let num = parseInt(totalMineralCounter.textContent);
    if (workers <= denominator && flag == 'up') {
        num += OPTIMAL_MINERAL_GATHER_RATE;
    }   else if (workers <= (denominator * 1.5) && flag == 'up') {
        num += SUBOPTIMAL_MINERAL_GATHER_RATE;
    }   else if (workers < denominator && flag == 'down') {
        num -= OPTIMAL_MINERAL_GATHER_RATE;
    }   else if (workers < (denominator * 1.5) && flag == 'down')  {
        num -= SUBOPTIMAL_MINERAL_GATHER_RATE;
    }
    totalMineralCounter.textContent = num;
}

// updates total minerals or gas across all bases when a base is deleted/reset
// for minerals pass in 'minerals' for incomeType; for gas pass in 'gas'
function updateTotalIncomeOnBaseDelete(baseCardId, incomeType) {
    let baseIncome = getBaseIncome(baseCardId, incomeType);
    if (incomeType == 'minerals') {
        totalMineralCounter.textContent = parseInt(totalMineralCounter.textContent) - baseIncome;
    }   else  {
        totalVespeneCounter.textContent = parseInt(totalVespeneCounter.textContent) - baseIncome;
    }
}

// updates vespene gather rate for a single base
function updateVespeneGatherRate(baseCardId) {
    let base = baseQuerySelector(baseCardId);
    let income = base.querySelector('.gas-income-amount');
    let leftIdNum = getBasePosition(baseCardId) * 3 - 2;
    let rightIdNum = getBasePosition(baseCardId) * 3;
    let leftVespeneWorkerCount = getNumerator(workerCounterQuerySelector(baseCardId, leftIdNum).textContent);
    let rightVespeneWorkerCount = getNumerator(workerCounterQuerySelector(baseCardId, rightIdNum).textContent);
    income.textContent = (leftVespeneWorkerCount * VESPENE_GATHER_RATE) + (rightVespeneWorkerCount * VESPENE_GATHER_RATE);
}

// updates total vespene across all bases when a worker is added/subtracted
function updateTotalVespeneGatherRate(flag) {
    let num = parseInt(totalVespeneCounter.textContent);
    if (flag == 'up') {
        num += VESPENE_GATHER_RATE;
    }   else  {
        num -= VESPENE_GATHER_RATE;
    }
    totalVespeneCounter.textContent = num;
}

function setBaseCardIncome(baseCard, incomeType) {
    let wrapper = document.createElement('div');
    wrapper.classList.add('wrapper');
    wrapper.classList.add(`${incomeType}-income`);
    wrapper.textContent = `${incomeType} per minute: `;
    let incomeRate = document.createElement('span');
    incomeRate.classList.add(`${incomeType}-income-amount`);
    incomeRate.textContent = "0";
    wrapper.appendChild(incomeRate);
    baseCard.appendChild(wrapper);
}

function updateTotalWorkers(flag, amount) {
    let total = totalWorkers();
    if (flag == 'down' && total > 0) {
        total -= amount;
    } else if (flag == 'up' && total < MAX_WORKERS) {
        total += amount;
    }
    totalWorkerCounter.textContent = total.toString();
}

function updateTotalBases(flag, amount) {
    let total = totalBases();
    if (flag == 'down' && total > 0) {
        total -= amount;
    }   else if (flag == 'up' && total < MAX_BASES) {
        total += amount;
    }
    totalBaseCounter.textContent = total.toString();
}

// returns all workers across all bases
function totalWorkers() {
    return parseInt(totalWorkerCounter.textContent);
}

function totalBases() {
    return parseInt(totalBaseCounter.textContent);
}

// returns all workers at a given base
function totalWorkersOnBase(base) {
    let total = 0;
    let workerCounters = base.querySelectorAll('.worker-counter');
    for (let i = 0; i < workerCounters.length; i++) {
        let workers = getNumerator(workerCounters[i].textContent);
        total += workers;
    }
    return total;
}

// parses a string representing a fraction and returns the numerator as an int
function getNumerator(str) {
    return parseInt(str.split("/")[0]);
}

// parses a string representing a fraction and returns the denominator as an int
function getDenominator(str) {
    return parseInt(str.split("/")[1]);
}

// returns the position of the base in the list of all bases
function getBasePosition(baseCardId) {
    base = baseQuerySelector(baseCardId);
    basesNodeList = base.parentNode;
    let index = Array.prototype.indexOf.call(basesNodeList.children, base);
    return index + 1;
}

// returns a base's total mineral or vespene income
// for minerals pass in 'minerals' for incomeType; for gas pass in 'gas'
function getBaseIncome(baseCardId, incomeType) {
    base = baseQuerySelector(baseCardId);
    let income = base.querySelector(`.${incomeType}-income-amount`).textContent;
    return parseInt(income);
}

// returns the query selector for a single base card
function baseQuerySelector(baseCardId) {
    return document.querySelector(`div#${baseCardId}.base-card`);
}

// returns the query selector for a single worker counter
function workerCounterQuerySelector(baseCardId, buttonGroupId) {
    return document.querySelector(`div#${baseCardId}.base-card div#worker-counter-${buttonGroupId}.worker-counter`);
}

// returns the query selector for the minerals worker counter
function mineralWorkerCounterQuerySelector(baseCardId) {
    return baseQuerySelector(baseCardId).querySelector('.worker-counter.minerals');
}