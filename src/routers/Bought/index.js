const express = require('express');
const router = express.Router()
const authenToken = require('../../utils/authenToken');
const Bought = require('../../App/controllers/Bought');
const {employee} =  require('../../utils/roles')

router.get('/my-bought',authenToken,Bought.myBought)
router.get('/all-bought',authenToken,employee,Bought.allBought)

router.post('/list-bought',authenToken,employee,Bought.boughtList)
router.post('/update-status',authenToken,employee,Bought.updateStatus)

router.post('/bought-at-store',Bought.boughtAtStore)

module.exports = router