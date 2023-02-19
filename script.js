let create_base_button = document.getElementById("create-base");
create_base_button.addEventListener("click", CreateNewBase);

function CreateNewBase() {
    let base_card = document.createElement('div.base-card');
    document.querySelector('body').appendChild(base_card);

    let command_center_icon = document.createElement('img');
    command_center_icon.setAttribute('class', 'wire-frame');
    command_center_icon.setAttribute('src', 'assets/wireframe-terran-commandcenter.png');
    let refinery_icon = document.createElement('img.wire-frame');
    refinery_icon.setAttribute('class', 'wire-frame');
    refinery_icon.setAttribute('src', 'assets/wireframe-terran-refinery.png');

    document.querySelector('body').lastChild.appendChild(command_center_icon);
}