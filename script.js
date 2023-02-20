let create_base_button = document.getElementById("create-base");
create_base_button.addEventListener("click", CreateNewBase);

function CreateNewBase() {
    let base_card = document.createElement('div');
    base_card.classList.add('base-card');
    document.querySelector('body').appendChild(base_card);

    setBaseCardIcons();
    setBaseCardWorkerCounters(base_card);
    setBaseCardButtons(base_card);
}

function setBaseCardIcons() {
    let base_building_icon = document.createElement('img');
    base_building_icon.classList.add('wire-frame');
    base_building_icon.setAttribute('src', 'assets/wireframe-terran-commandcenter.png');
    
    let gas_collection_building_icon_1 = document.createElement('img');
    gas_collection_building_icon_1.classList.add('wire-frame');
    gas_collection_building_icon_1.setAttribute('id', 1);
    gas_collection_building_icon_1.setAttribute('src', 'assets/wireframe-terran-refinery.png');

    let gas_collection_building_icon_2 = document.createElement('img');
    gas_collection_building_icon_2.classList.add('wire-frame');
    gas_collection_building_icon_2.setAttribute('id', 2);
    gas_collection_building_icon_2.setAttribute('src', 'assets/wireframe-terran-refinery.png');

    document.querySelector('body').lastChild.appendChild(gas_collection_building_icon_1);
    document.querySelector('body').lastChild.appendChild(base_building_icon);
    document.querySelector('body').lastChild.appendChild(gas_collection_building_icon_2);
}

function setBaseCardWorkerCounters(base_card) {
    let gas_worker_counter_1 = document.createElement('div');
    gas_worker_counter_1.classList.add('worker-counter');
    gas_worker_counter_1.textContent = "0/3";
    
    let gas_worker_counter_2 = document.createElement('div');
    gas_worker_counter_2.classList.add('worker-counter');
    gas_worker_counter_2.textContent = "0/3";
    
    let mineral_worker_counter = document.createElement('div');
    mineral_worker_counter.textContent = "0/16";
    mineral_worker_counter.classList.add('worker-counter');    

    base_card.appendChild(gas_worker_counter_1);
    base_card.appendChild(mineral_worker_counter);
    base_card.appendChild(gas_worker_counter_2);
}

function setBaseCardButtons(base_card) {
    for (let i = 1; i < 4; i++) {
        let button_group = document.createElement('div');
        button_group.classList.add('up-down-buttons');
        button_group.id = i;
        
        let down_button = document.createElement('button');
        let up_button = document.createElement('button');
        button_group.appendChild(down_button);
        button_group.appendChild(up_button);
        base_card.appendChild(button_group);
    }
}