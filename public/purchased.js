console.log("hello world from purchased page");

const backBtn = document.getElementById("back-btn");
backBtn.addEventListener("click", () => window.location.assign("./index.html"));
const ul = document.getElementById("purchased-list");
const sidePanelDiv = document.getElementById('side-panel-div')

const baseUrl = "http://localhost:4004";

const getAll = () => {
  axios
    .get(`${baseUrl}/api/get-all/${true}`)
    .then((res) => createListElement(res.data));
};

const removeFromList = (id) =>
  axios
    .delete(`${baseUrl}/api/remove/${id}`)
    .then(getAll);

const togglePurchased = (body) =>
  axios.put(`${baseUrl}/api/purchased`, body).then(getAll);

function createListElement(data) {
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
  const body = {
    id: id,
    status: false,
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
    removeDeleteDisplay()
  }

  function removeDeleteDisplay() {
    const prompt = document.getElementById('del-message')
    sidePanelDiv.removeChild(prompt)
  }

getAll();
