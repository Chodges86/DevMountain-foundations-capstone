console.log("hello world");

const addForm = document.querySelector("form");
const sidePanelDiv = document.getElementById("side-panel-div");
const purchasedBtn = document.getElementById("purchased");

const baseUrl = "http://localhost:4004";

let editItemID;

const getAll = () =>
  axios.get(`${baseUrl}/api/get-all`).then((res) => createListElement(res.data));

const add = (body) =>
  axios
    .post(`${baseUrl}/api/add-item`, body)
    .then((res) => createListElement(res.data));

const edit = (body) => axios.put(`${baseUrl}/api/edit`, body).then((res) => createListElement(res.data))

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
  };
  description.value = "";
  url.value = "";
  add(body);
}

addForm.addEventListener("submit", addItem);

function displayList(data) {

    console.log(data)

}

function createListElement(data) {
    
  const ul = document.getElementById("my-list");

  ul.innerHTML = ""

  for (i = 0; i < data.length; i++) {
    const { description, url, id } = data[i];
    const li = document.createElement("li");
    li.innerHTML = `
    <p onClick=displayPreviewURL('${url}')>${description}</p>
    <button onClick=goToURL('${url}')>Go</button>
    <button>Purchased</button>
    <button id="${id}" class="pencil" onClick="displayEditForm(this.id)">
        <img src="./images/pencil.png" alt="buttonpng" border="0" />
      </button>
  `;
    ul.appendChild(li);
  }
}

function goToURL(url) {
  window.open(url, "_blank");
}

function displayPreviewURL(url) {
   
  //TODO: Get the url preview img from e.srcElement.id (url from database)
  url = "https://m.media-amazon.com/images/I/71aqitDXH1L._AC_SX679_.jpg";
  sidePanelDiv.innerHTML = `<img src=${url} alt="" id="preview"></img>`;
  const url2 = new URL(
    "https://www.amazon.com/Turntable-Belt-Driven-Wireless-Headphone-Enjoyment/dp/B0BQJM66C2/?_encoding=UTF8&pd_rd_w=JzTZ0&content-id=amzn1.sym.bc5f3394-3b4c-4031-8ac0-18107ac75816&pf_rd_p=bc5f3394-3b4c-4031-8ac0-18107ac75816&pf_rd_r=792JWKV44NWK86Y1WPQN&pd_rd_wg=vF4bX&pd_rd_r=46126ed6-d2de-4cfe-a9a8-cdadf5747fb7&ref_=pd_gw_ci_mcx_mr_hp_atf_m"
  );
  console.log(url2);
}

function displayEditForm(id) {
    editItemID = id
    sidePanelDiv.innerHTML = `
    <div id="edit-form">
    <form>
        <input type="text" id="edit-description" placeholder="Edit Description" />
        <input type="text" id="edit-url" placeholder="Edit URL here" />
        <button id="edit-btn">Edit</button>
      </form>
      
      </div>
    `
    const editBtn = document.getElementById('edit-btn')
    editBtn.addEventListener('click', editItem)
}

function editItem(e) {
    // e.preventDefault()
    console.log("Hit editItem")
    const desc = document.getElementById('edit-description')
    const url = document.getElementById('edit-url')
    const body = {
        id: editItemID,
        description: desc.value,
        url: url.value
    }

    edit(body)
}
 
getAll();
