
const app = require('express')();
const parser = require("body-parser");
const fs = require("fs");
const dir = __dirname;


app.use(parser.urlencoded({ extended: true }));
app.use(parser.json());


let customers = [];

function readData(){
    const filename = "data.json"; 
    const jsonContent = fs.readFileSync(filename, 'utf-8');
    customers = JSON.parse(jsonContent);
}

function saveData(){
    const filename = "data.json";
    const jsonData = JSON.stringify(customers);
    fs.writeFileSync(filename, jsonData, 'utf-8');
}
app.get("/customers", (req, res)=>{
    readData();
    res.send(JSON.stringify(customers));    
})

app.get("/customers/:id", (req, res)=>{
    const custid = req.params.id;
    if(customers.length == 0){
        readData();
    }
    let foundRec = customers.find((e) => e.custId == custid);
    if(foundRec == null)
        throw "Customer not found";
    res.send(JSON.stringify(foundRec))
})

app.put("/customers", (req, res)=>{
    if(customers.length == 0)
        readData();
    let body = req.body;
    for (let index = 0; index < customers.length; index++) {
        let element = customers[index];
        if (element.custId == body.custId) {
            element.custName = body.custName;
            element.custEmail = body.custEmail;
            element.custPhone = body.custPhone;
            element.custCity=body.custCity;
            saveData();
            res.send("Customer details updated successfully");
        }
    }
})

app.post('/customers', (req, res)=>{
    if (customers.length == 0)
        readData();
    let body = req.body;
    customers.push(body);  
    saveData();
    res.send("customer registered successfully");
})
app.delete('/customers/:id', (req, res)=>{
    const custid = req.params.id;
    if(customers.length == 0){
        readData();
    }
    let foundRec =customers.find((e) => e.custId == custid);
    if(foundRec == null)
        throw "customer not found";
    else{
    for (let index = 0; index < customers.length; index++) {
        let element = customers[index];
        if (element.custId == custid) {
            customers.splice(index, 1);
            saveData();
            res.send("customer deleted successfully from the database");
        }
    }
    }
})

app.listen(1234, ()=>{
    console.log("Server available at 1234");
})