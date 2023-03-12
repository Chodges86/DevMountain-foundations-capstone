
const addForm = document.querySelector("form");
const sidePanelDiv = document.getElementById("side-panel-div");
const purchasedBtn = document.getElementById("purchased-btn");
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

const removeFromList = (id, is_purchased) =>
  axios
    .delete(`${baseUrl}/api/remove/${id}/${is_purchased}`)
    .then((res) => createListElement(res.data));

const addToDeletedTable = (body) =>
  axios.post(`${baseUrl}/api/add-deleted`, body).then(() => {
    const { id, is_purchased } = body
    removeFromList(id, is_purchased);
    removeDeleteDisplay();
  });

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

function goToURL(id) {
  axios
  .get(`${baseUrl}/api/get-single-item/${id}`)
  .then(res => {
    const { url } = res.data[0]
    console.log(url)
    window.open(url, "_blank");
  })
  
}

function displayPreview(id) {
  // Get the url preview img from e.srcElement.id (url from database) 
  sidePanelDiv.innerHTML = "" 
  const loading = document.createElement('img')
  loading.id = 'loading'
  loading.src = "./images/loading.gif"
  sidePanelDiv.appendChild(loading)

  axios
  .get(`${baseUrl}/api/preview-image/${id}`).then(res => {
    const img = document.createElement('div')
    let text;
    const { title, imageURL } = res.data
    if (res.data != "") {
      img.id = "img-div"
      const pic = document.createElement('img')
      text = document.createElement('p')
      text.id = "url-title"
      text.textContent = title
      pic.src = imageURL
      pic.id = 'preview'
      img.appendChild(pic)
    } else {
      text = document.createElement('p')
      img.id = "error-div"
      const message = document.createElement('h1')
      message.textContent = "Could not load image"
      img.appendChild(message)
    }
    
    sidePanelDiv.innerHTML = ""
    sidePanelDiv.appendChild(img)
    sidePanelDiv.appendChild(text)
  })
}

function createListElement(data) {
  ul.innerHTML = "";

  for (i = 0; i < data.length; i++) {
    const { description, url, id } = data[i];
    const li = document.createElement("li");
    li.id = `li-${id}`;
    li.innerHTML = `
    <p id="p-${id}" onClick=displayPreview('${id}')>${description}</p>
    <button id="go-${id}" class="image-btn" onClick=goToURL('${id}')>
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
  console.log(id);
  const pElement = document.getElementById(`p-${id}`);
  const purchasedBtn = document.getElementById(`purchased-${id}`);
  const goBtn = document.getElementById(`go-${id}`);
  const li = document.getElementById(`li-${id}`);
  let isPurchased;

  if (pElement.classList.contains("crossed-out")) {
    pElement.classList.remove("crossed-out");
    purchasedBtn.innerHTML = '<img src = "./images/check.png" />';
    goBtn.disabled = false;
    isPurchased = false;
  } else {
    pElement.classList.add("crossed-out");
    purchasedBtn.innerHTML = '<img src = "./images/uncheck.png" />';
    goBtn.disabled = true;
    isPurchased = true;
  }

  axios.get(`${baseUrl}/api/get-single-item/${id}`)
  .then(res => {
    const { id, description, url } = res.data[0]
    const body = {
      id: id,
      description: description,
      url: url,
      status: isPurchased,
      table: "current_list"
    };
  
    togglePurchased(body);
  })

  
}

function displayDeleteMessage(id) {
  const pElement = document.getElementById(`p-${id}`);

  sidePanelDiv.innerHTML = `
    <div id="del-message" class="prompt">
    <h1>Delete This?</h1>
    <p class="del-item">${pElement.textContent}</p>
    <div class="btn-selection">
    <button id="del-btn" onClick="deleteItem(${id})">Delete</button>
    <button onClick="removeDeleteDisplay()">Cancel</button>
    </div>
      </div>
    `;
}

function deleteItem(itemID) {
  axios.get(`${baseUrl}/api/get-single-item/${itemID}`).then((res) => {
    const { id, description, url, is_purchased } = res.data[0];
    const body = {
      id,
      description,
      url,
      is_purchased,
    };
    addToDeletedTable(body);
  });
}

function removeDeleteDisplay() {
  const prompt = document.getElementById("del-message");
  sidePanelDiv.removeChild(prompt);
  const welcomeDiv = document.createElement("div");
  welcomeDiv.id = "welcome";
  welcomeDiv.innerHTML = `
  <h1>Welcome to Get This!</h1>
        <p>Get started adding things you find online.  Simply copy and paste the URL from the website and add a description.</p>
  `;
  sidePanelDiv.appendChild(welcomeDiv);
}

getAll();
