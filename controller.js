require('dotenv').config()
const { CONNECTION_STRING } = process.env;

const Sequelize = require('sequelize')

const sequelize = new Sequelize(CONNECTION_STRING, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false
        }
    }
})

function addItem(req, res) {
    const { description, url, is_purchased } = req.body
    console.log(req.body)
    sequelize.query(
        `INSERT INTO current_list (description, url, is_purchased)
        VALUES ('${description}', '${url}', ${is_purchased});
        SELECT * FROM current_list
        WHERE is_purchased = false;`
    )
    .then((dbRes) => res.status(200).send(dbRes[0]))
}

function getAll(req, res) {

    const isPurchased = req.params.is_purchased
    sequelize
    .query(
        `SELECT * FROM current_list
        WHERE is_purchased = ${isPurchased};`
    )
    .then((dbRes) => res.status(200).send(dbRes[0]))
}

function editItem(req, res) {
    console.log("Hit Edit")
    const { id, description, url } = req.body

    if (description === "") {
        sequelize.query(
            `UPDATE current_list
            SET url = '${url}'
            WHERE id = ${id};
    
            SELECT * FROM current_list
            WHERE is_purchased = false;
            `
        )
        .then((dbRes) => res.status(200).send(dbRes[0])) 
    } else if (url === "") {
        sequelize.query(
            `UPDATE current_list
            SET description = '${description}'
            WHERE id = ${id};
    
            SELECT * FROM current_list
            WHERE is_purchased = false;
            `
        )
        .then((dbRes) => res.status(200).send(dbRes[0])) 
    } else {
        sequelize.query(
            `UPDATE current_list
            SET description = '${description}',
            url = '${url}'
            WHERE id = ${id};
    
            SELECT * FROM current_list
            WHERE is_purchased = false;
            `
        )
        .then((dbRes) => res.status(200).send(dbRes[0])) 
    }
}

function togglePurchased(req, res) {
    const { id, status } = req.body
    console.log(id)
    sequelize.query(
        `UPDATE current_list
        SET is_purchased = ${status}
        WHERE id = ${id};
        `
    )
    .then(() => res.sendStatus(200))
}

function removeFromList(req, res) {
    const id = req.params.id
    console.log(id)
    sequelize.query(
        `DELETE
        FROM current_list
        WHERE id= ${id};
        
        SELECT * FROM current_list
        WHERE is_purchased = false;`
    )
    .then((dbRes) => res.status(200).send(dbRes[0]))
}
    

module.exports = {
    addItem,
    getAll,
    editItem,
    togglePurchased,
    removeFromList
}