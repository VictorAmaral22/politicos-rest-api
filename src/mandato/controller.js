const { Partido } = require('../partido/model');
const { Politico } = require('../politico/model');
const {Mandato} = require('./model');

class MandatoController {

    constructor() {}

    async create(req, res) {
        try {
            // INPUT
            const {
                id_politico,
                numero,
                cidade,
                estado,
                pais,
                cargo,
                inicio,
                final
            } = req.body;

            // PROCESSAMENTO
            const user = await Mandato.create({            
                id_politico,
                numero,
                cidade,
                estado,
                pais,
                cargo,
                inicio,
                final});
                if(user){
                    await Politico.update({mandatoAtual: user.id}, {
                        where: {
                            cpf: id_politico,
                            
                        }
                    });
                }
            // RESPOSTA
            return res
                .status(201)
                .json(user);
        } catch (error) {
            return res
                .status(400)
                .json({error});
        }

    }

    async list(req, res) {
        try {
            const mandatos = await Mandato.findAndCountAll();

            res.status(200).json(mandatos);
        } catch (error) {
            return res
                .status(400)
                .json({error});
        }
    }

    async getById(req, res) {
        try {
            let {id} = req.params
            let mandato = await Mandato.findByPk(id)
            if (!mandato) {
                throw {status: 400, message: "Mandato não encontrado"}
            }else{
                const politico = await Politico.findByPk(mandato.id_politico)
                if(politico.id_partido){
                    const partido = await Partido.findByPk(politico.id_partido)
                    return res
                    .status(200)
                    .json({mandato, politico,partido})
                }
            }
        } catch (error) {
            return res
                .status(400)
                .json({error});
        }
    }
    
    async update(req, res) {
        try {
            const {id} = req.params;
            await Mandato.update(req.body, {where: {
                    id
                }});
            return res
                .status(200)
                .json({msg: "UPDATED"})
        } catch (error) {
            return res
                .status(400)
                .json({error});
        }
        
    }

    async delete(req, res) {
        try {
            const {id} = req.params;
            await Mandato.destroy({where: {
                    id
                }});
            res.json({message: 'DELETED'});
        } catch (error) {
            return res
                .status(400)
                .json({error});
        }
        
    }
}

module.exports = MandatoController;