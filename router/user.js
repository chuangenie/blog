const express = require('express')
const router = express.Router()
const mysql = require('mysql')
const moment = require('moment')

const conn = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'my_blog'
})

router.get('/register', (req, res) => {
    res.render('./user/register.ejs', {})
})

router.get('/login', (req, res) => {
    res.render('./user/login.ejs', {})
})

router.post('/register', (req, res) => {
    const user = req.body
    if (user.username.trim().length === 0 ||
    user.password.trim().length === 0 ||
    user.nickname.trim().length === 0) return res.status(400).send({ status: 400, msg: '请填写完整的表单信息!' });
    const querySql = 'select count(*) as count from users where username = ?'
    conn.query(querySql, user.username, (err, result) => {
        if (err) return res.status(500).send({ status: 500,msg: '用户名查询失败!请重试!' })
        if (result[0].count != 0) return res.status(402).send({ status: '402', msg: '用户名已存在,请重试' })
        user.ctime = moment().format('YYYY-MM-DD HH:mm:ss')

        const addSql = 'insert into users set ?'
        conn.query(addSql, user, (err, result) => {
            if (err || result.affectedRows != 1) return res.status(500).send({ status: 500, msg: '用户添加失败,请重试' })
            res.send({ status: 200, msg: '用户注册成功' })            
        })
    })
})

router.post('/login', (req, res) => {
    const user = req.body
    const querySql = 'select * from users where username = ? and password = ?'
    conn.query(querySql, [user.username, user.password], (err, result) => {
        if (err) return res.status(500).send({ status: 500, msg: '登录失败,请重试' })
        if (result.length === 0) return res.status(400).send({ status: 400, msg: '用户名或密码错误!请重试!' })
        res.send({ status: 200, msg: '登录成功' })
    })
})

module.exports = router