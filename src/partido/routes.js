const {Router} = require('express');
const {isAuth} = require('../middlewares/isAuth');
const router = Router();

const PartidoController = require('./controller');
const controller = new PartidoController();

router.post('/', isAuth, (req, res) => controller.create(req, res));

router.get('/', (req, res) => controller.list(req, res));
router.get('/:id', (req, res) => controller.getById(req, res));
router.get('/:id/integrantes', (req, res) => controller.getAllParticipantes(req, res));

router.put('/:id', isAuth, (req, res) => controller.update(req, res));
router.delete('/:id', isAuth, (req, res) => controller.delete(req, res));

module.exports = router;