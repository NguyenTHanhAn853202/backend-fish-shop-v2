const Accounts = require("../../models/Accounts");
const Bought = require("../../models/Bought");
const BoughtAtStore = require("../../models/BoughtAtStore");
const Provider = require("../../models/Provider");


class Statistics{
    async overView(req,res,next){
        try {
            const users = Accounts.find({role:{$ne:'manager'},role:{$ne:'employee'}})
            const bought = Bought.find()
            const provider = Provider.find()
            const boughtAtStore = BoughtAtStore.find()
            const [userNumberPromise,boughtNumberPromise,
                providerNumberPromise,boughtAtStorePromise] = await Promise.all([users,bought,provider,boughtAtStore])
            const userNumber =  userNumberPromise.length
            const orderNumber = boughtNumberPromise.length + boughtAtStorePromise.length
            let itemNumber = boughtNumberPromise.reduce((first,item)=>first+item.number,0)
            itemNumber = boughtAtStorePromise.reduce((first,item)=>first+item.number,itemNumber)
            const providerNumber = providerNumberPromise.length
            let totalSales = boughtAtStorePromise.reduce((first,item)=>first+item.number*item.price,0)
            totalSales  = boughtNumberPromise.reduce((first,item)=>first+item.number*item.price,totalSales)
            res.status(200).json({
                totalSales,
                providerNumber,
                itemNumber,
                orderNumber,
                userNumber
            })
        } catch (error) {
            console.log(error.message);
        }
    }
}

module.exports = new Statistics();