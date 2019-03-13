const express = require("express");
const app = express();

const bodyParser = require("body-parser")
const users = require("./routers/api/users")
const profiles = require("./routers/api/profiles")
const passport = require("passport")//验证jwt

//使用body-parser中间件
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
//初始化passport
app.use(passport.initialize());
require("./config/passport")(passport);

app.get("/",(req,res)=>{
    res.send("hello word")

})

//使用routers
app.use("/api/users",users)
app.use("/api/profiles",profiles)

const port = process.env.PORT || 5000;

app.listen(port,()=>{
    console.log(`server running on port ${port}`)
})
