
const backBtn = document.getElementById("back-btn");
backBtn.addEventListener("click", () =>
  window.location.assign("./purchased.html")
);
const ul = document.getElementById("purchased-list");
const sidePanelDiv = document.getElementById("collapsed-side");

const baseUrl = "http://localhost:4004";

const getAllDeleted = () =>
  axios.get(`${baseUrl}/api/get-all-deleted`).then((res) => {
    createListElement(res.data);
  });

const removeFromList = (id) =>
  axios.delete(`${baseUrl}/api/delete/${id}`).then(getAllDeleted);

const togglePurchased = (body) =>
  axios.put(`${baseUrl}/api/purchased`, body).then(getAllDeleted);

function createListElement(data) {
  console.log("reset list");
  ul.innerHTML = "";

  for (i = 0; i < data.length; i++) {
    const { description, url, id } = data[i];
    const li = document.createElement("li");
    li.innerHTML = `
        <p id="p-${id}" onClick=displayPreviewURL('${url}')>${description}</p>
        <button id="re-add${id}" class="image-btn" onClick="reAddClicked(${id})">
          <img src="./images/uncheck.png" alt="uncheckmarkpng" border="0" />
      </button>
        <button id="del-${id}" class="image-btn" onClick=displayDeleteMessage(${id})>
          <img src="./images/deleteX.png" alt="Xbuttonpng" border="0" />
      </button>
      `;
    ul.appendChild(li);
  }
}

function reAddClicked(id) {
  axios.get(`${baseUrl}/api/get-single-deleted/${id}`).then((res) => {
    const { id, description, url } = res.data[0];
    const body = {
      id: id,
      description: description,
      url: url,
      status: false,
      table: "recent_delete",
    };

    togglePurchased(body);
  });
}

function displayDeleteMessage(id) {
  const pElement = document.getElementById(`p-${id}`);
  sidePanelDiv.id = "side-panel-div"
  sidePanelDiv.innerHTML = `
    <div id="del-message" class="prompt">
    <h1>Delete This?</h1>
    <p class="del-item">This will permanently delete this item!</p>
    <p class="del-item">${pElement.textContent}</p>
    <div class="btn-selection">
    <button id="del-btn" onClick="deleteItem(${id})">Delete</button>
    <button onClick="removeDeleteDisplay()">Cancel</button>
    </div>
      </div>
    `;
}

function deleteItem(itemID) {
  console.log(itemID);
  removeFromList(itemID);
  removeDeleteDisplay();
}

function removeDeleteDisplay() {
  const prompt = document.getElementById("del-message");
  sidePanelDiv.removeChild(prompt);
  sidePanelDiv.id = "collapsed-side"
}

getAllDeleted();
