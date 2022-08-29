var express = require('express')
const { ObjectId } = require('mongodb')
var app = express()
var hbs = require('hbs')
var MongoClient = require('mongodb').MongoClient
var url = "mongodb+srv://hien0704:123@cluster0.v9cbcbg.mongodb.net/test"

app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

app.get('/edit',async (req,res)=>{
    let id = req.query.id
    let objectId = ObjectId(id)
    let client= await MongoClient.connect(url);
    let dbo = client.db("ProductDB");
    let prod = await dbo.collection("shopeeProduct").findOne({_id:objectId})
    console.log(prod)
    res.render('edit',{'prod':prod})
})



app.post('/update', async (req, res) => {
    let id = req.body.id
    let objectId = ObjectId(id)
    let name = req.body.txtName
    let price = Number(req.body.txtPrice) 
    let picture = req.body.txtPic
    let product = {
        'name': name,
        'price': price,
        'picture': picture
    }
    let client= await MongoClient.connect(url);
    let dbo = client.db("ProductDB");
    await dbo.collection("shopeeProduct").updateOne({_id:objectId},{$set : product})
    res.redirect('/')
})



app.get('/delete', async (req, res) => {
    let id = req.query.id
    console.log(id)
    let objectId = ObjectId(id)
    let client = await MongoClient.connect(url);
    let dbo = client.db("ProductDB")
    let prods = await dbo.collection("shopeeProduct").deleteOne({ _id: objectId })

    res.redirect('/view')
})


app.get('/view', async (req, res) => {
    let client = await MongoClient.connect(url);
    let dbo = client.db("ProductDB")
    let prods = await dbo.collection("shopeeProduct").find().toArray()
    console.log(prods)
    res.render('viewProduct', { 'prods': prods })
})

app.post('/insertProduct', async (req, res) => {
    let name = req.body.txtName
    let price = Number(req.body.txtPrice)
    let picURL = req.body.txtPic
    if (name === "" || price === "") {
        var check = "Empty"
        res.render('newProduct', { check: check })
    }
    else {
        let product = {
            'name': name,
            'price': price,
            'picture': picURL,
        }
        let client = await MongoClient.connect(url);
        let dbo = client.db("ProductDB")
        await dbo.collection("shopeeProduct").insertOne(product)
        res.redirect('/')
    }
})

app.get('/new', (req, res) => {
    res.render('newProduct')
})


app.get('/', async (req, res) => {
    let client = await MongoClient.connect(url);
    let dbo = client.db("ProductDB")
    let prods = await dbo.collection("shopeeProduct").find().toArray()
    console.log(prods)
    res.render('home', { 'prods': prods })
})

const PORT = process.env.PORT || 5000
app.listen(PORT)
console.log('Server is running')