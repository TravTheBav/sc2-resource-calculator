const maxWorkers = 200;
const maxBases = 8;
const mineralOptimalSaturation = 16;
const mineralSubOptimalSaturation = 24;
const vespeneOptimalSaturation = 3;
const optimalMineralGatherRate = 59;
const subOptimalMineralGatherRate = 25;
const vespeneGatherRate = 53;

let createBaseButton = document.getElementById("create-base");
createBaseButton.addEventListener("click", CreateNewBase);
let deleteBaseButton = document.getElementById("delete-base");
deleteBaseButton.addEventListener("click", DeleteLastBase);
let totalWorkerCounter = document.querySelector('span.total-worker-counter');
let totalBaseCounter = document.querySelector('span.total-base-counter');
let totalMineralCounter = document.querySelector('span.total-mineral-counter');
let totalVespeneCounter = document.querySelector('span.total-vespene-counter');

function CreateNewBase() {
    if (totalBases() < maxBases) {
        let baseCard = document.createElement('div');
        baseCard.classList.add('base-card');
        updateTotalBases('up', 1);
        baseCard.id = "base-" + totalBases();
        document.querySelector('.base-wrapper').appendChild(baseCard);
    
        setBaseCardIcons();
        setBaseCardWorkerCounters(baseCard);
        setBaseCardButtons(baseCard);
        setBaseCardIncome(baseCard, 'minerals');
        setBaseCardIncome(baseCard, 'gas');
    }
}
    
function DeleteLastBase() {
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

function setBaseCardIcons() {
    let baseBuildingIcon = document.createElement('img');
    baseBuildingIcon.classList.add('wire-frame');
    baseBuildingIcon.setAttribute('src', 'assets/wireframe-terran-commandcenter.png');
    
    let vespeneBuildingIcon1 = document.createElement('img');
    vespeneBuildingIcon1.classList.add('wire-frame');
    vespeneBuildingIcon1.setAttribute('src', 'assets/wireframe-terran-refinery.png');

    let vespeneBuildingIcon2 = document.createElement('img');
    vespeneBuildingIcon2.classList.add('wire-frame');
    vespeneBuildingIcon2.setAttribute('src', 'assets/wireframe-terran-refinery.png');

    document.querySelector('.base-wrapper').lastChild.appendChild(vespeneBuildingIcon1);
    document.querySelector('.base-wrapper').lastChild.appendChild(baseBuildingIcon);
    document.querySelector('.base-wrapper').lastChild.appendChild(vespeneBuildingIcon2);
}

function setBaseCardWorkerCounters(baseCard) {
    let startIdx = (totalBases() * 3) - 2;

    let leftVespeneWorkerCounter = document.createElement('div');
    leftVespeneWorkerCounter.classList.add('worker-counter');
    leftVespeneWorkerCounter.id = "worker-counter-" + startIdx;
    leftVespeneWorkerCounter.textContent = "0/3";
    
    let mineralWorkerCounter = document.createElement('div');
    mineralWorkerCounter.classList.add('worker-counter');
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

function setBaseCardButtons(baseCard) {
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
        if (denominator == mineralOptimalSaturation) {
            updateMineralGatherRate(numerator, baseCardId);
            updateTotalMineralGatherRate(numerator, 'down');
        }   else {
            updateVespeneGatherRate(baseCardId);
            updateTotalVespeneGatherRate('down');
        }        
    }
}

function workerButtonUpClick(baseCardId, buttonGroupId) {
    let workerCounter = workerCounterQuerySelector(baseCardId, buttonGroupId);
    let str = workerCounter.textContent;
    let numerator = getNumerator(str);
    let denominator = getDenominator(str);
    if (validWorkerUpClick(numerator, denominator)) {
        numerator++;
        updateTotalWorkers('up', 1);
        workerCounter.textContent = numerator.toString() + "/" + denominator.toString();
        if (denominator == mineralOptimalSaturation) {
            updateMineralGatherRate(numerator, baseCardId);
            updateTotalMineralGatherRate(numerator, 'up');
        }   else {
            updateVespeneGatherRate(baseCardId);
            updateTotalVespeneGatherRate('up');
        }        
    }    
}

function validWorkerDownClick(numerator) {
    if (numerator > 0) {
        return true;
    }   else {
        return false;
    }
}

function validWorkerUpClick(numerator, denominator) {
    if (totalWorkers() < maxWorkers) {
        if ((denominator == mineralOptimalSaturation) && (numerator < mineralSubOptimalSaturation)) {
            return true;
        }   else if ((denominator == vespeneOptimalSaturation) && (numerator < vespeneOptimalSaturation)) {
            return true;
        }
    }
    return false;    
}

// updates mineral gather rate for a single base
function updateMineralGatherRate(workers, baseCardId) {
    let base = baseQuerySelector(baseCardId);
    let currentIncome = base.querySelector('.minerals-income-amount');
    if (workers <= mineralOptimalSaturation) {
        currentIncome.textContent = workers * optimalMineralGatherRate;
    }   else if (workers <= mineralSubOptimalSaturation) {
        currentIncome.textContent = (mineralOptimalSaturation * optimalMineralGatherRate) +
                                    ((workers - mineralOptimalSaturation) * subOptimalMineralGatherRate);
    }
}

// updates total minerals across all bases when a worker is added/subtracted
function updateTotalMineralGatherRate(workers, flag) {
    let num = parseInt(totalMineralCounter.textContent);
    if (workers <= mineralOptimalSaturation && flag == 'up') {
        num += optimalMineralGatherRate;
    }   else if (workers <= subOptimalMineralGatherRate && flag == 'up') {
        num += subOptimalMineralGatherRate;
    }   else if (workers < mineralOptimalSaturation && flag == 'down') {
        num -= optimalMineralGatherRate;
    }   else  {
        num -= subOptimalMineralGatherRate;
    }
    totalMineralCounter.textContent = num;
}

// updates total minerals or gas across all bases when a base is deleted
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
    income.textContent = (leftVespeneWorkerCount * vespeneGatherRate) + (rightVespeneWorkerCount * vespeneGatherRate);
}

// updates total vespene across all bases when a worker is added/subtracted
function updateTotalVespeneGatherRate(flag) {
    let num = parseInt(totalVespeneCounter.textContent);
    if (flag == 'up') {
        num += vespeneGatherRate;
    }   else  {
        num -= vespeneGatherRate;
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
    } else if (flag == 'up' && total < maxWorkers) {
        total += amount;
    }
    totalWorkerCounter.textContent = total.toString();
}

function updateTotalBases(flag, amount) {
    let total = totalBases();
    if (flag == 'down' && total > 0) {
        total -= amount;
    }   else if (flag == 'up' && total < maxBases) {
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
