const URL = "../model/";

let model, webcam, labelContainer, maxPredictions;

// Carregando o modelo de imagem e configurando a webcam
async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // Carregando o modelo e os metadados e referindo para a função na API para suportar arquivos de um arquivo 
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Instanciando funçãp para configurar a webcam
    const flip = true; 
    webcam = new tmImage.Webcam(300, 300, flip); 

    // Requisição de acesso para a webcam
    await webcam.setup(); 
    await webcam.play();
    window.requestAnimationFrame(loop);

    // Acrescentando os elementos no DOM
    document.getElementById("webcam-container").appendChild(webcam.canvas);
    labelContainer = document.getElementById("label-container");

    for (let i = 0; i < maxPredictions; i++) { 
        labelContainer.appendChild(document.createElement("div"));
    }
}

async function loop() {
    // Atualizando a webcam
    webcam.update(); 
    await predict();
    window.requestAnimationFrame(loop);
}

// Função de rodar a webcam afim de classificar a imagem atrvés do modelo de imagens
async function predict() {
    // Conseguir a predição da imagem 
    const prediction = await model.predict(webcam.canvas);
    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction =
            prediction[i].className + ": " + prediction[i].probability.toFixed(2);
        labelContainer.childNodes[i].innerHTML = classPrediction;
    }
}