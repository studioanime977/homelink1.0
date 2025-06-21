
const openaiAPIKey = 'YOUR_OPENAI_API_KEY';

// Función para hacer una solicitud a la API de OpenAI
async function getAIResponse(inputText) {
    const response = await fetch('https://api.openai.com/v1/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openaiAPIKey}`,
        },
        body: JSON.stringify({
            model: 'gpt-4.1',
            prompt: inputText,
            max_tokens: 100,
            temperature: 0.7,
        }),
    });

    const data = await response.json();
    return data.choices[0].text.trim();
}

// Función para obtener la IP (solo IPv4)
async function getIP() {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
}

// Mostrar la IP en el cuerpo de la página
async function displayIP() {
    const ip = await getIP();
    // El código relacionado con la IP ha sido eliminado.
    ipElement.innerText = `Tu IP actual: ${ip}`;
}

// Alerta que desaparece después de 6 segundos
function showAlert() {
    const alertElement = document.createElement('div');
    alertElement.classList.add('alert');
    alertElement.innerText = 'Cargando la página...';
    document.body.appendChild(alertElement);

    setTimeout(() => {
        alertElement.style.display = 'none';
        window.location.href = 'servicios.html'; // Redirigir a la página principal
    }, 6000); // La alerta desaparece después de 6 segundos
}

// Llamar a la función para mostrar la alerta al cargar la página
window.onload = function() {
    showAlert();
    displayIP();
};
