document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-registro");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const datos = {
      campoApe: document.getElementById("campoApe").value,
      campoNom: document.getElementById("campoNom").value,
      selectSex: document.getElementById("selectSex").value,
      campoFec: document.getElementById("campoFec").value,
      campoTel: document.getElementById("campoTel").value,
      campoDir: document.getElementById("campoDir").value,
      campoBar: document.getElementById("campoBar").value,
      campoMai: document.getElementById("campoMai").value,
      campoPas: document.getElementById("campoPas").value,
    };

    try {
      const res = await fetch("/registro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datos),
      });

      const msg = await res.text();
      alert(msg);
      form.reset();
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un error al registrar el usuario.");
    }
  });
});
