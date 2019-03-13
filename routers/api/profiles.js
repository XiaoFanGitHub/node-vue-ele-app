/**
 * Created by nonde_xx on 2019-03-06.
 */
const express = require("express");
const router = express.Router();
const db = require("./../../config/DbUtil.js");
const passport = require("passport");
const moment = require("moment")
/**
 * CRUD  Api
 */
router.get("/test",(req,res)=>{
    res.json({msg:"profile works"})
})
//新增接口
router.post("/add",passport.authenticate("jwt",{session:false}),(req,res)=>{
    const profile={};
    if(req.body.type)profile.type = req.body.type;
    if(req.body.descs)profile.descs = req.body.descs;
    if(req.body.incode)profile.incode = req.body.incode;
    if(req.body.expend)profile.expend = req.body.expend;
    if(req.body.cash)profile.cash = req.body.cash;
    if(req.body.remark)profile.remark = req.body.remark;
    profile.date = moment(new Date()).format("YYYY-MM-DD");
    db.insertData("profile",profile,(e,r)=>{
        if(e){
            console.log(e)
            res.status(500).json("新增失败")
        }else{
            res.status(200).json({msg:r})
        }
    })
})

//获取全部结果集
router.get("/all",passport.authenticate("jwt",{session:false}),(req,res)=>{
    //const id = req.param("id")[0]
    if(req.param("id") && req.param("id")[0] !== ""){
        db.selectAll("select * from profile where id = " + id,(e,r)=>{
          return  res.status(200).json(r)
        })
    }else {
        db.selectAll("select * from profile", (e, r) => {
            res.status(200).json(r)
        })
    }
})




module.exports = router;
