const express = require('express');
const router = express.Router();
const controller = require('../controllers/integrations.controller');

router.get('/', controller.getAllIntegrations);
router.post('/', controller.createIntegration);
router.put('/:id', controller.updateIntegration);
router.delete('/:id', controller.deleteIntegration);

module.exports = router;
