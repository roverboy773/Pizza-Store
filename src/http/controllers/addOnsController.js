
function addOnController() {
    return {
        add(req, res) {
            const { addonDetails, pizzaId } = req.body

            // console.log(addonDetails,typeof pizzaId)

            let cart = req.session.cart

            if (!cart.items[pizzaId].addons) {
                cart.items[pizzaId].addons = { }
            }

            const addonId = addonDetails._id
            if (!cart.items[pizzaId].addons[addonId]) {
                cart.items[pizzaId].addons[addonId] = addonDetails
    
                cart.totalPrice = cart.totalPrice + addonDetails.price
            }
            return res.json({ msg: 'added' ,totalPrice:cart.totalPrice})
        },
        remove(req,res){

            const {addonDetails,pizzaId}=req.body
            let cart=req.session.cart

            const addonId = addonDetails._id
            if(cart.items[pizzaId].addons[addonId]){
                cart.totalPrice=cart.totalPrice-addonDetails.price
                delete cart.items[pizzaId].addons[addonId]
            }

            return res.json({msg:'removed',totalPrice:cart.totalPrice})
        }
    }
}

module.exports = addOnController