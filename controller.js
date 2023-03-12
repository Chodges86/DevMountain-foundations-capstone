require("dotenv").config();
const { unfurl } = require("unfurl.js");
const { CONNECTION_STRING } = process.env;

const Sequelize = require("sequelize");

const sequelize = new Sequelize(CONNECTION_STRING, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
});

function getAll(req, res) {
  const isPurchased = req.params.is_purchased;
  sequelize
    .query(
      `SELECT * FROM current_list
        WHERE is_purchased = ${isPurchased};`
    )
    .then((dbRes) => res.status(200).send(dbRes[0]));
}

function getItem(req, res) {
  const id = req.params.id;
  console.log(id);
  sequelize
    .query(
      `SELECT * FROM current_list
        WHERE id = ${id}
        `
    )
    .then((dbRes) => res.status(200).send(dbRes[0]));
}

function getDeletedItem(req, res) {
  const id = req.params.id;
  sequelize
    .query(
      `SELECT * FROM recent_delete
        WHERE id = ${id}`
    )
    .then((dbRes) => res.status(200).send(dbRes[0]));
}

function addItem(req, res) {
  const { description, url, is_purchased } = req.body;
  console.log(req.body);
  sequelize
    .query(
      `INSERT INTO current_list (description, url, is_purchased)
        VALUES ('${description}', '${url}', ${is_purchased});
        SELECT * FROM current_list
        WHERE is_purchased = false;`
    )
    .then((dbRes) => res.status(200).send(dbRes[0]));
}

function editItem(req, res) {
  console.log("Hit Edit");
  const { id, description, url } = req.body;

  if (description === "") {
    sequelize
      .query(
        `UPDATE current_list
            SET url = '${url}'
            WHERE id = ${id};
    
            SELECT * FROM current_list
            WHERE is_purchased = false;
            `
      )
      .then((dbRes) => res.status(200).send(dbRes[0]));
  } else if (url === "") {
    sequelize
      .query(
        `UPDATE current_list
            SET description = '${description}'
            WHERE id = ${id};
    
            SELECT * FROM current_list
            WHERE is_purchased = false;
            `
      )
      .then((dbRes) => res.status(200).send(dbRes[0]));
  } else {
    sequelize
      .query(
        `UPDATE current_list
            SET description = '${description}',
            url = '${url}'
            WHERE id = ${id};
    
            SELECT * FROM current_list
            WHERE is_purchased = false;
            `
      )
      .then((dbRes) => res.status(200).send(dbRes[0]));
  }
}

function togglePurchased(req, res) {
  const { id, description, url, status, table } = req.body;
  console.log(id);
  console.log(description);
  console.log(url);
  console.log(status);
  console.log(table);

  if (table === "current_list") {
    sequelize
      .query(
        `UPDATE current_list
        SET is_purchased = ${status}
        WHERE id = ${id};
        `
      )
      .then(() => res.sendStatus(200));
  } else if (table === "recent_delete") {
    sequelize
      .query(
        `UPDATE recent_delete
        SET is_purchased = ${status}
        WHERE id = ${id};
        INSERT INTO current_list (description, url, is_purchased)
        VALUES ('${description}', '${url}', ${status});
        DELETE
        FROM recent_delete
        WHERE id = ${id};`
      )
      .then(() => res.sendStatus(200));
  }
}

function addToDeletedTable(req, res) {
  const { id, description, url, is_purchased } = req.body;
  sequelize
    .query(
      `INSERT INTO recent_delete (id, description, url, is_purchased)
        VALUES (${id}, '${description}', '${url}', ${is_purchased});`
    )
    .then(res.sendStatus(200));
}

function removeFromList(req, res) {
  const { id, is_purchased } = req.params;

  sequelize
    .query(
      `DELETE
        FROM current_list
        WHERE id= ${id};
        
        SELECT * FROM current_list
        WHERE is_purchased = ${is_purchased};`
    )
    .then((dbRes) => res.status(200).send(dbRes[0]));
}

function getAllDeleted(req, res) {
  sequelize
    .query(`SELECT * FROM recent_delete`)
    .then((dbRes) => res.status(200).send(dbRes[0]));
}

function deleteForever(req, res) {
  const id = req.params.id;
  sequelize
    .query(
      `DELETE 
        FROM recent_delete
        WHERE id = ${id};
        SELECT * FROM recent_delete`
    )
    .then((dbRes) => res.status(200).send(dbRes[0]));
}

function getPreviewImage(req, res) {
  const id = req.params.id;
  console.log(id);
  sequelize
    .query(
      `
  SELECT url FROM current_list
  WHERE id = ${id}
  `
    )
    .then((dbRes) => {
      const { url } = dbRes[0][0];
      console.log(url);
      (async () => {
        const result = await unfurl(url, { oembed: true });
        if ("open_graph" in result) {
          console.log(result.open_graph)
          if ("images" in result.open_graph) {
            const imageURL = result.open_graph.images[0].url;
            const title = result.open_graph.title
            const body = {
              title: title,
              imageURL: imageURL
            }
            res.status(200).send(body);
          } else {
            res.status(204).send("")
          }
        } else {
          res.status(204).send("");
        }
      })();
    });
}

module.exports = {
  addItem,
  getAll,
  getItem,
  editItem,
  togglePurchased,
  addToDeletedTable,
  removeFromList,
  getAllDeleted,
  deleteForever,
  getDeletedItem,
  getPreviewImage,
};
