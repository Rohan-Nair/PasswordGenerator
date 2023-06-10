const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbolsString = "!#$%&'()*+,-./:;<=>?@[]^_`{|}~";

let password = "";
let passwordLength = 8;
let checkCount = 0;
handleSlider();
// setting strength circle color to grey

//functions list
// slider move causes number to change
// copy button copies the generated password
// set indicator (changing color or strength circle)

/*
// generate password
// getRandomInteger (min, max)
// getRandomLowercase 
// getRandomUpperCase
// getRandomSymbol
*/

// setting password length
function handleSlider() {
  inputSlider.value = passwordLength;
  lengthDisplay.innerText = passwordLength;
}

function setIndicator(color) {
  indicator.style.backgroundColor = color;
  // shadow
  const bgc = color;
  indicator.style.boxShadow = `0px 0px 5px ${bgc}`;
}

// password generating functions
function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
  return getRandomInteger(0, 9);
}

function generateLowerCase() {
  return String.fromCharCode(getRandomInteger(97, 123));
}

function generateUppercase() {
  return String.fromCharCode(getRandomInteger(65, 91));
}

function generateSymbol() {
  const randNum = getRandomInteger(0, symbolsString.length);
  return symbolsString.charAt(randNum);
}

function calcStrength() {
  let wantsUpper = false;
  let wantsLower = false;
  let wantsNum = false;
  let wantsSym = false;

  // checking which checkboxes are ticked
  if (uppercaseCheck.checked) wantsUpper = true;
  if (lowercaseCheck.checked) wantsLower = true;
  if (numbersCheck.checked) wantsNum = true;
  if (symbolsCheck.checked) wantsSym = true;

  if (
    wantsLower &&
    wantsLower &&
    (wantsNum || wantsSym) &&
    passwordLength >= 8
  ) {
    setIndicator("#0f0");
  } else if (
    (wantsLower || wantsUpper) &&
    (wantsNum || wantsSym) &&
    passwordLength >= 6
  ) {
    setIndicator("#ff0");
  } else {
    setIndicator("#f00");
  }
}

async function copyContent() {
  try {
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerText = "Copied";
  } catch (e) {
    copyMsg.innerText = "Failed";
  }

  // to make the copy span visible / invisible
  copyMsg.classList.add("active");
  setTimeout(() => {
    copyMsg.classList.remove("active");
  }, 2000);
}

function shufflePassword(array) {
  // Fisher Yates Method
  // used to shuffle an array
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  let str = "";
  array.forEach((el) => (str += el));
  return str;
}

function handleCheckboxChange() {
  checkCount = 0;
  allCheckBox.forEach((checkbox) => {
    if (checkbox.checked) {
      checkCount++;
    }
  });

  // special case
  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }
}

allCheckBox.forEach((checkbox) => {
  checkbox.addEventListener("change", handleCheckboxChange);
});

inputSlider.addEventListener("input", (e) => {
  passwordLength = e.target.value;
  handleSlider();
});

copyBtn.addEventListener("click", () => {
  if (passwordDisplay.value) {
    copyContent();
  }
});

generateBtn.addEventListener("click", () => {
  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }

  // if length and requirements are not
  if (checkCount == 0) {
    uppercaseCheck.checked = true;
    lowercaseCheck.checked = true;
    numbersCheck.checked = true;
    symbolsCheck.checked = true;
    passwordLength = 10;
    handleSlider();
  }

  password = "";

  let funcArr = [];
  if (uppercaseCheck.checked) {
    funcArr.push(generateUppercase);
  }
  if (lowercaseCheck.checked) {
    funcArr.push(generateLowerCase);
  }
  if (numbersCheck.checked) {
    funcArr.push(generateRandomNumber);
  }
  if (symbolsCheck.checked) {
    funcArr.push(generateSymbol);
  }

  for (let i = 0; i < funcArr.length; i++) {
    password += funcArr[i]();
  }

  for (let i = 0; i < passwordLength - funcArr.length; i++) {
    let randIdx = getRandomInteger(0, funcArr.length);
    password += funcArr[randIdx]();
  }

  // shuffling the password
  password = shufflePassword(Array.from(password));

  passwordDisplay.value = password;

  // calc strength
  calcStrength();
});
