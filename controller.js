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

async function addItem(req, res) {
    const { description, url } = req.body
    const [result] =  await sequelize.query(
        `INSERT INTO current_list (description, url)
        VALUES ('${description}', '${url}') RETURNING *;`
    )
    res.status(200).send(result)
}

function getAll(req, res) {

    console.log("Hit getAll")

    sequelize
    .query(
        'SELECT * FROM current_list;'
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
    
            SELECT * FROM current_list;
            `
        )
        .then((dbRes) => res.status(200).send(dbRes[0])) 
    } else if (url === "") {
        sequelize.query(
            `UPDATE current_list
            SET description = '${description}'
            WHERE id = ${id};
    
            SELECT * FROM current_list;
            `
        )
        .then((dbRes) => res.status(200).send(dbRes[0])) 
    } else {
        sequelize.query(
            `UPDATE current_list
            SET description = '${description}',
            url = '${url}'
            WHERE id = ${id};
    
            SELECT * FROM current_list;
            `
        )
        .then((dbRes) => res.status(200).send(dbRes[0])) 
    }

    
    
}
    

module.exports = {
    addItem,
    getAll,
    editItem
}