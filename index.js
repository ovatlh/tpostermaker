//Variables
const canvasDOM = document.getElementById("cnv");
const inputFileDOM = document.getElementById("file");
const sheetWidthDOM = document.getElementById("sheet-width");
const sheetHeightDOM = document.getElementById("sheet-height");
const sheetMarginDOM = document.getElementById("sheet-margin");
const resultWidthDOM = document.getElementById("result-width");
const resultHeightDOM = document.getElementById("result-height");
const resultDOM = document.getElementById("results");
let imgAspectRatio = 0;
let imgWidth = 0;
let imgHeight = 0;
let canvasAspectRatio = 0;
let previewWidth = 0;
let previewHeight = 0;
let previewOffsetX = 0;
let previewOffsetY = 0;
let hojaWidth = 0;
let hojaHeight = 0;
let hojaMargin = 0;
let resultWidth = 0;
let resultHeight = 0;
let hojaWidthPX = 0;
let hojaHeightPX = 0;
let hojaMarginPX = 0;
let posterWidthPX = 0;
let posterHeightPX = 0;
let scaleX = 0;
let scaleY = 0;
let scale = 0;
let scaledImgWidth = 0;
let scaledImgHeight = 0;
let hojasAncho = 0;
let hojasAlto = 0;

//Functions
function fnFitCanvas() {
  canvasDOM.style.width = "100%";
  canvasDOM.style.height = "100%";

  canvasDOM.width = canvasDOM.offsetWidth;
  canvasDOM.height = canvasDOM.offsetHeight;

  canvasAspectRatio = canvasDOM.width / canvasDOM.height;
}

function fnShowImgOnCanvas(inputFile) {
  var ctx = canvasDOM.getContext("2d");
  var img = new Image;
  img.src = URL.createObjectURL(inputFile.files[0]);
  img.onload = function() {
    imgWidth = img.width;
    imgHeight = img.height;
    imgAspectRatio = imgWidth / imgHeight;

    if(imgAspectRatio > canvasAspectRatio) {
      previewWidth = canvasDOM.width;
      previewHeight = canvasDOM.width / imgAspectRatio;
    } else {
      previewWidth = canvasDOM.height * imgAspectRatio;
      previewHeight = canvasDOM.height;
    }

    ctx.clearRect(0, 0, canvasDOM.width, canvasDOM.height);

    previewOffsetX = (canvasDOM.width - previewWidth) / 2;
    previewOffsetY = (canvasDOM.height - previewHeight) / 2;

    ctx.drawImage(img, previewOffsetX, previewOffsetY, previewWidth, previewHeight);

    fnCalcDivisions();
    fnCreateParts(img);
  }
}

function fnUpdateInputValues() {
  hojaWidth = sheetWidthDOM.value;
  hojaHeight = sheetHeightDOM.value;
  hojaMargin = sheetMarginDOM.value;
  resultWidth = resultWidthDOM.value;
  resultHeight = resultHeightDOM.value;

  fnShowImgOnCanvas(inputFileDOM);
}

function fnCM2PX(cm) {
  //96px por pulgada
  //2.54cm por pulgada
  return cm * (96 / 2.54);
}

function fnCalcDivisions() {
  hojaWidthPX = fnCM2PX(hojaWidth - (hojaMargin * 2));
  hojaHeightPX = fnCM2PX(hojaHeight - (hojaMargin * 2));
  hojaMarginPX = fnCM2PX(hojaMargin);
  posterWidthPX = fnCM2PX(resultWidth);
  posterHeightPX = fnCM2PX(resultHeight);
  scaleX = posterWidthPX / imgWidth;
  scaleY = posterHeightPX / imgHeight;
  scale = Math.min(scaleX, scaleY);
  scaledImgWidth = imgWidth * scale;
  scaledImgHeight = imgHeight * scale;
  hojasAncho = Math.ceil(scaledImgWidth / hojaWidthPX);
  hojasAlto = Math.ceil(scaledImgHeight / hojaHeightPX);
}

function fnCreateParts(img) {
  resultDOM.innerHTML = "";

  let hojaNum = 1;
  let hojaTotal = hojasAlto * hojasAncho;

  for (let y = 0; y < hojasAlto; y++) {
    for (let x = 0; x < hojasAncho; x++) {
      const startX = x * hojaWidthPX;
      const startY = y * hojaHeightPX;

      const tempHojaDiv = document.createElement("div");
      tempHojaDiv.style.width = `${hojaWidthPX}px`;
      tempHojaDiv.style.height = `${hojaHeightPX}px`;
      tempHojaDiv.style.position = "relative";
      tempHojaDiv.style.display = "inline-block";
      tempHojaDiv.classList.add("partN");

      const tempHojaNum = document.createElement("p");
      tempHojaNum.style.fontSize = "0.8em";
      tempHojaNum.style.textAlign = "right";
      tempHojaNum.style.position = "absolute";
      tempHojaNum.style.bottom = `${hojaMarginPX / 1.5}px`;
      tempHojaNum.style.right = `${hojaMarginPX / 1.5}px`;
      tempHojaNum.style.color = "black";
      tempHojaNum.innerHTML = `(${hojaNum} / ${hojaTotal}):${x + 1} / ${y + 1}`;

      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = hojaWidthPX - (hojaMarginPX * 2);
      tempCanvas.height = hojaHeightPX - (hojaMarginPX * 2);
      tempCanvas.style.position = "absolute";
      tempCanvas.style.top = `${hojaMarginPX}px`;
      tempCanvas.style.left = `${hojaMarginPX}px`;

      const tempCtx = tempCanvas.getContext("2d");

      tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
      tempCtx.drawImage(
        img, 
        startX / scale,
        startY / scale,
        hojaWidthPX / scale,
        hojaHeightPX / scale,
        0,
        0,
        tempCanvas.width,
        tempCanvas.height
      );

      tempHojaDiv.appendChild(tempCanvas);
      tempHojaDiv.appendChild(tempHojaNum);
      resultDOM.appendChild(tempHojaDiv);
      hojaNum++;
    }
  }
}

function fnDOMToBase64(dom) {
  var img = "";

  domtoimage.toPng(dom).then(function(dataUrl) {
    img = dataUrl;

    return img;
  });
}

let totalPages = 0;
let totalPagesCompleted = 0;
let pdf;
function fnPDFDownload() {
  if(totalPagesCompleted >= totalPages) {
    pdf.save("poster.pdf");
  }
}

function fnDownload() {
  pdf = new window.jspdf.jsPDF({
    unit: "cm",
    format: [hojaWidth, hojaHeight],
  });

  totalPages = resultDOM.children.length;

  for (let index = 0; index < totalPages; index++) {
    const element = resultDOM.children[index];

    domtoimage.toPng(element).then(function(dataUrl) {
      const imgTemp = new Image();
      imgTemp.src = dataUrl;

      pdf.addImage(
        imgTemp,
        "PNG",
        0,
        0,
        hojaWidth,
        hojaHeight
      );
      totalPagesCompleted++;

      if(totalPagesCompleted < totalPages) {
        pdf.addPage();
      }

      fnPDFDownload();
    });
  }
}

//Start
fnFitCanvas();
fnUpdateInputValues();

window.onresize = () => {
  fnFitCanvas();
  fnShowImgOnCanvas(inputFileDOM);
}
