/**
 * Created by nonde_xx on 2019-03-07.
 * 验证token 解析token
 */
const  JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'secret';
const db = require("./DbUtil.js");
module.exports = passport =>{
    passport.use(new JwtStrategy(opts, (jwt_payload, done)=> {
        var sql = "select user_id,name,identity from user where user_id = " + jwt_payload.id;
        db.selectAll(sql,(e,r)=>{
            if(r[0]){
                return done(null,r[0]);
            }
            return done(null,false);
        });
    }));
}
