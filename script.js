//Global variables
var element;

//Detect onclick event
if (window.matchMedia("(max-width: 920px)").matches === false) {
    $(".ham").on("click", function () {
        $(".side_menu").css("right", "0px");
        $(".overlay").css("opacity", "1");
        $(".overlay").css("z-index", "99");
    });

    $(".close").on("click", function () {
        $(".contact").css("top") >= "10%" ? $(".contact").hide().css("top", "-100%").fadeOut('100') : $(".side_menu").css("right", "-500px");
        $(".overlay").css("opacity", "0");
        $(".overlay").css("z-index", "-1");
    });

    $(".overlay").on("click", function () {
        $(".contact").css("top") >= "10%" ? $(".contact").hide().css("top", "-100%").fadeOut('100') : $(".side_menu").css("right", "-500px");
        $(".overlay").css("opacity", "0");
        $(".overlay").css("z-index", "-1");
    });
} else {
    $(".ham").on("click", function () {
        $(".side_menu").css("right", "0px");
        $(".overlay").css("opacity", "1");
        $(".overlay").css("z-index", "9");
    });

    $(".close").on("click", function () {
        $(".contact").css("top") >= "10%" ? $(".contact").hide().css("top", "-100%").fadeOut('100') : $(".side_menu").css("right", "-120%");
        $(".overlay").css("opacity", "0");
        $(".overlay").css("z-index", "-1");
    });

    $(".overlay").on("click", function () {
        $(".contact").css("top") >= "10%" ? $(".contact").hide().css("top", "-100%").fadeOut('100') : $(".side_menu").css("right", "-120%");
        $(".overlay").css("opacity", "0");
        $(".overlay").css("z-index", "-1");
    });
}


//Scroller Nav
window.onscroll = function () {
    if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
        $("nav").addClass("fixed_nav");
    } else {
        $("nav").removeClass("fixed_nav");
    }
}


//DETECT ESC KEY PRESSED
document.onkeydown = function (evt) {
    evt = evt || window.event;
    var isEscape = false;
    if ("key" in evt) {
        isEscape = (evt.key === "Escape" || evt.key === "Esc");
    } else {
        isEscape = (evt.keyCode === 27);
    }
    if (isEscape) {
        if ($(".overlay").css("opacity") == "1") {
            $(".contact").css("top") >= "10%" ? $(".contact").hide().css("top", "-100%").fadeOut('100') : $(".side_menu").css("right", "-120%");
            $(".overlay").css("opacity", "0");
            $(".overlay").css("z-index", "-1");
        }
    }
};



//Dropdown
$(".dropdown").click(function () {
    if ($(this).children("aside").is(":hidden")) {
        $(this).children("aside").show("slow");
        $(this).children("a").css("color", "var(--white)");
    } else {
        $(this).children("aside").hide("slow");
        $(this).children("a").css("color", "var(--lite)");
    }
});








//Global variables
var slidestoshow, arrowmark;
if (window.matchMedia("(max-width: 920px)").matches === false) {
    slidestoshow = 4;
    arrowmark = true;
} else {
    slidestoshow = 1;
    arrowmark = false;
}

if ($('.blog-slider').length) {
    $('.blog-slider').slick({
        slidesToShow: slidestoshow,
        slidesToScroll: 1,
        dots: false,
        arrows: arrowmark,
        autoplay: true,
        autoplaySpeed: 2000,
        infinite: true
    });
}


if ($('.event-slider').length) {
    $('.event-slider').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        dots: false,
        arrows: false,
        autoplay: true,
        autoplaySpeed: 4000,
        infinite: true
    });
}


/***************************
    animacion pagina
****************************/

document.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", function (e) {

        if (this.href && this.hostname === location.hostname) {

            e.preventDefault();

            document.body.classList.add("fade-out");

            setTimeout(() => {
                window.location = this.href;
            }, 350);
        }
    });
});

/*====================================================
        CONTADOR DE EVENTOS
====================================================*/

const eventCards = document.querySelectorAll(".event-card");

function actualizarEventos() {

    const ahora = new Date().getTime();

    eventCards.forEach(card => {

        const inicio = new Date(card.dataset.start).getTime();
        const fin = new Date(card.dataset.end).getTime();

        const total = fin - inicio;
        const restante = inicio - ahora;

        const dias = card.querySelector(".days");
        const horas = card.querySelector(".hours");
        const minutos = card.querySelector(".minutes");
        const segundos = card.querySelector(".seconds");

        const barra = card.querySelector(".progress-fill");
        const porcentaje = card.querySelector(".percentage");
        const estado = card.querySelector(".status");

        //==================================================
        // EVENTO TERMINADO
        //==================================================

        if (ahora >= fin) {

            dias.textContent = "00";
            horas.textContent = "00";
            minutos.textContent = "00";
            segundos.textContent = "00";

            barra.style.width = "100%";
            porcentaje.textContent = "100%";

            estado.textContent = "Evento finalizado";

            card.classList.add("event-ended");

            return;
        }

        //==================================================
        // EVENTO EN CURSO
        //==================================================

        if (ahora >= inicio && ahora < fin) {

            const progreso = ((ahora - inicio) / total) * 100;

            barra.style.width = progreso + "%";
            porcentaje.textContent = Math.floor(progreso) + "%";

            estado.textContent = "Evento en curso";

            dias.textContent = "00";
            horas.textContent = "00";
            minutos.textContent = "00";
            segundos.textContent = "00";

            return;

        }

        //==================================================
        // EVENTO PRÓXIMO
        //==================================================

        const diferencia = inicio - ahora;

        const d = Math.floor(diferencia / (1000 * 60 * 60 * 24));
        const h = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diferencia % (1000 * 60)) / 1000);

        actualizarNumero(dias, d);
        actualizarNumero(horas, h);
        actualizarNumero(minutos, m);
        actualizarNumero(segundos, s);

        estado.textContent = "Faltan " + d + " días";

        //==================================================
        // PROGRESO
        //==================================================

        const diasTotales = 30; // Cambia este valor si quieres otra escala

        let progreso = ((diasTotales - d) / diasTotales) * 100;

        if (progreso < 0) progreso = 0;
        if (progreso > 100) progreso = 100;

        barra.style.width = progreso + "%";

        porcentaje.textContent = Math.floor(progreso) + "%";

    });

}


/*====================================================
        ANIMACIÓN DE NÚMEROS
====================================================*/

function actualizarNumero(elemento, nuevoValor) {

    nuevoValor = String(nuevoValor).padStart(2, "0");

    if (elemento.textContent !== nuevoValor) {

        elemento.textContent = nuevoValor;

        elemento.classList.remove("update");

        void elemento.offsetWidth;

        elemento.classList.add("update");

    }

}


/*====================================================
        EJECUTAR
====================================================*/

if (eventCards.length > 0) {
    actualizarEventos();
    setInterval(actualizarEventos, 1000);
}


/*====================================================
        GALERÍA DIVISIÓN 4
====================================================*/

const galleryItems = document.querySelectorAll(".gallery-item");

if (galleryItems.length > 0) {

    const observer = new IntersectionObserver((entries) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("visible");

            }

        });

    }, {
        threshold: 0.2
    });

    galleryItems.forEach((item, index) => {

        item.style.transitionDelay = (index * 0.15) + "s";

        observer.observe(item);

    });

}