let goTopButtonElement;
// trouver la hauteur de l'element header (la barre de navigation  comprise)
function getHeaderOffset() {
  let headerElement = document.querySelector("header");
  return headerElement.offsetHeight;
}
// Required input | champs de rentrée obligatoire 
const champsObligatoires = document.querySelectorAll(".required-input");

// attach
champsObligatoires.forEach(elementEntree => {
  elementEntree.addEventListener("blur", gererEntreeVide);
});

function gererEntreeVide(e) {
  let elementEntree = e.target;
  
  // tester si la valeur de l'entrée est vide
  if (elementEntree.value.trim() === "") {
    // demander à l'utilisateur de confirmer sa sortie
    if (!confirm("Remplir ce champ est obligatoire !\nVoulez vous quitter le champ ?")) {
      elementEntree.focus();
    }
  }
}

// liens internes et target internes
const liensInternes = document.querySelectorAll('.internal-link,[href^="#"]:not([href$="#"])');
const documentSections = document.querySelectorAll(".internal-target");


// ajouter un listener pour les clicks sur les liens internes
liensInternes.forEach(elementLien => {
  elementLien.addEventListener("click", gererClickLienInterne);
});

// Sections 
let tTimeout;
let scrollDebounceDelaySeconds = .5;
let hasScrolledDown = false;
let isScrolling = false;
let lastKnownYPosition = window.scrollY;

document.addEventListener("scroll", (e) => {
  // regarder s'il y a scroll vers le bas
  hasScrolledDown = lastKnownYPosition < window.scrollY;
  lastKnownYPosition = window.scrollY;
  
  // si l'ecran est glisse vers le bas ou la valueur du glissement est plus petite que la hauteur de l'ecran
  if (hasScrolledDown || window.scrollY < window.innerHeight) {
    hideElement(goTopButtonElement)
  } else {
    showElement(goTopButtonElement);
  }
  // différer(debounce) l'action de fixation de l'élément actif
  if (tTimeout) clearTimeout(tTimeout);
  tTimeout = setTimeout(() => {
    scrollDebounceActions();
  }, scrollDebounceDelaySeconds * 1000);
  
  //
  isScrolling = true;
});


document.addEventListener("scrollend", () => {
  isScrolling = false;
});

// gererClickLienInterne
function gererClickLienInterne(e) {
  e.preventDefault();
  let elementLien = e.target;
  
  let targetSelector = elementLien.getAttribute("href");
  // élément ciblé par le lien
  const targetElement = document.querySelector(targetSelector);
  
  const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - getHeaderOffset();
  // défiler la fenêtre vers la position ciblée
  window.scrollTo({ top: targetPosition, behavior: 'smooth' });
  // set active
  setActive(targetSelector.substring(1))
  
}

// Sélectionner les actions avec le class primary ou primary-outline 
let primaryActions = document.querySelectorAll(".primary,.primary-outline");

// ajouter un listener pour les clicks sur ces actions
primaryActions.forEach(primaryAction => {
  primaryAction.addEventListener("click", gereClickPrimaryAction);
});


// ajouter un listener pour un click en dehors d'un lien ou button initialement clické
primaryActions.forEach(primaryAction => {
  primaryAction.addEventListener("blur", gererBlurPrimaryAction);
});


function gereClickPrimaryAction(e) {
  let primaryAction = e.target;
  
  if (primaryAction.classList.contains("primary") || primaryAction.classList.contains("primary-outline")) {
    if (!primaryAction.classList.contains("clicked")) primaryAction.classList.add("clicked")
  }
}


function gererBlurPrimaryAction(e) {
  
  let primaryAction = e.target;
  
  if (primaryAction.classList.contains("primary") || primaryAction.classList.contains("primary-outline")) {
    if (primaryAction.classList.contains("clicked")) primaryAction.classList.remove("clicked")
  }
}

function scrollDebounceActions() {
  // trouver la section active à la fin d'un scroll 
  let activeSectionId = getActiveElementId(documentSections, getHeaderOffset());
  setActive(activeSectionId);
}

// trouver l'id de l'élément actif, priorité donnée à celui qui se commence dans le viewport
function getActiveElementId(elements, topOffsetHeight) {
  let activeElementId;
  let index = 0;
  
  // tester l'element dont le top se trouve dans le viewport
  while (!activeElementId && index < elements.length) {
    if (isTopInView(elements[index], topOffsetHeight)) {
      activeElementId = elements[index].getAttribute('id');
    }
    index++;
  }
  // tester si aucun des elements ne se commence dans le viewport
  if (!activeElementId) {
    index = 0;
    // tester l'element dont le corps se trouve dans le viewport
    while (!activeElementId && index < elements.length) {
      if (isBodyInView(elements[index], topOffsetHeight)) {
        activeElementId = elements[index].getAttribute('id');
      }
      index++;
    }
  }
  // return l'attribut id de l'element active
  return activeElementId;
}

//set the active element 
function setActive(id) {
  if (id) {
    // retirer la classe active de l'élément (le cas échéant)
    removeNavBarActive();
    // ajouter la classe active à l'élément référençant id
    addNavBarActive(id);
  } else {
    console.log("Check the ids to target");
  }
}

function removeNavBarActive() {
  let navBarLinks = document.querySelectorAll(".navbar-link");
  navBarLinks.forEach(link => {
    // retirer la classe active d'un élément ayant cette classe
    link.classList.contains('active') && link.classList.remove('active');
  })
}

//ajouter la classe active à un element qui référence l'id spécifié 
function addNavBarActive(id) {
  let targetElement = document.querySelector(`.navbar-link[href="#${id}"]`);
  !targetElement.classList.contains('active') && targetElement.classList.add("active");
}

// trouver si le debut de l'element est actuellement dans le viewport
function isTopInView(element, topOffsetHeight = 0) {
  let { height, width, y: distanceFromTop, x: distanceFromLeft } = getElementPositions(element);
  
  //ratio de la partie du viewport occupé par un élément pour être considéré comme actif
  let ratioMinInViewToBeActive = .6;
  
  // le y ( la position debut ou top ) est positive et plus grand que l'offset top de la page, mais plus petit que la hauteur de la hauteur de la page par le complément du ratio
  if (distanceFromTop >= topOffsetHeight && distanceFromTop < window.innerHeight * (1 - ratioMinInViewToBeActive)) {
    if (distanceFromLeft < window.innerWidth || (distanceFromLeft + width) > 0) {
      return true;
    }
  }
  // return par défaut 
  return false;
}

// trouver si le corps d'un element est dans le viewport alors que son debut est scrolle
function isBodyInView(element, topOffsetHeight = 0) {
  let { height, width, y: distanceFromTop, x: distanceFromLeft } = getElementPositions(element);
  
  // le y ( la position debut ou top ) est négative et la somme de son y et de sa hauteur est plus grand que l'offset top de la page
  if (distanceFromTop < topOffsetHeight && (distanceFromTop + height) > topOffsetHeight) {
    if (distanceFromLeft < window.innerWidth || (distanceFromLeft + width) > 0) {
      return true;
    }
  }
  // return par défaut 
  return false;
}
// trouver les positionnements d'un élément 
function getElementPositions(element) {
  let elementClientRects = element.getClientRects()[0];
  return elementClientRects;
}

// show or hide the an element by toggling the class hidden based on display css property
function showElement(element) {
  if (element.classList.contains("hidden")) element.classList.remove("hidden")
}

function hideElement(element) {
  if (!element.classList.contains("hidden")) element.classList.add("hidden")
}

// Bar de compétences (selections)
const barCompetences = document.querySelectorAll(".skill");

const infoBox = document.querySelector("#info-box");

function configurerInfoBox({ top, left, text }) {
  // customize the info box position and details
  infoBox.style.top = top;
  infoBox.style.left = left;
  infoBox.innerText = text;
  
  // show the info box
  showInfoBox();
}

// show or hide the info box element by toggling the class visible based on opacity level
function showInfoBox() {
  if (!infoBox.classList.contains("visible")) infoBox.classList.add("visible")
}

function hideInfoBox() {
  if (infoBox.classList.contains("visible")) infoBox.classList.remove("visible")
}

// add the class highlight to an element passed as argument
function highlightElement(element) {
  if (!element.classList.contains("highlight")) element.classList.add("highlight")
}

// remove the class highlight from an element passed as argument
function removeElementHighlight(element) {
  if (element.classList.contains("highlight")) element.classList.remove("highlight")
}

// Long press event configurations
const longPressThreshold = 500; // milliseconds
let pressTimer = null;
let clearHighlightTimer = null;
let infoBoxTopOffset = -70;
let infoBoxLeftOffset = 10;

let lastSkillElement;

barCompetences.forEach(element => {
  // Mouse events
  element.addEventListener('mousedown', startPressTimer);
  element.addEventListener('mouseup', cancelPressTimer);
  element.addEventListener('mouseleave', cancelPressTimer);
  
  // Touch events
  element.addEventListener('touchstart', startPressTimer);
  element.addEventListener('touchend', cancelPressTimer);
  element.addEventListener('touchcancel', cancelPressTimer);
  
});

function startPressTimer(e) {
  
  // check if a previous skill element has highlight 
  if (clearHighlightTimer && lastSkillElement) {
    // clear the remove highlight timer;
    clearTimeout(clearHighlightTimer);
    clearHighlightTimer = null;
    
    // remove highlight immediately 
    hideInfoBox();
    removeElementHighlight(lastSkillElement);
  }
  // Long press detection using the duration of the touch and a timeout.
  pressTimer = setTimeout(() => {
    
    // check if the document is not under scroll 
    if (!isScrolling) {
      
      // find the skill element under pressure 
      let skillElement = e.target.findClosestParent(".skill");
      lastSkillElement = skillElement;
      
      let skillTextElement = skillElement.querySelector("p.nom");
      
      let leverElement = skillElement.querySelector(".leveler");
      // the element that fills the skill bar according to is width
      let fillerElement = skillElement.querySelector(".filler");
      
      // Evaluate the percentage of the skill filler element width 
      let skillPercent = Math.round(100 * fillerElement.offsetWidth / leverElement.offsetWidth);
      
      // find the dimensions of the filler element
      let fillerElementDimensions = fillerElement.getBoundingClientRect();
      
      // format an options object that holds the details of configuration for the info box
      let options = {};
      options.top = `${window.scrollY + fillerElementDimensions.y + infoBoxTopOffset}px`;
      options.left = `${window.scrollX + fillerElementDimensions.x + fillerElementDimensions.width - infoBoxLeftOffset}px`;
      options.text = skillPercent + "%";
      
      // highlight the skill element under touch 
      highlightElement(skillElement);
      // set the position and data of the box
      configurerInfoBox(options);
    }
  }, longPressThreshold);
}

function cancelPressTimer(e) {
  
  // check if there is a timer set
  if (pressTimer) {
    clearTimeout(pressTimer);
    pressTimer = null;
    
    let skillElement = lastSkillElement //e.target.findClosestParent(".skill");
    
    clearHighlightTimer = setTimeout(() => {
      hideInfoBox();
     if (skillElement) removeElementHighlight(skillElement);
    }, 1000);
  }
}

// To top button
addGoTopButton();

function addGoTopButton() {
  let targetElementId = "accueil";
  
  let goTopButton = document.createElement('button');
  goTopButton.innerHTML = 'Go Top';
  goTopButton.classList.add("go-top", 'primary-outline', 'hidden');
  //set the target element id
  goTopButton.setAttribute("href", "#" + targetElementId);
  goTopButton.onclick = gererClickLienInterne;
  goTopButton.onblur = gererBlurPrimaryAction;
  goTopButtonElement = goTopButton;
  document.body.appendChild(goTopButton);
}

// define a method on HTMLElement class
// it's intended to find the closest parent of an element that matches a specific selector given as an argument 
// returns the element if it matches the selector, its closest parent that matches the selector or undefined if no match
HTMLElement.prototype.findClosestParent =
  function(selector) {
    
    // if the element or one of its parents matches the selector
    if (this.closest(selector)) {
      // if the element matches the criteria itself
      if (this.matches(selector)) {
        return this;
      } else {
        let mainElement = this;
        let parentElement;
        
        do {
          // find the element parent
          parentElement = mainElement.parentElement;
          
          // check if the parent matches the selector 
          if (parentElement.matches(selector)) {
            return parentElement;
          }
          else {
            // reassigning the parentElement as the next element to process (skip recursive statements)
            mainElement = parentElement;
          }
        }
        while (!parentElement.matches(selector))
      }
    }
  }