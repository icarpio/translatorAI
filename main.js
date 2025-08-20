const API_URL = "https://translatorai-5t87.onrender.com/api5/traducir/";
const API_SAVE_URL = "https://translatorai-5t87.onrender.com/api5/save/";

let ultimasTraducciones = {}; // Para almacenar las traducciones actuales

document.getElementById('traducirBtn').addEventListener('click', async () => {
  const texto = document.getElementById('texto').value.trim();
  if(!texto) return alert("Escribe un texto");

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texto })
    });

    const data = await response.json();
    if(data.error) return alert(data.error);

    // Mostrar traducciones
    document.getElementById('traduccion-espanol').textContent = data.traducciones.español;
    document.getElementById('traduccion-ingles').textContent = data.traducciones.ingles;
    document.getElementById('traduccion-italiano').textContent = data.traducciones.italiano;

    // Guardamos temporalmente las traducciones
    ultimasTraducciones = data.traducciones;

    // Mostrar botón de guardar si aún no existe
    if (!document.getElementById('guardarBtn')) {
    const contenedor = document.createElement('div');
    contenedor.className = "text-center mt-3"; // Centrado y margen superior

    const btn = document.createElement('button');
    btn.id = "guardarBtn";
    btn.className = "btn btn-success btn-lg";
    btn.textContent = "💾 Guardar traducciones";
    btn.addEventListener('click', guardarTraducciones);

    contenedor.appendChild(btn);           // Añadimos el botón al contenedor
    document.querySelector('.container').appendChild(contenedor); // Añadimos contenedor al DOM
    }

  } catch (err) {
    console.error(err);
    alert("Error al traducir");
  }
});

function leerTexto(idElemento, lang) {
  const elemento = document.getElementById(idElemento);
  if (!elemento) return console.error("Elemento no encontrado:", idElemento);

  const texto = elemento.textContent.trim();
  if(!texto) return console.warn("El texto está vacío:", idElemento);

  const utterance = new SpeechSynthesisUtterance(texto);
  utterance.lang = lang;
  speechSynthesis.speak(utterance);
}

async function guardarTraducciones() {
  const textoOriginal = document.getElementById('texto').value.trim();
  if (!textoOriginal || !ultimasTraducciones) return alert("No hay traducciones para guardar");

  try {
    const response = await fetch(API_SAVE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texto_original: textoOriginal, traducciones: ultimasTraducciones })
    });

    const data = await response.json();
    if(data.error) return alert(data.error);

    alert(data.mensaje || "Traducciones guardadas correctamente");
  } catch (err) {
    console.error(err);
    alert("Error al guardar traducciones");
  }
}
