/**
 * Personal Docente: estructura de datos y filtros por sede/área.
 * Agrega aquí cada docente autorizado por la institución. Forma esperada:
 * { name, email, sede: "principal"|"san-miguel"|"arenal", areas: ["ciencias-basicas", ...] }
 */

const TEACHERS = [
    // Sin registros todavía: la institución debe confirmar los datos a publicar.
];

const SEDES = {
    principal: "Sede Principal",
    "san-miguel": "Sede San Miguel",
    arenal: "Sede Arenal",
};

const AREAS = {
    "ciencias-basicas": "Ciencias básicas",
    "matematicas": "Matemáticas",
    "humanidades": "Humanidades y lengua castellana",
    "ingles": "Inglés",
    "ciencias-sociales": "Ciencias sociales",
    "tecnologia": "Tecnología e informática",
    "artistica": "Educación artística",
    "educacion-fisica": "Educación física",
    "etica-religion": "Ética, valores y religión",
    "primaria": "Primaria / multigrado",
};

const state = { sede: "all", area: "all" };

function teacherCard(teacher) {
    const areas = teacher.areas.map((a) => AREAS[a] || a).join(", ");
    return `
        <article class="card teacher-card">
            <div class="teacher-avatar" aria-hidden="true"><i class="fa fa-user"></i></div>
            <h3>${teacher.name}</h3>
            <span class="badge badge--academic">${SEDES[teacher.sede] || teacher.sede}</span>
            <p class="teacher-areas">${areas}</p>
            <a href="mailto:${teacher.email}" class="teacher-email">
                <i class="fa fa-envelope" aria-hidden="true"></i> ${teacher.email}
            </a>
        </article>
    `;
}

function render() {
    const grid = document.getElementById("teachersGrid");
    const emptyState = document.getElementById("teachersEmpty");
    if (!grid) return;

    const filtered = TEACHERS.filter((t) => {
        const matchesSede = state.sede === "all" || t.sede === state.sede;
        const matchesArea = state.area === "all" || t.areas.includes(state.area);
        return matchesSede && matchesArea;
    });

    grid.innerHTML = filtered.map(teacherCard).join("");
    grid.hidden = filtered.length === 0;
    if (emptyState) emptyState.hidden = filtered.length > 0;
}

document.querySelectorAll("[data-sede-filter]").forEach((btn) => {
    btn.addEventListener("click", () => {
        document.querySelectorAll("[data-sede-filter]").forEach((b) => b.setAttribute("aria-pressed", "false"));
        btn.setAttribute("aria-pressed", "true");
        state.sede = btn.dataset.sedeFilter;
        render();
    });
});

const areaSelect = document.getElementById("areaFilter");
areaSelect?.addEventListener("change", () => {
    state.area = areaSelect.value;
    render();
});

render();
