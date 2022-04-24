const baseURL = "http://localhost:3000/paletas";
const msgAlert = document.querySelector(".msg-alert")

async function findAllPaletas() {
  const response = await fetch(`${baseURL}/all-paletas`);
  const paletas = await response.json();

  paletas.forEach(function (paleta) {
    document.querySelector("#paletaList").insertAdjacentHTML(
      "beforeend",
      `
        <div class="paleta-list-item" id="paleta-list-item-${paleta._id}">
          <div>
            <div class="paleta-list-item-flavor">${paleta.flavor}</div>
            <div class="paleta-list-item-price">R$ ${paleta.price}</div>
            <div class="paleta-list-item-description">${paleta.description}</div>
            <div class="paleta-list-item-actions actions">
              <button class="actions-edit btn" onclick="showModal('${paleta._id}')">Editar</button>
              <button class="actions-delete btn" onclick="showModalDelete('${paleta._id}')">Apagar</button>
            </div>
          </div>
          <img class="paleta-list-item-photo" src=${paleta.photo} alt="Paleta de ${paleta.flavor}" />
          
        </div>`
    );
  });
}

findAllPaletas();

async function findByIdPaletas() {
  const id = document.querySelector("#search-input").value;

  if(id == ""){
    localStorage.setItem('message', "Digite um ID!");
    localStorage.setItem('type', "danger");

    showMessageAlert()
    return;
  }

  const response = await fetch(`${baseURL}/one-paleta/${id}`);
  const paleta = await response.json();

  if(paleta.message != undefined){
    localStorage.setItem('message', paleta.message);
    localStorage.setItem('type', "danger");

    showMessageAlert()
    return;
  }

  document.querySelector(".list-all").style.display = "block";
  document.querySelector(".paleta-list").style.display = "none";
  const chosenPaletaDiv = document.querySelector("#chosen-paleta");

  chosenPaletaDiv.innerHTML = `<div class="paleta-card-item" id="paleta-list-item-${paleta._id}">
  <div>
    <div class="paleta-card-item-flavor">${paleta.flavor}</div>
    <div class="paleta-card-item-price">R$ ${paleta.price}</div>
    <div class="paleta-card-item-description">${paleta.description}</div>
    <div class="paleta-list-item-actions actions">
      <button class="actions-edit btn" onclick="showModal('${paleta._id}')">Editar</button>
      <button class="actions-delete btn" onclick="showModalDelete('${paleta._id}')">Apagar</button>
    </div>
</div>
  <img class="paleta-card-item-photo" src=${paleta.photo} alt="Paleta de ${paleta.flavor}" />
</div>`;
}

async function showModal(id = "") {
  if (id != "") {
    document.querySelector("#title-header-modal").innerText =
      "Atualizar uma paleta";
    document.querySelector("#button-form-modal").innerText = "Atualizar";

    const response = await fetch(`${baseURL}/one-paleta/${id}`);
    const paleta = await response.json();

    document.querySelector("#flavor").value = paleta.flavor;
    document.querySelector("#price").value = paleta.price;
    document.querySelector("#description").value = paleta.description;
    document.querySelector("#photo").value = paleta.photo;
    document.querySelector("#id").value = paleta._id;
  } else {
    document.querySelector("#title-header-modal").innerText =
      "Cadastrar uma paleta";
    document.querySelector("#button-form-modal").innerText = "Cadastrar";
  }
  document.querySelector("#overlay").style.display = "flex";
}

function closeModal() {
  document.querySelector(".modal-overlay").style.display = "none";
  document.querySelector("#flavor").value = "";
  document.querySelector("#price").value = 0;
  document.querySelector("#description").value = "";
  document.querySelector("#photo").value = "";
}

async function submitPaleta() {
  const id = document.querySelector("#id").value;
  const flavor = document.querySelector("#flavor").value;
  const price = document.querySelector("#price").value;
  const description = document.querySelector("#description").value;
  const photo = document.querySelector("#photo").value;

  const paleta = {
    id,
    flavor,
    price,
    description,
    photo,
  };

  const editionModeActivated = id != "";
  const endpoint = baseURL + (editionModeActivated ? `/update-paleta/${id}` : "/create-paleta");

  const response = await fetch(endpoint, {
    method: editionModeActivated ? "put" : "post",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
    body: JSON.stringify(paleta),
  });

  const novaPaleta = await response.json();

  if(novaPaleta.message != undefined){
    localStorage.setItem('message', novaPaleta.message);
    localStorage.setItem('type', "danger");
    showMessageAlert()
    return;
  }
 
  if (editionModeActivated) {
    localStorage.setItem('message', "Paleta atualizada com sucesso!");
    localStorage.setItem('type', "success");
  } else {
    localStorage.setItem('message', "Paleta criada com sucesso!");
    localStorage.setItem('type', "success");
  }
  document.location.reload(true);
  closeModal();
}

function showModalDelete(id) {
  document.querySelector("#overlay-delete").style.display = "flex";
  const btnSim = document.querySelector(".btn-delete-yes");
  btnSim.addEventListener("click", function () {
    deletePaleta(id);
  });
}

function closeModalDelete() {
  document.querySelector("#overlay-delete").style.display = "none";
}

async function deletePaleta(id) {
  const response = await fetch(`${baseURL}/delete-paleta/${id}`, {
    method: "delete",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
  });

  const result = await response.json();

  localStorage.setItem('message', result.message);
  localStorage.setItem('type', "success");

  document.location.reload(true);

  closeModalDelete();
  findAllPaletas();
}

function closeMessageAlert(){
  setTimeout(function(){
    msgAlert.innerText = "";
    msgAlert.classList.remove(localStorage.getItem("type"));
    localStorage.clear();
  }, 3000)
};

function showMessageAlert(){
  msgAlert.innerText = localStorage.getItem("message");
  msgAlert.classList.add(localStorage.getItem("type"));
  closeMessageAlert();
}

showMessageAlert();