const express = require("express");

const db = require("../data/dbConfig.js");

const router = express.Router();

//get all accounts
router.get('/', (req,res) =>{
    db.select("*")
    .from("accounts")
    .then(accounts => {
        res.status(200)
        .json({ data: accounts})
    })
    .catch(error => {
        console.log(error);
        res.status(500)
        .json({ message: error.message})
    });
});

//get account by ID
router.get('/:id', (req,res) => {
    db("accounts")
    .where({ id: req.params.id})
    .first()
    .then(account => {
        if(account){
            res.status(200)
            .json({ data: account})
        } else {
            res.status(404)
            .json({ message: "No accounts by that ID"})
        }
    })
})

//post a new account
router.post('/', (req,res) => {
    const account = req.body;

    if(isValidAccount(account)){
        db("accounts")
        .insert(account, "id")
        .then(ids => {
            res.status(201)
            .json({ data:ids})
        })
        .catch(error => {
            console.log(error);
            res.status(500)
            .json({ message: error.message })
        })
    } else {
        res.status(500)
        .json({ message: "Please provide an account name and budget"})
    }
})

//edit an existing account
router.put('/:id', (req,res) => {
    const updates = req.body;

    db("accounts")
    .where({id: req.params.id})
    .update(updates)
    .then(count => {
        if(count > 0){
            res.status(200)
            .json({ data: count })
        } else {
            res.status(400)
            .json({ message: "No account by that ID"})
        }
    })
    .catch(error => {
        console.log(error);
        res.status(500)
        .json({ message: error.message})
    })
})

//delete an existing account
router.delete('/:id', (req, res)=> {
    db("accounts")
    .where({ id: req.params.id })
    .del()
    .then(count => {
        if( count > 0){
            res.status(200)
            .json({ data: count })
        } else{
            res.status(404)
            .json({ message: "No account found by that Id"})
        }
    })
    .catch(error => {
        console.log(error);
        res.status(500)
        .json({ message: error.message})
    })
})

//middleware
function isValidAccount(account){
    return Boolean(account.name && account.budget);
}

module.exports = router;