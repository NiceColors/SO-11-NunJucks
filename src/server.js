const express = require('express');
const app = express();

const db = require('./database/db')



app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }))

const nunjucks = require("nunjucks")

nunjucks.configure("src/views", {
    express: app,
    noCache: true
})




app.get("/", (req, res) => {
    return res.render("index.html", { title: "Um titulo aí"})
})

app.get("/create-point", (req, res) => {

    return res.render("create-point.html")

})

app.post("/savepoint", (req, res) => {
            const query = `
            INSERT INTO places (
                image,
                name,
                address,
                address2,
                state,
                city,
                items
            ) VALUES (?,?,?,?,?,?,?)
        `
        const values = [
            req.body.image,
            req.body.name,
            req.body.address,
            req.body.address2,
            req.body.state,
            req.body.city,
            req.body.items
        ]

        function afterInsertData(err){
            if (err){
                console.log(err)
                return res.send("Erro no cadastro")
            }

            console.log("cadastrado com sucesso")
            console.log(this);

            return res.render("create-point.html", { saved: true })
        }
        db.run(query, values, afterInsertData)
})

app.get("/search", (req, res) => {

    const search = req.query.search

    if(search == ""){
        return res.render("search.html", {tota: 0})
    }


    db.all(`SELECT * FROM places WHERE state LIKE "%${search}%"`, function(err, rows){
        if (err){
            return console.log(err)
        }

        const total = rows.length

        return res.render("search.html", { places: rows, total})
    })

})

app.listen(3333,
     ()=>{
         return console.log('Rodando')
})