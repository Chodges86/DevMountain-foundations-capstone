
const backBtn = document.getElementById("back-btn");
backBtn.addEventListener("click", () => window.location.assign("./index.html"));
const recentDltBtn = document.getElementById("recent-dlt-btn")
recentDltBtn.addEventListener("click", () => window.location.assign("./recent-delete.html"))
const ul = document.getElementById("purchased-list");
const sidePanelDiv = document.getElementById('collapsed-side')

const baseUrl = "http://localhost:4004";

const getAll = () => {
  axios
    .get(`${baseUrl}/api/get-all/${true}`)
    .then((res) => createListElement(res.data));
};

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

const togglePurchased = (body) =>
  axios.put(`${baseUrl}/api/purchased`, body).then(getAll);

function createListElement(data) {
  ul.innerHTML = "";

  for (i = 0; i < data.length; i++) {
    const { description, url, id } = data[i];
    const li = document.createElement("li");
    li.innerHTML = `
      <p id="p-${id}">${description}</p>
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
    table: "current_list"
  };

  togglePurchased(body);
}

function displayDeleteMessage(id) {
    const pElement = document.getElementById(`p-${id}`);
    sidePanelDiv.id="side-panel-div"
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
    const prompt = document.getElementById('del-message')
    sidePanelDiv.removeChild(prompt)
    sidePanelDiv.id = "collapsed-side"
  }

getAll();
