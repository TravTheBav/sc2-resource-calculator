let totalBases = 0;

let createBaseButton = document.getElementById("create-base");
createBaseButton.addEventListener("click", CreateNewBase);
let deleteBaseButton = document.getElementById("delete-base");
deleteBaseButton.addEventListener("click", DeleteLastBase);
let totalWorkerCounter = document.querySelector('span.total-worker-counter');

function CreateNewBase() {
    let baseCard = document.createElement('div');
    baseCard.classList.add('base-card');
    totalBases++;
    baseCard.id = "base-" + totalBases.toString();
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
    if (totalBases > 0) {
        totalBases--;
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
    let startIdx = (totalBases * 3) - 2;

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
    for (let i = (totalBases * 3) - 2; i < (totalBases * 3) + 1; i++) {
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
    if (numerator > 0) {
        numerator--;
        updateTotalWorkers('down', 1);
    }
    workerCounter.textContent = numerator.toString() + "/" + denominator.toString();
}

function workerButtonUpClick(baseCardId, buttonGroupId) {
    let workerCounter = document.querySelector(`div#${baseCardId}.base-card div#worker-counter-${buttonGroupId}.worker-counter`);
    let str = workerCounter.textContent;
    let numerator = getNumerator(str);
    let denominator = getDenominator(str);
    if (totalWorkers() < 100) {
        numerator++;
        updateTotalWorkers('up', 1);
    }
    workerCounter.textContent = numerator.toString() + "/" + denominator.toString();
}

function setBaseCardMineralIncome(baseCard) {
    let wrapper = document.createElement('div');
    wrapper.classList.add('wrapper');
    wrapper.classList.add('mineral-income')
    wrapper.textContent = "Minerals per minute: ";
    let mineralIncome = document.createElement('span');
    mineralIncome.classList.add('mineral-income-amount');
    mineralIncome.textContent = "0";
    wrapper.appendChild(mineralIncome);
    baseCard.appendChild(wrapper);
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
    } else if (flag == 'up' && total < 100) {
        total += amount;
    }
    totalWorkerCounter.textContent = total.toString();
}

// returns all workers across all bases
function totalWorkers() {
    return parseInt(totalWorkerCounter.textContent);
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