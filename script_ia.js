const HUGGINGFACE_API_KEY = "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";
const VOICERSS_API_KEY = "1d058c69a21947a19e5532b5aa657be7"; // Remplace ici

const inputText = document.getElementById("inputText");
const fileInput = document.getElementById("fileInput");
const btnProcess = document.getElementById("btnProcess");
const summaryOutput = document.getElementById("summaryOutput");
const btnDownloadPdf = document.getElementById("btnDownloadPdf");
const btnPlayAudio = document.getElementById("btnPlayAudio");
const log = document.getElementById("log");
const btnClearFile = document.getElementById("btnClearFile");
const btnmindmap = document.getElementById("btnmindmap");
const mindMapImage = document.getElementById("mindMapImage");

// Création du bouton de téléchargement audio
const btnDownloadAudio = document.getElementById("btnDownloadAudio");

btnProcess.addEventListener("click", async () => {
  log.textContent = "";
  summaryOutput.value = "";

  if (fileInput.files.length > 0) {
    btnProcess.disabled = true;
    const file = fileInput.files[0];
    const ext = file.name.split(".").pop().toLowerCase();

    try {
      let text = "";
      if (ext === "txt") {
        text = await readTextFile(file);
      } else if (ext === "pdf") {
        text = await extractTextFromPDF(file);
      } else {
        alert("Format non supporté. Choisissez un fichier .txt ou .pdf");
        btnProcess.disabled = false;
        return;
      }

      log.textContent = `Texte extrait (${text.length} caractères). Envoi au résumé...`;
      await summarizeAndDisplay(text);

    } catch (e) {
      log.textContent = "Erreur lors de la lecture du fichier : " + e.message;
    } finally {
      btnProcess.disabled = false;
    }

  } else {
    const text = inputText.value.trim();
    if (!text) {
      alert("Veuillez saisir du texte ou sélectionner un fichier.");
      return;
    }

    btnProcess.disabled = true;
    log.textContent = "Envoi du texte saisi au résumé...";
    try {
      await summarizeAndDisplay(text);
    } catch (e) {
      log.textContent = "Erreur lors du résumé : " + e.message;
    } finally {
      btnProcess.disabled = false;
    }
  }
});

btnProcess2.addEventListener("click", async () => {
  log.textContent = "";
  summaryOutput.value = "";

  if (fileInput.files.length > 0) {
    btnProcess2.disabled = true;
    const file = fileInput.files[0];
    const ext = file.name.split(".").pop().toLowerCase();

    try {
      let text = "";
      if (ext === "txt") {
        text = await readTextFile(file);
      } else if (ext === "pdf") {
        text = await extractTextFromPDF(file);
      } else {
        alert("Format non supporté. Choisissez un fichier .txt ou .pdf");
        btnProcess2.disabled = false;
        return;
      }

      log.textContent = `Texte extrait (${text.length} caractères). Envoi au résumé...`;
      await summarizeAndDisplay2(text);

    } catch (e) {
      log.textContent = "Erreur lors de la lecture du fichier : " + e.message;
    } finally {
      btnProcess2.disabled = false;
    }

  } else {
    const text = inputText.value.trim();
    if (!text) {
      alert("Veuillez saisir du texte ou sélectionner un fichier.");
      return;
    }

    btnProcess2.disabled = true;
    log.textContent = "Envoi du texte saisi au résumé...";
    try {
      await summarizeAndDisplay2(text);
    } catch (e) {
      log.textContent = "Erreur lors du résumé : " + e.message;
    } finally {
      btnProcess2.disabled = false;
    }
  }
});

async function readTextFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Erreur lecture fichier"));
    reader.readAsText(file);
  });
}

async function extractTextFromPDF(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument(new Uint8Array(arrayBuffer)).promise;

  let fullText = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map(item => item.str).join(" ");
    fullText += pageText + "\n\n";
  }
  return fullText.trim();
}

async function summarizeAndDisplay(text) {
  summaryOutput.value = "";
  try {
    const summary = await summarizeText(text);
    summaryOutput.value = summary;
    log.textContent = "Résumé généré avec succès.";
  } catch (e) {
    log.textContent = "Erreur lors du résumé : " + e.message;
  }
}

async function summarizeAndDisplay2(text) {
  summaryOutput.value = "";
  try {
    const summary = await summarizeText2(text);
    summaryOutput.value = summary;
    log.textContent = "Résumé généré avec succès.";
  } catch (e) {
    log.textContent = "Erreur lors du résumé : " + e.message;
  }
}

async function summarizeText(text) {
  const url = "https://api-inference.huggingface.co/models/sshleifer/distilbart-cnn-12-6";
        const textLength = text.length;
const approxTokens = Math.floor(textLength / 4);

const minLengthTokens = Math.max(Math.floor(approxTokens * 0.3), 20);  // minimum 20 tokens
const maxLengthTokens = Math.min(Math.floor(approxTokens * 0.5), 300); // maximum 300 tokens

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      inputs: text,


parameters: {
  min_length: minLengthTokens,
  max_length: maxLengthTokens,
  do_sample: false
}
      // parameters: {
      //  min_length: 120, // augmente la longueur minimale
       // max_length: 300, // limite la longueur maximale
      // do_sample: false // on garde un résumé déterministe
     // } 
    })
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error("Erreur API : " + err);
  }

  const data = await response.json();

  if (Array.isArray(data) && data.length > 0 && data[0].summary_text) {
    return data[0].summary_text;
  } else {
    throw new Error("Résumé non trouvé dans la réponse API.");
  }
}

async function summarizeText2(text) {
  const url = "https://api-inference.huggingface.co/models/sshleifer/distilbart-cnn-12-6";
        const textLength = text.length;
const approxTokens = Math.floor(textLength / 4);

const minLengthTokens = Math.max(Math.floor(approxTokens * 0.1), 20);  // minimum 20 tokens
const maxLengthTokens = Math.min(Math.floor(approxTokens * 0.2), 300); // maximum 300 tokens

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      inputs: text,


parameters: {
  min_length: minLengthTokens,
  max_length: maxLengthTokens,
  do_sample: false
}
      // parameters: {
      //  min_length: 120, // augmente la longueur minimale
       // max_length: 300, // limite la longueur maximale
      // do_sample: false // on garde un résumé déterministe
     // } 
    })
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error("Erreur API : " + err);
  }

  const data = await response.json();

  if (Array.isArray(data) && data.length > 0 && data[0].summary_text) {
    return data[0].summary_text;
  } else {
    throw new Error("Résumé non trouvé dans la réponse API.");
  }
}

btnDownloadPdf.addEventListener("click", () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const text = summaryOutput.value.trim();
  if (!text) {
    alert("Aucun résumé à enregistrer.");
    return;
  }

  const splitText = doc.splitTextToSize(text, 180);
  doc.text(splitText, 10, 10);
  doc.save("resume.pdf");
});

/*btnPlayAudio.addEventListener("click", () => {
  const text = summaryOutput.value.trim();
  if (!text) {
    alert("Aucun résumé à lire.");
    return;
  }
  const utterance = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(utterance);
});*/

btnDownloadAudio.addEventListener("click", async () => {
  const text = summaryOutput.value.trim();
  if (!text) {
    alert("Aucun résumé à convertir.");
    return;
  }

  const url = `https://api.voicerss.org/?key=${VOICERSS_API_KEY}&hl=fr-fr&src=${encodeURIComponent(text)}&c=MP3`;

  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const audioURL = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = audioURL;
    a.download = "resume_audio.mp3";
    a.click();

  } catch (e) {
    console.error("Erreur lors de la création du fichier audio :", e);
    alert("Erreur lors de la génération du fichier audio.");
  }
});

btnClearFile.addEventListener("click", () => {
  fileInput.value = "";
  summaryOutput.value = "";
  log.textContent = "";
  inputText.focus();
  mindMapImage.src = "";
  mindMapImage.style.display = "none";
  
});

btnmindmap.addEventListener("click", () => {
  mindMapImage.src = "mindmap.jpg";
  mindMapImage.style.display = "block";
});

