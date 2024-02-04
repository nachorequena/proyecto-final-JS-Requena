
// CARRITO
let CARRITO = JSON.parse(localStorage.getItem("productosCarrito")) || [];
const cantidadProductos = document.getElementById("cantidadProductos");
const contenedorProductosEnCarrito = document.getElementById("contenedorProductosEnCarrito")
let productos = []
let botonesBorrar = document.querySelectorAll(".buttonBorrar")

const fetchProductos = async () => {

    try {
        const productosJson = await fetch("./productos.json")
        productos = await productosJson.json()
        renderizarProductos();
    } catch {
        console.error("error al cargar productos en el array")
    }
}

fetchProductos();


function renderizarProductos() {
    const carritoElementos = document.getElementById("carrito")
    carritoElementos.innerHTML = ``
    productos.forEach(producto => {
        const card = document.createElement("div")
        card.classList.add("card")
        card.classList.add("productos")
        card.innerHTML = `
            <div>
                <img src="${producto.img}" class="card-img-top" alt="">
                <div class="card-body">
                    <h5 class="card-title">${producto.nombre}</h5>
                    <p class="card-text">$${producto.precio.toFixed(2)}</p>
                    <button onclick="agregarAlCarrito(${producto.id})" class="btn btn-primary">Agregar al carrito</button>
                </div>
            </div>
        `;

        carritoElementos.appendChild(card)
    })
}



function agregarAlCarrito(idProducto) {
    const productosSeleccionados = productos.find(producto => producto.id === idProducto);

    if (!CARRITO.some(producto => producto.id === idProducto)) {
        productosSeleccionados.cantidad = 1
        CARRITO.push(productosSeleccionados);
        actualizarCarrito();
    } else {
        productosSeleccionados.cantidad++
        actualizarCarrito()
    }

    localStorage.setItem("productosCarrito", JSON.stringify(CARRITO));
}



function actualizarCarrito() {
    const carritoElementos = document.getElementById("contenedorProductosEnCarrito");
    carritoElementos.innerHTML = ``
    CARRITO.forEach(producto => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.classList.add("productos");
        card.innerHTML = `
                <div>
                    <img src="${producto.img}" class="card-img-top" alt="">
                    <div class="card-body">
                        <h5 class="card-title">${producto.nombre}</h5>
                        <p class="card-text">precio: $${producto.precio.toFixed(2)}</p>
                        <p class="card-text">cantidad: ${producto.cantidad}</p>
                        <button class="buttonBorrar" onclick="borrarProducto(${producto.id})">borrar producto</button>
                    </div>
                </div>
            `;
        carritoElementos.appendChild(card);
    });
    
    actualizarCantidadProductos();
    sumarTotal()

}



function sumarTotal() {
    const totalElementos = document.getElementById("total");
    if (CARRITO.length === 0) {
        totalElementos.innerHTML = `
            <p>Total carrito: $0.00</p>
        `;
        totalElementos.classList.add("filtro")
    } else {
        const total = CARRITO.reduce((acc, producto) => acc + producto.precio * producto.cantidad, 0);
        totalElementos.innerHTML = `
            <p>Total carrito: $${total.toFixed(2)}</p>
            <button onclick="pagoRealizado()">Realizar pago</button>
            <button onclick="vaciarCarrito()">Vaciar carrito</button>
        `;
    }


    localStorage.setItem("productosCarrito", JSON.stringify(CARRITO));
}

cantidadProductos.addEventListener("load", actualizarCantidadProductos())
function actualizarCantidadProductos() {
    let numeroCantidadProductos = CARRITO.reduce((acc, producto) => acc + producto.cantidad, 0)
    cantidadProductos.innerText = numeroCantidadProductos;
}

contenedorProductosEnCarrito.addEventListener("load", actualizarCarrito())



function pagoRealizado() {
    Swal.fire({
        position: "top-center",
        icon: "success",
        title: "Muchas gracias por tu compra!",
        showConfirmButton: false,
        timer: 1500
    });
    CARRITO.length = 0;
    actualizarCarrito()
    localStorage.setItem("productosCarrito", JSON.stringify(CARRITO));
}

function vaciarCarrito() {

    Swal.fire({
        title: "¿estas seguro de que quieres borrar todos los productos?",
        showDenyButton: true,
        confirmButtonText: "si",
        denyButtonText: `cancelar`
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire("tu carrito esta vacio", "", "error");
            CARRITO.length = 0;
            actualizarCarrito()
            localStorage.setItem("productosCarrito", JSON.stringify(CARRITO));
        }
    });

}

function borrarProducto(idProducto) {
    const productoId = idProducto
    const productoBorrado = CARRITO.findIndex(producto => producto.id === productoId)
    CARRITO.splice(productoBorrado, 1)
    actualizarCarrito()
    localStorage.setItem("productosCarrito", JSON.stringify(CARRITO));
}

//ABRIR Y CERRAR CARRITO
const abrirCarrito = document.getElementById("abrirCarrito")
const cerrarCarrito = document.getElementById("cerrarCarrito")
const aside = document.querySelector("aside")
const totalElementos = document.getElementById("total");

abrirCarrito.addEventListener("click", ()=>{
    aside.classList.remove("filtro")
    totalElementos.classList.remove("filtro")
})

cerrarCarrito.addEventListener("click", ()=>{
    aside.classList.add("filtro")
    totalElementos.classList.add("filtro")
})



//BOTON MODO

const botonModo = document.getElementById("botonModo")

botonModo.addEventListener("click", () => {
    document.body.classList.toggle("modoOscuro")
    document.body.classList.contains("modoOscuro")
        ? localStorage.setItem("modo", "oscuro")
        : localStorage.setItem("modo", "claro")
})

const modo = localStorage.getItem("modo")

modo === "oscuro"
    ? document.body.classList.add("modoOscuro")
    : document.body.classList.remove("modoOscuro")



//BUSCADOR
const buscador = document.getElementById("buscador")

buscador.addEventListener("keyup", e => {

    if (e.target.matches("#buscador")) {

        if (e.key === "Escape" || e.key === "enter") e.target.value = ""
        console.log(e.target.value)
        document.querySelectorAll(".productos").forEach(articulo => {

            articulo.textContent.toLowerCase().includes(e.target.value.toLowerCase())
                ? articulo.classList.remove("filtro")
                : articulo.classList.add("filtro")
        })

    }


})


//INICIAR SESION

class registrarse {
    constructor(nombreRegistro, apellidoRegistro, mailRegistro) {
        this.nombreRegistro = nombreRegistro
        this.apellidoRegistro = apellidoRegistro
        this.mailRegistro = mailRegistro
    }

}

let arrayRegistro = []

const formulario = document.getElementById("formulario")

formulario.addEventListener("submit", (e) => {
    e.preventDefault();
    const nombreRegistro = document.getElementById("nombreRegistro")
    const apellidoRegistro = document.getElementById("apellidoRegistro")
    const mailRegistro = document.getElementById("mailRegistro")
    const clienteRegistro = new registrarse(nombreRegistro.value, apellidoRegistro.value, mailRegistro.value)
    arrayRegistro.push(clienteRegistro)
    let jsonArrayRegistro = JSON.stringify(arrayRegistro)
    localStorage.setItem("registro", jsonArrayRegistro)
    enviarFormulario();
    formulario.reset();

})

localStorage.getItem("registro")

function enviarFormulario() {
    Swal.fire({
        position: "top-center",
        icon: "success",
        title: "tu cuenta ha sido registrada con éxito",
        showConfirmButton: false,
        timer: 1500
    });
}
