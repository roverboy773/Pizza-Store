

const addToCart = document.querySelectorAll('.addtocart');
const cartCounter = document.querySelector("#cartCounter")
let socket = io();
const updateCart = (pizza) => {
    axios.post('/update-cart', pizza).
        then((res) => {
            //console.log(res);
            cartCounter.innerText = res.data.totalqty;
        }).catch(err => console.log(err));
}

addToCart.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        const pizza = JSON.parse(btn.dataset.pizza);

        updateCart(pizza);

    })
})

//customer orders page alert
const orderAlert = document.querySelector('#successAlert');
if (orderAlert) {
    setTimeout(() => {
        orderAlert.remove();
    }, 2000)
}

//render admin orders page body
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
        htmlMarkup = generateMarkup(OrdersArray);
        adminOrderTable.innerHTML = htmlMarkup;
    }).catch((err) => {
        console.log(err);
    })

}

//customers individual order status
let order = false;
if (document.querySelector('section.status input')) {
    order = document.querySelector('section.status input').value;
    order = JSON.parse(order);
}
const lists = document.querySelectorAll('section.status .list ul li');
let done = true;
let err = {};

//  Socket.io
if (order) {
    socket.emit('join', `order_${order._id}`);
}
if (window.location.pathname.includes('admin/orders')) {

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

socket.on('orderUpdated', (data) => {
    let updateOrder = { ...order };
    updateOrder.updatedAt = moment().format('MMMM Do YYYY, h:mm:ss a');
    updateOrder.status = data.status;
    console.log(data);
})



