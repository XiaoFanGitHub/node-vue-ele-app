/**
 * Created by nonde_xx on 2019-03-06.
 */
const express = require("express");
const router = express.Router();
const db = require("./../../config/DbUtil.js");
const bcrypt = require("bcrypt")//加密工具
const gravatar = require('gravatar');//公认头像
const jwt = require("jsonwebtoken")
const passport = require("passport")
//$route GET api/users/test
//@desc 返回请求的json数据
router.get("/test",(req,res)=>{
    res.json({msg:"login works"})
})
//注册
var sql = "select * from user where email = '";

router.post("/register",(req,res)=>{
    //查询数据库中是否被注册邮箱
    db.selectAll(sql+""+req.body.email+"'",(e,result)=>{
        console.log(result[0])
        if(result[0]){
            return res.status(400).json("邮箱已被注册")
        }else{
            const ravater = gravatar.url(req.body.email, {s: '200', r: 'pg', d: 'mm'});
            const user = {
                name:req.body.name,
                email:req.body.email,
                ravater,
                password:req.body.password,
                identity:req.body.identity
            }

            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(user.password, salt, function(err, hash) {
                    if(err)throw  err;
                    user.password = hash;
                    db.insertData('user',user,(e,r)=>{
                        if(e){
                            res.status(400).json({"status":false,"msg":e,"data":[]});
                        }
                        res.status(200).json({"status":true,"msg":r});
                    });

                });
            });
        }
    })
})
//登录 返回token使用jwt
router.post("/login",(req,res)=>{
    const email = req.body.email;
    const password = req.body.password;
    db.selectAll(sql+""+req.body.email+"'",(e,r)=>{
        if(!r[0].password){
            return res.status(404).json("用户不存在");
        }

        bcrypt.compare(password, r[0].password)
            .then(isMatch=>{
                if(isMatch){
                    console.log(r[0])
                    const rule = {
                        id:r[0].user_id,
                        name:r[0].name,
                        identity:r[0].identity
                    };
                    //jwt.sign("规则","加密名字","过期时间","箭头函数")
                    jwt.sign(rule,"secret",{expiresIn:3600},(err,token)=>{
                        res.json({
                            success:true,
                            token:"Bearer " + token
                        })
                    })
                    // res.json({msg:"SUCCESS"});
                }else{
                   return res.status(400).json("密码错误")
                }
            })

    })
})
//使用passport-jwt验证token
router.get("/current",passport.authenticate("jwt",{session:false}),(req,res)=>{
    res.json({
        id:req.user.user_id,
        name:req.user.name,
        identity:req.user.identity
    })
})

module.exports = router;
