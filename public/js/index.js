if(performance.navigation.type == 2){
    location.reload();
 }

const addToCart = document.querySelectorAll('.addtocart');
const removeFromCart = document.querySelectorAll('.removeFromCart');
const cartCounter = document.querySelector("#cartCounter")
const slideshow = document.querySelectorAll('.slideshow')


//const menuButton=document.querySelectorAll()
// const sliderContainer = document.querySelector('.slideshow_container')

//console.log(document.querySelectorAll(' .slideshow'))
let socket = io();

//for nav

const closeButton = document.querySelector('.close')
const openButton = document.querySelector('.open')
const sidebars = document.querySelectorAll('.nav-sidebar')

openButton.addEventListener('click', (e) => {
    //add nav-visble class on sidebars
    // console.log('open')
    sidebars.forEach((sidebar) => {
        sidebar.classList.add('nav-visible');
    })
})
closeButton.addEventListener('click', (e) => {
    //remove vnav-isble class from sidebars
    // console.log('close')
    sidebars.forEach((sidebar) => {
        sidebar.classList.remove('nav-visible');
    })
})

document.addEventListener('click', (e) => {
    //remove nav-visible class from sidebars on clicking outside of sidebars
    //console.log('outside')
    if (e.target.className !== 'fas fa-bars' && sidebars[0].classList.contains('nav-visible')) {
        sidebars.forEach((sidebar) => {
            sidebar.classList.remove('nav-visible');
        })
    }
})
// window.onscroll = function (e) {
//     console.log(window.scrollY); // Value of scroll Y in px
// };
//menu slideshow


if (window.location.pathname === '/') {
   

    const menuRightButton=document.querySelectorAll('.menu_right i')
    const menuLeftButton=document.querySelectorAll('.menu_left i')
    
   //arrow key functionality
    menuRightButton.forEach((btn)=>{  
        btn.addEventListener('click', (e) => {
             
          if(btn.classList.contains('right0')){
            var p = slideshow[0].style.marginLeft; // return value in px; i.e 50px
            console.log(p.length)
             p = p.substr(0,p.length-1); // remove px ie : 50px becomes 50
             slideshow[0].style.marginLeft = (+p)- 100 +'%' // convert p to number and add 10
          }
          else if(btn.classList.contains('right1')){
            var p = slideshow[1].style.marginLeft; // return value in px; i.e 50px
            console.log(p)
             p = p.substr(0,p.length-1); // remove px ie : 50px becomes 50
             slideshow[1].style.marginLeft = (+p) - 100 +'%' // convert p to number and add 10
          }
          else if(btn.classList.contains('right2')){
            var p = slideshow[2].style.marginLeft; // return value in px; i.e 50px
            console.log(p)
             p = p.substr(0,p.length-1); // remove px ie : 50px becomes 50
             slideshow[2].style.marginLeft = (+p) - 100 +'%' // convert p to number and add 10
          }
          else if(btn.classList.contains('right3')){
            var p = slideshow[3].style.marginLeft; // return value in px; i.e 50px
            console.log(p)
             p = p.substr(0,p.length-1); // remove px ie : 50px becomes 50
             slideshow[3].style.marginLeft = (+p) - 100 +'%' // convert p to number and add 10
          }
    })
  })
    
    menuLeftButton.forEach((btn)=>{
        btn.addEventListener('click', (e) => {
            if(btn.classList.contains('left0')){
                var p = slideshow[0].style.marginLeft; // return value in px; i.e 50px
                console.log(p)
                 p = p.substr(0,p.length-1); // remove px ie : 50px becomes 50
                 slideshow[0].style.marginLeft = (+p) + 100 +'%' // convert p to number and add 10
              }
              else if(btn.classList.contains('left1')){
                var p = slideshow[1].style.marginLeft; // return value in px; i.e 50px
                console.log(p)

                 p = p.substr(0,p.length-1); // remove px ie : 50px becomes 50
                 slideshow[1].style.marginLeft = (+p) + 100 +'%' // convert p to number and add 10
              }
              else if(btn.classList.contains('left2')){
                var p = slideshow[2].style.marginLeft; // return value in px; i.e 50px
                console.log(p)

                 p = p.substr(0,p.length-1); // remove px ie : 50px becomes 50
                 slideshow[2].style.marginLeft = (+p) + 100 +'%' // convert p to number and add 10
              }
              else if(btn.classList.contains('left3')){
                var p = slideshow[3].style.marginLeft; // return value in px; i.e 50px
                console.log(p)

                 p = p.substr(0,p.length-1); // remove px ie : 50px becomes 50
                 slideshow[3].style.marginLeft = (+p)+ 100 +'%' // convert p to number and add 10
              }
        })
    })
    
    //sliders animation

   let observer=new IntersectionObserver((entries,observer)=>{
       entries.forEach((entry)=>{
           if(entry.isIntersecting){
               let item=entry.target;
               item.style.marginLeft="0%"
           }
       })        
   },{
         rootMargin:'0px 0px 0px 0px',
         threshold:0
   })
    
   slideshow.forEach((item)=>{
     observer.observe(item)
   })
    

    

 

    //cart counter
    const updateCart = (pizza) => {
        axios.post('/update-cart', pizza).
            then((res) => {
                //console.log(res);
                cartCounter.innerText = res.data.cart.totalQty;
                let pizzaID=pizza._id.toString()
                //console.log(res.data.cart.items[pizzaID])

                if(res.data.cart.items[pizzaID]){
                    let individualCounter = document.querySelectorAll('.individualCart')
                   individualCounter.forEach((indi)=>{
                        if(indi.dataset.id===pizzaID)
                        {
                            indi.innerHTML=res.data.cart.items[pizzaID].qty
                             //console.log(res.data.cart.items[pizzaID].qty)
                        }
                    })
                }
            }).catch(err => console.log(err));
    }
    const removeCart = (pizza) => {
        axios.post('/remove-cart', pizza).
            then((res) => {
                console.log(res);
                //cartCounter.innerText = res.data.totalqty;
                //console.log(res);
                let pizzaID=pizza._id.toString()

                if(res.data.cart){
                cartCounter.innerText = res.data.cart.totalQty;
                if(res.data.cart.items[pizzaID]){
                    let individualCounter = document.querySelectorAll('.individualCart')
                   individualCounter.forEach((indi)=>{
                        if(indi.dataset.id===pizzaID) 
                            indi.innerHTML=res.data.cart.items[pizzaID].qty
                            //     console.log(res.data.cart.items[pizzaID].qty)
                    })
                }
              }
                else if(res.data.cartTemp){
                cartCounter.innerText ='0';
                if(res.data.cartTemp){
                    let individualCounter = document.querySelectorAll('.individualCart')
                   individualCounter.forEach((indi)=>{
                        if(indi.dataset.id===pizzaID)
                            indi.innerHTML='0'
                            //     console.log(res.data.cart.items[pizzaID].qty
                    })
                }
            }
               // console.log(res.data.cart.items[pizzaID])

                
    
            }).catch(err => console.log(err));
    }
    //addtocart functionality
    addToCart.forEach((btn,index) => {
        btn.addEventListener('click', (e) => {
            const pizza = JSON.parse(btn.dataset.pizza);
            
            updateCart(pizza);
           

        })
    })
    //remove from cart functionality
    removeFromCart.forEach((btn)=>{
      btn.addEventListener('click', (e) => {
            const pizza = JSON.parse(btn.dataset.pizza);

            removeCart(pizza);
        })
    })
}

//customer orders page alert
const orderAlert = document.querySelector('#successAlert');
if (orderAlert) {
    setTimeout(() => {
        orderAlert.remove();
    }, 2000)
}

//render admin order's page Tablebody
let OrdersArray = [];
let htmlMarkup;
const adminOrderTable = document.querySelector('#adminOrderTablebody');
let alert = document.querySelector('#alert');

function generateMarkup(orders) {
    return orders.map(order => {
        return `
            <tr>
            <td class="border px-4 py-2 text-green-900">
                <p> ${order._id}</p>
                <div>${renderItems(order.items)}</div>
            </td>
            <td class="border px-4 py-2">${order.customerID.name}</td>
            <td class="border px-4 py-2">${order.address}</td>
            <td class="border px-4 py-2">${order.phone}</td>
            <td class="border px-4 py-2">
                <div class="inline-block relative w-64">
                    <form action="/admin/order/status" method="POST">
                        <input type="hidden" name="orderId" value="${order._id}">
                        <select name="status" onchange="this.form.submit()"
                            class="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
                            <option value="order placed"
                                ${order.status === 'order placed' ? 'selected' : ''}>
                                Placed</option>
                            <option value="confirmed" ${order.status === 'confirmed' ? 'selected' : ''}>
                                Confirmed</option>
                            <option value="prepared" ${order.status === 'prepared' ? 'selected' : ''}>
                                Prepared</option>
                            <option value="Out_for_Delivery" ${order.status === 'Out_for_Delivery' ? 'selected' : ''}>
                                Out for Delivery
                            </option>
                            <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>
                                Delivered
                            </option>
                        </select>
                    </form>
                    <div
                        class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20">
                            <path
                                d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                    </div>
                </div>
            </td>
            <td class="border px-4 py-2">${moment(order.updatedAt).format('MMMM Do YYYY, h:mm:ss a')}</td>
        </tr>
    `
    }).join('')

}

function renderItems(Items) {
    let itemsArray = Object.values(Items);
    return itemsArray.map((menuItem) => {
        return `<p>${menuItem.items.name}-${menuItem.qty} Pcs</p>`
    }).join("");
}

function admin() {

    axios.get('/admin/orders', {
        headers: {
            'X-Requested-With': "XMLHttpRequest"
        }
    }).then((res) => {
        OrdersArray = res.data;
        console.log(OrdersArray)
        htmlMarkup = generateMarkup(OrdersArray);
        adminOrderTable.innerHTML = htmlMarkup;
    }).catch((err) => {
        console.log(err);
    })

}

//customers individual order status

let order = null;
if (document.querySelector('section.status input')) {//from Singleorder ejs
    order = document.querySelector('section.status input').value;
    order = JSON.parse(order);
}
const lists = document.querySelectorAll('section.status .list ul li');

//to get status of order on every refresh
if (order)
    orderTracker(order);

function orderTracker(updatedOrder) {

    let done = true;
    console.log(updatedOrder);

    //reset status
    lists.forEach((list) => {
        let span = list.childNodes[1];
        list.classList.remove('current_stage');
        list.classList.remove('stage_done');
        //span.innerHTML = ""
    })

    //track order animation 
    lists.forEach((list) => {
        let span = list.childNodes[1];
        if (done) {
            if (list.dataset.status !== updatedOrder.status) {
                list.classList.remove('current_stage')
                list.classList.add('stage_done')
                // span.innerText = moment(updatedOrder.updatedAt).format('MMMM Do YYYY, h:mm:ss a');;
                if (list.nextElementSibling) {
                    list.nextElementSibling.classList.add('current_stage');
                }
            }
            else {
                list.classList.remove('current_stage');
                list.classList.add('stage_done');

                span.innerText = moment(updatedOrder.updatedAt).format('MMMM Do YYYY, h:mm:ss a');
                if (list.nextElementSibling) {
                    list.nextElementSibling.classList.add('current_stage');
                }
                done = false;
            }
        }
        else {
            span.innerHTML = ""
        }
    })
}
//  Socket.io
if (order) {
    socket.emit('join', `order_${order._id}`);
}
if (window.location.pathname.includes('/admin/orders')) {

    admin();
    socket.on('reflectOrder1', (data) => {

        alert.innerHTML = "";
        alert.innerHTML = data.message;
        alert.style.display = "block";
        window.setTimeout(() => {
            alert.style.display = "none";
        }, 2000)
        OrdersArray.unshift(data.result);
        adminOrderTable.innerHTML = "";
        adminOrderTable.innerHTML = generateMarkup(OrdersArray);

    })
    socket.emit('join', 'adminRoom')
    //from  orderController postOrder
}



if (window.location.pathname.includes('/order/')) {
    socket.on('orderUpdated', (data) => {
        let updatedOrder = { ...data };
        // updatedOrder.updatedAt = moment(data.updatedAt).format('MMMM Do YYYY, h:mm:ss a');
        // updatedOrder.status = data.status;
        orderTracker(updatedOrder);
        // console.log(data);
    })
}




