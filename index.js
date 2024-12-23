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
let scaleXPX = 0;
let scaleYPX = 0;
let scalePX = 0;
let scaledImgWidthPX = 0;
let scaledImgHeightPX = 0;
let hojasAnchoPX = 0;
let hojasAltoPX = 0;

let fHojaWidth = 0;
let fHojaHeight = 0;
let fHojaMargin = 0;
let fPosterWidth = 0;
let fPosterHeight = 0;
let fScaleX = 0;
let fScaleY = 0;
let fScale = 0;
let fScaledImgWidth = 0;
let fScaledImgHeight = 0;
let fHojasAncho = 0;
let fHojasAlto = 0;

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

    fnCalcDivisionsPX();
    //fnCalcDivisions();
    fnCreatePartsPX(img);
    //fnCreateParts(img);
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
  //return cm * (96 / 2.54);
  // return cm * (Detector.dpi / 2.54);
  return Detector.dpi * (cm / 2.54);
}

function fnCM2PXV2(cm) {
  return cm * (Detector.dpi / 2.54);
}

function fnCalcDivisionsPX() {
  hojaWidthPX = fnCM2PX(hojaWidth - (hojaMargin * 2));
  hojaHeightPX = fnCM2PX(hojaHeight - (hojaMargin * 2));
  hojaMarginPX = fnCM2PX(hojaMargin);
  posterWidthPX = fnCM2PX(resultWidth);
  posterHeightPX = fnCM2PX(resultHeight);
  scaleXPX = posterWidthPX / imgWidth;
  scaleYPX = posterHeightPX / imgHeight;
  scalePX = Math.min(scaleXPX, scaleYPX);
  scaledImgWidthPX = imgWidth * scalePX;
  scaledImgHeightPX = imgHeight * scalePX;
  hojasAnchoPX = Math.ceil(scaledImgWidthPX / hojaWidthPX);
  hojasAltoPX = Math.ceil(scaledImgHeightPX / hojaHeightPX);
}

function fnCalcDivisions() {
  fHojaWidth = hojaWidth;
  fHojaHeight = hojaHeight;
  fHojaMargin = hojaMargin;
  fPosterWidth = resultWidth;
  fPosterHeight = resultHeight;
  fScaleX = fPosterWidth / imgWidth;
  fScaleY = fPosterHeight / imgHeight;
  fScale = Math.min(fScaleX, fScaleY);
  fScaledImgWidth = imgWidth * fScaleX;
  fScaledImgHeight = imgHeight * fScaleY;
  fHojasAncho = Math.ceil(fScaledImgWidth / fHojaWidth);
  fHojasAlto = Math.ceil(fScaledImgHeight / fHojaHeight);
}

function fnCreatePartsPX(img) {
  resultDOM.innerHTML = "";

  let hojaNum = 1;
  let hojaTotal = hojasAltoPX * hojasAnchoPX;

  for (let y = 0; y < hojasAltoPX; y++) {
    for (let x = 0; x < hojasAnchoPX; x++) {
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
        startX / scalePX,
        startY / scalePX,
        hojaWidthPX / scalePX,
        hojaHeightPX / scalePX,
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

function fnCreateParts(img) {
  resultDOM.innerHTML = "";

  let hojaNum = 1;
  let hojaTotal = fHojasAlto * fHojasAncho;

  for (let y = 0; y < fHojasAlto; y++) {
    for (let x = 0; x < fHojasAncho; x++) {
      const startX = x * fHojaWidth;
      const startY = y * fHojaHeight;

      const tempHojaDiv = document.createElement("div");
      tempHojaDiv.style.width = `${fHojaWidth}cm`;
      tempHojaDiv.style.height = `${fHojaHeight}cm`;
      tempHojaDiv.style.position = "relative";
      tempHojaDiv.style.display = "inline-block";
      tempHojaDiv.classList.add("partN");

      const tempHojaNum = document.createElement("p");
      tempHojaNum.style.fontSize = "0.5cm";
      tempHojaNum.style.textAlign = "right";
      tempHojaNum.style.position = "absolute";
      tempHojaNum.style.bottom = `${fHojaMargin / 2}cm`;
      tempHojaNum.style.right = `${fHojaMargin / 2}cm`;
      tempHojaNum.style.color = "black";
      tempHojaNum.innerHTML = `(${hojaNum} / ${hojaTotal}):${x + 1} / ${y + 1}`;

      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = fnCM2PXV2(fHojaWidth - (fHojaMargin * 2));
      tempCanvas.height = fnCM2PXV2(fHojaHeight - (fHojaMargin * 2));
      tempCanvas.style.position = "absolute";
      tempCanvas.style.top = `${fHojaMargin}cm`;
      tempCanvas.style.left = `${fHojaMargin}cm`;

      const tempCtx = tempCanvas.getContext("2d");

      tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
      tempCtx.drawImage(
        img,
        startX / fScale,
        startY / fScale,
        fHojaWidth / fScale,
        fHojaHeight / fScale,
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

function fnDownloadPX() {
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

function fnDownload() {
  pdf = new window.jspdf.jsPDF({
    unit: "cm",
    format: [fHojaWidth, fHojaHeight],
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
        fHojaWidth,
        fHojaHeight
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
  fnUpdateInputValues();
}
