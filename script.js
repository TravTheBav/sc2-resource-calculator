const maxWorkers = 200;
const maxBases = 8;
const mineralOptimalSaturation = 16;
const vespeneOptimalSaturation = 3;

let createBaseButton = document.getElementById("create-base");
createBaseButton.addEventListener("click", CreateNewBase);
let deleteBaseButton = document.getElementById("delete-base");
deleteBaseButton.addEventListener("click", DeleteLastBase);
let totalWorkerCounter = document.querySelector('span.total-worker-counter');
let totalBaseCounter = document.querySelector('span.total-base-counter');

function CreateNewBase() {
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

function DeleteLastBase() {
    let lastBase = document.querySelector('.base-wrapper').lastChild;
    let workersFromLastBase = totalWorkersOnBase(lastBase); 

    document.querySelector('.base-wrapper').removeChild(lastBase);
    if (totalBases() > 0) {
        updateTotalBases('down', 1);
        updateTotalWorkers('down', workersFromLastBase);
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
    let workerCounter = document.querySelector(`div#${baseCardId}.base-card div#worker-counter-${buttonGroupId}.worker-counter`);
    let str = workerCounter.textContent;
    let numerator = getNumerator(str);
    let denominator = getDenominator(str);
    if (validWorkerDownClick(numerator)) {
        numerator--;
        updateTotalWorkers('down', 1);
        workerCounter.textContent = numerator.toString() + "/" + denominator.toString();
        if (denominator == mineralOptimalSaturation) {
            updateMineralGatherRate(numerator, baseCardId);
        }   else {
            updateVespeneGatherRate(baseCardId);
        }
        
    }
}

function workerButtonUpClick(baseCardId, buttonGroupId) {
    let workerCounter = document.querySelector(`div#${baseCardId}.base-card div#worker-counter-${buttonGroupId}.worker-counter`);
    let str = workerCounter.textContent;
    let numerator = getNumerator(str);
    let denominator = getDenominator(str);
    if (validWorkerUpClick(numerator, denominator)) {
        numerator++;
        updateTotalWorkers('up', 1);
        workerCounter.textContent = numerator.toString() + "/" + denominator.toString();
        if (denominator == mineralOptimalSaturation) {
            updateMineralGatherRate(numerator, baseCardId);
        }   else {
            updateVespeneGatherRate(baseCardId);
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
        if ((denominator == mineralOptimalSaturation) && (numerator < 24)) {
            return true;
        }   else if ((denominator == vespeneOptimalSaturation) && (numerator < vespeneOptimalSaturation)) {
            return true;
        }
    }
    return false;    
}

function updateMineralGatherRate(workers, baseCardId) {
    let base = document.querySelector(`div#${baseCardId}.base-card`);
    let currentIncome = base.querySelector('.minerals-income-amount');
    let optimalMineralGatherRate = 59;
    let subOptimalMineralGatherRate = 25;
    if (workers <= mineralOptimalSaturation) {
        currentIncome.textContent = workers * optimalMineralGatherRate;
    }   else if (workers <= 24) {
        currentIncome.textContent = (16 * optimalMineralGatherRate) + ((workers - 16) * subOptimalMineralGatherRate);
    }
}

function updateVespeneGatherRate(baseCardId) {
    let base = document.querySelector(`div#${baseCardId}.base-card`);
    let income = base.querySelector('.gas-income-amount');
    let vespeneGatherRate = 53;
    let leftIdNum = getBasePosition(baseCardId) * 3 - 2;
    let rightIdNum = getBasePosition(baseCardId) * 3;
    let leftVespeneWorkerCount = getNumerator(base.querySelector(`div#worker-counter-${leftIdNum}`).textContent);
    let rightVespeneWorkerCount = getNumerator(base.querySelector(`div#worker-counter-${rightIdNum}`).textContent);
    income.textContent = (leftVespeneWorkerCount * vespeneGatherRate) + (rightVespeneWorkerCount * vespeneGatherRate);
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
    base = document.querySelector(`div#${baseCardId}`);
    basesNodeList = base.parentNode;
    let index = Array.prototype.indexOf.call(basesNodeList.children, base);
    return index + 1;
}