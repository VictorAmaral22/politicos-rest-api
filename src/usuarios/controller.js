const { Usuario } = require('./model');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
//const { hashPassword } = require('../utils/passoword.js');
const {compare,hash,genSalt} = require('bcrypt')
class UsuariosController {

    constructor() {
        
    }

    async create(req, res) {
        // INPUT
        try{
            const { email, senha, nome } = req.body;
    
            // PROCESSAMENTO
            const salt=await genSalt(8)
            const hashedpass= await hash(senha,salt)
            const user = await Usuario.create({
                email, senha:hashedpass, nome
            });
    
            // RESPOSTA
            return res.status(201).json(user);
        } catch (err){
            res.json({msg:'erro'})
        }

    }

    async auth(req, res) {
        const { email, senha } = req.body;

        const user = await Usuario.findOne({
            where: {
                email, senha
            }
        });

        if (!user) {
            return res.status(400).json({ msg: "USER AND PASS NOT MATCH"});
        }
        console.log(user);
        const meuJwt = jwt.sign(user.dataValues, 'SECRET NAO PODERIA ESTAR HARDCODED')
        return res.json(meuJwt);
    }

    async list(req, res) {
        const users = await Usuario.findAndCountAll();
        res.json(users);
    }

    async getById(req, res) {
        let { id } =req.params
        id=parseFloat(id)
        const user=await Usuario.findByPk(id)
        if(!user){
            throw {
                status:HTTP_STATUS.NOT_FOUND,
                message:"User Not Found"
            }
        }
        const {dataValues:{name,email,createdAt,updatedAt}} = user
        return res.status(HTTP_STATUS.OK).json({id,name,email,createdAt,updatedAt})
    }
    async update(req, res) {
        const { id }=req.user;
        const {name,password}=req.body;
        const updateObj={};
        if(name){
            updateObj.name=name
        }
        if(password){
            // updateObj.password=await hashPassword(password)
        }
        await Users.update(updateObj,{where: { id }});
        return res.status(HTTP_STATUS.OK).json({msg:"UPDATED"})
    }
    async delete(req, res) {
        const { id }=req.user;
        await Usuario.destroy({where:{id}});
        res.json({ message: 'DELETED'});
    }
}


module.exports = UsuariosController;