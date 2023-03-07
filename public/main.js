console.log("hello world");

const addForm = document.querySelector("form");
const sidePanelDiv = document.getElementById("side-panel-div");
const purchasedBtn = document.getElementById("purchased");
const ul = document.getElementById("my-list");

const baseUrl = "http://localhost:4004";

let editItemID;

const getAll = () =>
  axios
    .get(`${baseUrl}/api/get-all/${false}`)
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
    is_purchased: false,
  };
  description.value = "";
  url.value = "";
  add(body);
}

addForm.addEventListener("submit", addItem);

function goToURL(url) {
  console.log(url);
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

function displayList(data) {
  console.log(data);
}

function createListElement(data) {
  ul.innerHTML = "";

  for (i = 0; i < data.length; i++) {
    const { description, url, id } = data[i];
    selectedItemURL = url
    selectedDescription = description
    const li = document.createElement("li");
    li.id = `li-${id}`
    li.innerHTML = `
    <p id="p-${id}" onClick=displayPreviewURL('${url}')>${description}</p>
    <button id="go-${id}" class="image-btn" onClick=goToURL('${url}')>
        <img src="./images/arrow.png" alt="go-arrow" border="0" />
    </button>
    <button id="purchased-${id}" class="image-btn" onClick="purchasedClicked(${id})">
        <img src="./images/check.png" alt="checkmarkpng" border="0" />
    </button>
    <button id="${id}" class="image-btn" onClick="displayEditForm(this.id)">
        <img src="./images/pencil.png" alt="buttonpng" border="0" />
      </button>
    <button id="del-${id}" class="image-btn" onClick=displayDeleteMessage(${id})>
        <img src="./images/deleteX.png" alt="buttonpng" border="0" />
    </button>
  `;
    ul.appendChild(li);
  }
}

function displayEditForm(id) {
  editItemID = id;
  sidePanelDiv.innerHTML = `
    <div id="edit-form" class="prompt">
    <h1>Edit</h1>
    <form>
        <input type="text" id="edit-description" placeholder="Edit Description" />
        <input type="text" id="edit-url" placeholder="Edit URL here" />
        <div class="btn-selection">
        <button id="edit-btn">Edit</button>
        <button>Cancel</button>
        </div>
      </form>
      </div>
    `;
  const editBtn = document.getElementById("edit-btn");
  editBtn.addEventListener("click", editItem);
}

function editItem(e) {
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
  console.log(id)
  const pElement = document.getElementById(`p-${id}`);
  const purchasedBtn = document.getElementById(`purchased-${id}`);
  const goBtn = document.getElementById(`go-${id}`);
  const li = document.getElementById(`li-${id}`)
  let isPurchased;

  if (pElement.classList.contains("crossed-out")) {
    pElement.classList.remove("crossed-out")
    purchasedBtn.innerHTML = '<img src = "./images/check.png" />'
    goBtn.disabled = false
    isPurchased = false
  } else {
    pElement.classList.add("crossed-out")
    purchasedBtn.innerHTML = '<img src = "./images/uncheck.png" />'
    goBtn.disabled = true
    isPurchased = true
  }

  const body = {
    id: id,
    status: isPurchased,
  };

  togglePurchased(body);
}

function displayDeleteMessage(id) {
  const pElement = document.getElementById(`p-${id}`);

  sidePanelDiv.innerHTML = `
    <div id="del-message" class="prompt">
    <h1>Delete This?</h1>
    <p>${pElement.textContent}</p>
    <div class="btn-selection">
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
  removeDeleteDisplay();
}

function removeDeleteDisplay() {
  const prompt = document.getElementById("del-message");
  sidePanelDiv.removeChild(prompt);
  const welcomeDiv = document.createElement('div')
  welcomeDiv.id = 'welcome'
  welcomeDiv.innerHTML = `
  <h1>Welcome to Get This!</h1>
        <p>Get started adding things you find online.  Simply copy and paste the URL from the website and add a description.</p>
  `
  sidePanelDiv.appendChild(welcomeDiv)
}

getAll();
