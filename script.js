let totalBases = 0;

let create_base_button = document.getElementById("create-base");
create_base_button.addEventListener("click", CreateNewBase);
let delete_base_button = document.getElementById("delete-base");
delete_base_button.addEventListener("click", DeleteLastBase);

function CreateNewBase() {
    let base_card = document.createElement('div');
    base_card.classList.add('base-card');
    totalBases++;
    base_card.id = "base-" + totalBases.toString();
    document.querySelector('.base-wrapper').appendChild(base_card);

    setBaseCardIcons();
    setBaseCardWorkerCounters(base_card);
    setBaseCardButtons(base_card);
}

function DeleteLastBase() {
    let last_base = document.querySelector('.base-wrapper').lastChild;
    document.querySelector('.base-wrapper').removeChild(last_base);
    if (totalBases > 0) {
        totalBases--;
    }
}

function setBaseCardIcons() {
    let base_building_icon = document.createElement('img');
    base_building_icon.classList.add('wire-frame');
    base_building_icon.setAttribute('src', 'assets/wireframe-terran-commandcenter.png');
    
    let gas_collection_building_icon_1 = document.createElement('img');
    gas_collection_building_icon_1.classList.add('wire-frame');
    gas_collection_building_icon_1.setAttribute('src', 'assets/wireframe-terran-refinery.png');

    let gas_collection_building_icon_2 = document.createElement('img');
    gas_collection_building_icon_2.classList.add('wire-frame');
    gas_collection_building_icon_2.setAttribute('src', 'assets/wireframe-terran-refinery.png');

    document.querySelector('.base-wrapper').lastChild.appendChild(gas_collection_building_icon_1);
    document.querySelector('.base-wrapper').lastChild.appendChild(base_building_icon);
    document.querySelector('.base-wrapper').lastChild.appendChild(gas_collection_building_icon_2);
}

function setBaseCardWorkerCounters(base_card) {
    let start_idx = (totalBases * 3) - 2;

    let gas_worker_counter_left = document.createElement('div');
    gas_worker_counter_left.classList.add('worker-counter');
    gas_worker_counter_left.id = start_idx;
    gas_worker_counter_left.textContent = "0/3";
    
    let mineral_worker_counter = document.createElement('div');
    mineral_worker_counter.classList.add('worker-counter');
    mineral_worker_counter.id = start_idx + 1;
    mineral_worker_counter.textContent = "0/16";

    let gas_worker_counter_right = document.createElement('div');
    gas_worker_counter_right.classList.add('worker-counter');
    gas_worker_counter_right.id = start_idx + 2;
    gas_worker_counter_right.textContent = "0/3";        

    base_card.appendChild(gas_worker_counter_left);
    base_card.appendChild(mineral_worker_counter);
    base_card.appendChild(gas_worker_counter_right);
}

function setBaseCardButtons(base_card) {
    for (let i = (totalBases * 3) - 2; i < (totalBases * 3) + 1; i++) {
        let button_group = document.createElement('div');
        button_group.classList.add('up-down-buttons');
        button_group.id = "button-group-" + i.toString();
        
        let down_button = document.createElement('button');
        down_button.classList.add('down');
        down_button.textContent = "-";
        down_button.addEventListener('click', function() { workerButtonDownClick(base_card.id, button_group.id); });
        
        let up_button = document.createElement('button');
        up_button.classList.add('up');
        up_button.textContent = "+";
        up_button.addEventListener('click', function() { workerButtonUpClick(base_card.id, button_group.id); });

        button_group.appendChild(down_button);
        button_group.appendChild(up_button);
        base_card.appendChild(button_group);
    }
}

function workerButtonDownClick(base_card_id, button_group_id) {
    let worker_counter = document.querySelector(`div#${base_card_id}.base-card div#${button_group_id}.worker-counter`);
    let str = worker_counter.textContent;
    let numerator = parseInt(str.split("/")[0]);
    let denominator = str.split("/")[1];
    if (numerator > 0) {
        numerator--;
    }
    worker_counter.textContent = numerator.toString() + "/" + denominator;
}

function workerButtonUpClick(base_card_id, button_group_id) {
    let worker_counter = document.querySelector(`div#${base_card_id}.base-card div#${button_group_id}.worker-counter`);
    let str = worker_counter.textContent;
    let numerator = parseInt(str.split("/")[0]);
    let denominator = str.split("/")[1];
    numerator++;
    worker_counter.textContent = numerator.toString() + "/" + denominator;
}