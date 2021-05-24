const menu = require('../../models/menu')

function cartController() {
    return {
        async index(req, res) {
            try {
                const addons = await menu.find({ category: 'addon' })
                res.render('cart', { addons: addons });
            } catch (err) {
                console.log(err)
            }
        },
        update(req, res) {
            // check if cart doesnt exists

            if (!req.session.cart) {
                req.session.cart = {
                    items: {},
                    totalPrice: 0,
                    totalQty: 0
                }
            }
            let cart = req.session.cart;

            //check if item dont exists in cart
            if (!cart.items[req.body._id]) {
                cart.items[req.body._id] = {
                    item: req.body,
                    qty: 1
                }
                cart.totalPrice = cart.totalPrice + req.body.price,
                    cart.totalQty = cart.totalQty + 1;
            } else {
                cart.items[req.body._id].qty = cart.items[req.body._id].qty + 1;
                cart.totalQty = cart.totalQty + 1;
                cart.totalPrice = cart.totalPrice + req.body.price;
            }
            // console.log(req.session)
            return res.json({ cart });
        },
        remove(req, res) {
            // check if cart doesnt exists

            if (!req.session.cart) {
                return
            }
            let cart = req.session.cart;
            let cartTemp
            //check if item dont exists in cart
            if (cart.items[req.body._id]) {
                if (cart.items[req.body._id].qty > 1) {
                    cart.items[req.body._id].qty = cart.items[req.body._id].qty - 1;
                    cart.totalPrice = cart.totalPrice - req.body.price;
                    cart.totalQty = cart.totalQty - 1;

                    return res.json({ cart });
                } else {
                    cartTemp = cart
                    cartTemp.items[req.body._id].qty = cart.items[req.body._id].qty - 1;
                    cartTemp.totalPrice = cart.totalPrice - req.body.price;
                    cartTemp.totalQty = cart.totalQty - 1;
                   // console.log(cartTemp)
                    delete cart.items[req.body._id]
                    return res.json({ cartTemp });
                }



            }
            // console.log(req.session)

        },
        delete(req, res) {
            const pizza=req.body.pizza

            let cart=req.session.cart
            const pizzaId=pizza.item._id
              
            let addOnsPrice=0
           
            if(cart.items[pizzaId]){
                console.log(cart.items[pizzaId])
                if(cart.items[pizzaId].addons)
                {
                    const addons=cart.items[pizzaId].addons
                    //console.log(addons)
                    for(let addon in addons){
                        addOnsPrice=addOnsPrice+addons[addon].price
                    }
                }
                // console.log(`total price ${cart.totalPrice}`)
                // console.log(`addons price ${addOnsPrice}`)
                // console.log(`pizza price ${cart.items[pizzaId].item.price}`)
                // console.log(`pizza qty ${cart.items[pizzaId].qty}`)

              cart.totalPrice=cart.totalPrice - (cart.items[pizzaId].item.price * cart.items[pizzaId].qty) - addOnsPrice
              //console.log(`revised total price ${cart.totalPrice}`)
              cart.totalQty=cart.totalQty - cart.items[pizzaId].qty
              delete cart.items[pizzaId]

              return res.json({msg:"deleted"})
            }
        }
    }
}

module.exports = cartController;