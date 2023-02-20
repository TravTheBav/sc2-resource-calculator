let create_base_button = document.getElementById("create-base");
create_base_button.addEventListener("click", CreateNewBase);

function CreateNewBase() {
    let base_card = document.createElement('div');
    base_card.classList.add('base-card');
    document.querySelector('body').appendChild(base_card);

    let command_center_icon = document.createElement('img');
    command_center_icon.classList.add('wire-frame');
    command_center_icon.setAttribute('src', 'assets/wireframe-terran-commandcenter.png');
    
    let refinery_icon_1 = document.createElement('img');
    refinery_icon_1.classList.add('wire-frame');
    refinery_icon_1.setAttribute('id', 1);
    refinery_icon_1.setAttribute('src', 'assets/wireframe-terran-refinery.png');

    let refinery_icon_2 = document.createElement('img');
    refinery_icon_2.classList.add('wire-frame');
    refinery_icon_2.setAttribute('id', 2);
    refinery_icon_2.setAttribute('src', 'assets/wireframe-terran-refinery.png');

    document.querySelector('body').lastChild.appendChild(refinery_icon_1);
    document.querySelector('body').lastChild.appendChild(command_center_icon);
    document.querySelector('body').lastChild.appendChild(refinery_icon_2);
}