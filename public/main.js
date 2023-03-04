console.log("hello world");

const addForm = document.querySelector("form");
const sidePanelDiv = document.getElementById("side-panel-div");
const purchasedBtn = document.getElementById("purchased");
const ul = document.getElementById("my-list");

const baseUrl = "http://localhost:4004";

let editItemID;

const getAll = () =>
  axios
    .get(`${baseUrl}/api/get-all`)
    .then((res) => createListElement(res.data));

const add = (body) =>
  axios
    .post(`${baseUrl}/api/add-item`, body)
    .then((res) => createListElement(res.data));

const edit = (body) =>
  axios
    .put(`${baseUrl}/api/edit`, body)
    .then((res) => createListElement(res.data));

const togglePurchased = (body) => axios.put(`${baseUrl}/api/purchased`, body);

const removeFromList = (id) =>
  axios
    .delete(`${baseUrl}/api/remove/${id}`)
    .then((res) => createListElement(res.data));

function goToPurchased() {
  window.location.href = "./purchased.html";
}

purchasedBtn.addEventListener("click", goToPurchased);

function addItem(e) {
  e.preventDefault();
  const description = document.getElementById("input-description");
  const url = document.getElementById("input-url");

  const body = {
    description: description.value,
    url: url.value,
    isPurchased: false,
  };
  description.value = "";
  url.value = "";
  add(body);
}

addForm.addEventListener("submit", addItem);

function displayList(data) {
  console.log(data);
}

function createListElement(data) {
  ul.innerHTML = "";

  for (i = 0; i < data.length; i++) {
    const { description, url, id } = data[i];
    const li = document.createElement("li");
    li.innerHTML = `
    <p id="p-${id}" onClick=displayPreviewURL('${url}')>${description}</p>
    <button id="go-${id}" onClick=goToURL('${url}')>Go</button>
    <button id="purchased-${id}" onClick=purchasedClicked(${id})>Purchased</button>
    <button id="${id}" class="pencil" onClick="displayEditForm(this.id)">
        <img src="./images/pencil.png" alt="buttonpng" border="0" />
      </button>
    <button id="del-${id}" onClick=displayDeleteMessage(${id})>X</>
  `;
    ul.appendChild(li);
  }
}

function goToURL(url) {
  window.open(url, "_blank");
}

function displayPreviewURL(url) {
  // Get the url preview img from e.srcElement.id (url from database)
  url = "https://m.media-amazon.com/images/I/71aqitDXH1L._AC_SX679_.jpg";
  sidePanelDiv.innerHTML = `<img src=${url} alt="" id="preview"></img>`;
  const url2 = new URL(
    "https://www.amazon.com/Turntable-Belt-Driven-Wireless-Headphone-Enjoyment/dp/B0BQJM66C2/?_encoding=UTF8&pd_rd_w=JzTZ0&content-id=amzn1.sym.bc5f3394-3b4c-4031-8ac0-18107ac75816&pf_rd_p=bc5f3394-3b4c-4031-8ac0-18107ac75816&pf_rd_r=792JWKV44NWK86Y1WPQN&pd_rd_wg=vF4bX&pd_rd_r=46126ed6-d2de-4cfe-a9a8-cdadf5747fb7&ref_=pd_gw_ci_mcx_mr_hp_atf_m"
  );
  console.log(url2);
}

function displayEditForm(id) {
  editItemID = id;
  sidePanelDiv.innerHTML = `
    <div id="edit-form">
    <form>
        <input type="text" id="edit-description" placeholder="Edit Description" />
        <input type="text" id="edit-url" placeholder="Edit URL here" />
        <button id="edit-btn">Edit</button>
      </form>
      
      </div>
    `;
  const editBtn = document.getElementById("edit-btn");
  editBtn.addEventListener("click", editItem);
}

function editItem(e) {
  // e.preventDefault()
  console.log("Hit editItem");
  const desc = document.getElementById("edit-description");
  const url = document.getElementById("edit-url");
  const body = {
    id: editItemID,
    description: desc.value,
    url: url.value,
  };

  edit(body);
}

function purchasedClicked(id) {
  console.log(id);
  const pElement = document.getElementById(`p-${id}`);
  const purchasedBtn = document.getElementById(`purchased-${id}`);
  const goBtn = document.getElementById(`go-${id}`);
  let isPurchased;

  if (pElement.classList.contains("crossed-out")) {
    // Item has already been marked as purchased
    pElement.classList.remove("crossed-out");
    purchasedBtn.textContent = "Purchased";
    goBtn.classList.remove("grayed-out");
    goBtn.disabled = false;
    isPurchased = false;
  } else {
    // Item is being marked as purchased
    pElement.classList.add("crossed-out");
    purchasedBtn.textContent = "Un-Mark";
    goBtn.classList.add("grayed-out");
    goBtn.disabled = true;
    isPurchased = true;
  }

  const body = {
    id: id,
    status: isPurchased,
  };
  console.log(body);
  togglePurchased(body);
}

function displayDeleteMessage(id) {
  const pElement = document.getElementById(`p-${id}`);

  sidePanelDiv.innerHTML = `
    <div id="del-alert">
    <h1>Delete This?</h1>
    <p>${pElement.textContent}</p>
    <div id="del-selection">
    <button id="del-btn" onClick="deleteItem(${id})">Delete</button>
    <button onClick="removeDeleteDisplay()">Cancel</button>
    </div>
      </div>
    `;
}

function deleteItem(itemID) {
  console.log(itemID);
  const body = {
    id: itemID,
  };
  removeFromList(itemID);
  removeDeleteDisplay()
}

function removeDeleteDisplay() {
  const delAlert = document.getElementById('del-alert')
  sidePanelDiv.removeChild(delAlert)
}

getAll();
