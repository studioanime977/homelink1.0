document.addEventListener("DOMContentLoaded", () => {
  const userSession = JSON.parse(localStorage.getItem("userSession"));
  const elementosProtegidos = document.querySelectorAll(".solo-logueados");
  const botonCerrar = document.getElementById("cerrarSesion");

  if (!userSession || !userSession.isLoggedIn) {
    elementosProtegidos.forEach(el => el.style.display = "none");
  } else {
    elementosProtegidos.forEach(el => el.style.display = "block");
    const saludo = document.createElement("p");
    saludo.textContent = `👋 Bienvenido, ${userSession.name}`;
    saludo.className = "text-right text-sm p-2";
    document.body.prepend(saludo);
  }

  if (botonCerrar) {
    botonCerrar.addEventListener("click", () => {
      localStorage.removeItem("userSession");
      window.location.href = "login.html";
    });
  }
});
