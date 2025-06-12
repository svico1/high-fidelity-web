
      const productos = [
        {
          id: 1,
          name: "SHOOTER 69'",
          price: 89999.99,
          image: "img/shooter69.jpg",
          description: "Campera icónica inspirada en el espíritu rebelde de los 60"
        },
        {
          id: 2,
          name: "CORDUROY ECHO",
          price: 79999.99,
          image: "img/corduroy_echo.jpg",
          description: "Pana vintage que resuena con la autenticidad de una época"
        },
        {
          id: 3,
          name: "FIELD FADE",
          price: 94999.99,
          image: "img/field_fade.jpg",
          description: "Desgaste natural que cuenta historias de aventuras pasadas"
        },
        {
          id: 4,
          name: "THE BOOTH",
          price: 105999.99,
          image: "img/the_booth.jpg",
          description: "Elegancia urbana con el toque distintivo de los estudios de grabación"
        },
        {
          id: 5,
          name: "NOIR",
          price: 109999.99,
          image: "img/noir.jpg",
          description: "Campera de cuero negra con estilo rockero elegante"
        },
        {
          id: 6,
          name: "TEMPER FRONT",
          price: 99999.99,
          image: "img/temper_front.jpg",
          description: "Estilo camperón invierno, cuello de borrego, inspiración utilitaria"
        }

      ];

      let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
      let seccionActual = "home";

      const carritoCount = document.getElementById("contador-carrito");
      const productosContainer = document.getElementById("contenedor-productos");
      const carritoItems = document.getElementById("elementos-carrito");
      const carritoTotal = document.getElementById("total-carrito");
      const botonFinalizar = document.getElementById("boton-finalizar");
      const formularioCompra = document.getElementById("formulario-compra");
      const menuToggle = document.querySelector('.menu-toggle');
      const navLinks = document.querySelector('.nav-links');

      function saveCarritoToStorage() {
        localStorage.setItem('carrito', JSON.stringify(carrito));
      }

      function showToast(message, duration = 3000) {
        const toastContainer = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        
        toastContainer.appendChild(toast);
        
        toast.offsetHeight;
        
        toast.classList.add('show');
        
        setTimeout(() => {
          toast.classList.remove('show');
          setTimeout(() => {
            toastContainer.removeChild(toast);
          }, 300);
        }, duration);
      }

      function init() {
        renderProducts();
        setupEventListeners();
        showSection("home");
        updateCartUI();
      }

      function renderProducts() {
        productosContainer.innerHTML = productos
          .map(
            (product) => `
              <div class="tarjeta-producto">
                  <img src="${product.image}" alt="${product.name}" class="imagen-producto">
                  <div class="informacion-producto">
                      <h3 class="titulo-producto">${product.name}</h3>
                      <p class="precio-producto">$${product.price.toLocaleString()}</p>
                      <button class="boton-primario" onclick="addToCart(${product.id})">
                          Agregar al Carrito
                      </button>
                  </div>
              </div>
          `
          )
          .join("");
      }

      function addToCart(productId) {
        const product = productos.find((p) => p.id === productId);
        const carritoItem = carrito.find((item) => item.id === productId);

        if (carritoItem) {
          carritoItem.quantity++;
        } else {
          carrito.push({ ...product, quantity: 1 });
        }

        updateCartUI();
        saveCarritoToStorage();
        showToast(`¡${product.name} agregado al carrito!`);
      }

      function incrementQuantity(productId) {
        const carritoItem = carrito.find((item) => item.id === productId);
        if (carritoItem) {
          carritoItem.quantity++;
          updateCartUI();
          saveCarritoToStorage();
        }
      }

      function decrementQuantity(productId) {
        const carritoItem = carrito.find((item) => item.id === productId);
        if (carritoItem && carritoItem.quantity > 1) {
          carritoItem.quantity--;
          updateCartUI();
          saveCarritoToStorage();
        }
      }

      function updateCartUI() {
        carritoCount.textContent = carrito.reduce((sum, item) => sum + item.quantity, 0);

        carritoItems.innerHTML = carrito
          .map(
            (item) => `
              <div class="carrito-item">
                  <img src="${item.image}" alt="${item.name}">
                  <div class="carrito-item-info">
                      <h3>${item.name}</h3>
                      <p>$${item.price.toLocaleString()}</p>
                      <div class="controles-cantidad">
                          <button class="boton-cantidad" onclick="decrementQuantity(${item.id})">-</button>
                          <span style="font-weight: bold; margin: 0 1rem;">${item.quantity}</span>
                          <button class="boton-cantidad" onclick="incrementQuantity(${item.id})">+</button>
                      </div>
                      <button class="boton-primario" onclick="removeFromCart(${item.id})" style="margin-top: 1rem;">
                          Eliminar
                      </button>
                  </div>
              </div>
          `
          )
          .join("");

        const total = carrito.reduce((sum, item) => sum + item.price * item.quantity, 0);
        carritoTotal.textContent = total.toLocaleString();
      }

      function removeFromCart(productId) {
        carrito = carrito.filter((item) => item.id !== productId);
        updateCartUI();
        saveCarritoToStorage();
      }

      function showSection(sectionId) {
        document.querySelectorAll("section").forEach((section) => {
          section.classList.remove("active");
        });

        document.getElementById(sectionId).classList.add("active");
        seccionActual = sectionId;
      }

      document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
          e.preventDefault();
          const section = this.getAttribute("href").substring(1);
          const element = document.getElementById(section);
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          }
        });
      });

      function setupEventListeners() {
        document.querySelector(".icono-carrito").addEventListener("click", () => {
          showSection("carrito");
        });

        botonFinalizar.addEventListener("click", () => {
          if (carrito.length > 0) {
            showSection("checkout");
          } else {
            showToast("Tu carrito está vacío");
          }
        });

        formularioCompra.addEventListener("submit", (e) => {
          e.preventDefault();
          showToast("¡Gracias por tu compra! Procesando el pedido...", 3000);
          setTimeout(() => {
            carrito = [];
            updateCartUI();
            saveCarritoToStorage();
            showSection("home");
            showToast("¡Compra confirmada! Te contactaremos pronto.", 2000);
          }, 3000);
        });

        if (menuToggle) {
          menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
          });
        }

        document.querySelectorAll('.nav-links a').forEach(link => {
          link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
              navLinks.classList.remove('active');
            }
          });
        });
      }

      init();
    