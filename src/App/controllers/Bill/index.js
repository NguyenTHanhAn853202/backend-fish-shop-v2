const Bill = require('../../models/Bill')
const Inventory = require('../../models/Inventory')
const Product = require('../../models/Product')
const SpecifyBill = require('../../models/SpecifyBill')
const exportBill = require('../../models/exportBill')

class BillClass{
    async create(req, res, next) {
        try {
            const {billId,provider,date=Date.now,itemId,name,number,price} = req.body
            let bill
            if(!billId || !provider || !itemId)
                return res.status(401).json({
                    success: false,
                    message: 'dont enough information',
                    data:[]
                })
            const newDate = new Date(date).toISOString().substring(0,10)
            const checkBill = await Bill.findOne({billId})

            if(checkBill && checkBill.date !==newDate){
                return res.status(200).json({
                    success:false,
                    message: 'Mã đã tồn tại',
                    code:11000
                })
            }else if(!checkBill){
                bill =  Bill.create({billId,provider,date:newDate})
            }
            const inventory =  await Inventory.updateOne({billId:billId,itemId:itemId,name,price},{$inc:{number:number}},{upsert:true})
            const specifyBill =  SpecifyBill.updateOne({billId,itemId,name,price},{$inc:{number:number,recentNumber:number}},{upsert:true})
            const product = await Product.updateOne({billId,itemId},{$inc:{number:number}})
            const [billData, specificationData] = await Promise.all([bill,specifyBill])
            if(specificationData) return res.status(200).json({
                success: true,
                message: 'create bill successfully',
                data:{
                    billData,
                    specificationData
                }
            })
            return res.status(403).json({
                success:false,
                message: 'fail when creating bill, check again',
                data:[]
            })
        } catch (error) {
            if(error.code ===11000){
                return res.status(200).json({
                    success:false,
                    message: 'Mã đã tồn tại',
                    code:11000
                })
            }
            else console.log(error);
        }
        
    }
    async showBill(req, res, next) {
        try {
            const data = await Bill.find()
            res.status(200).json({
                success: true,
                message: 'showing bill successfully',
                data
            })
        } catch (error) {
            console.log(error);
        }
    }
    async showSpecifyBill(req, res, next) {
        try {
            const {billId=''} = req.query
            if(!billId) return res.status(403).json({
                success:false,
                message: 'bill Id is empty',
                data:[]
            })
            const data = await SpecifyBill.find({billId: billId})
            res.status(200).json({
                success: true,
                message:'showing specify bill is successfully',
                data
            })
        } catch (error) {
            console.log(error);
        }
    }

    async showAddProduct(req, res, next) {
        try {
            const data = await SpecifyBill.find({recentNumber:{$gt:0}}).populate('_billId')
            const newData = data.map(item=>({...item._doc,_billId:item._billId}))
            return res.status(200).json({
                success:true,
                data:newData
            })
        } catch (error) {
            console.log(error);
        }
    }

    async exportBill(req, res) {
        try {
            const data = await exportBill.find().populate('_billId _itemId').sort({'createdAt':-1})
            const newData = data.map(item=>({...item._doc,_billId:item._billId,_itemId:item._itemId}))
            res.status(200).json({
                success:true,
                data:newData
            })
        } catch (error) {
            console.log(error);
        }
    }

    async showinventory(req, res) {
        try {
            const data = await Inventory.find().populate('_billId _itemId').sort({'createdAt':-1})
            const newData = data.map(item=>({...item._doc,_billId:item._billId,_itemId:item._itemId}))
            res.status(200).json({
                success:true,
                data:newData
            })
        } catch (error) {
            console.log(error);
        }
    }

    async set(req,res){
        const data = await Bill.deleteMany()
        return res.send(data)
    }


}

module.exports = new BillClass()