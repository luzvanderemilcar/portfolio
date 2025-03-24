// trouver la hauteur de l'element header (la barre de navigation  comprise)
function getHeaderOffset() {
  let headerElement = document.querySelector("header");
  return headerElement.offsetHeight;
}
// Required input | champs de rentrée obligatoire 
const champsObligatoires = document.querySelectorAll(".required-input,textar");

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
const liensInternes = document.querySelectorAll(".internal-link");
const documentSections = document.querySelectorAll(".internal-target");


// ajouter un listener pour les clicks sur les liens internes
liensInternes.forEach(elementLien => {
  elementLien.addEventListener("click", gererClickLienInterne)
});

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


function removeNavBarActive() {
  let navBarLinks = document.querySelectorAll(".navbar-link");
  navBarLinks.forEach(link => {
    // remove active class from the active element
    link.classList.contains('active') && link.classList.remove('active');
  })
}

function addNavBarActive(id) {
  let targetElement = document.querySelector(`.navbar-link[href="#${id}"]`);
  !targetElement.classList.contains('active') && targetElement.classList.add("active");
}

function setActive(id) {
  if (id) {
  // remove current active
  removeNavBarActive();
  // add active to element with href id
  addNavBarActive(id);
  } else {
    console.log("Check the ids to target");
  }
}

let headerElement = document.querySelector("#contact");

// Sections 
let tTimeout;
let scrollDelaySeconds = .5;

document.addEventListener("scroll", (e) => {
  // debounce the scroll actions for the active element setting
  if (tTimeout) clearTimeout(tTimeout);
  tTimeout = setTimeout(() => {
    // find the active section at scrollend
    let activeSectionId = getActiveElementId(documentSections, getHeaderOffset());
    
    setActive(activeSectionId)
  }, scrollDelaySeconds * 1000);
});

// find the active element id prioritizing the element whose top is inside the viewport
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


// find if an element's top is currently inside the viewport 
function isTopInView(element, topOffsetHeight = 0) {
  let { height, width, y: distanceFromTop, x: distanceFromLeft } = getElementPositions(element);
  // ratio of the height of the visible part of an element in the viewport for it to be considered as active
  let ratioMinInViewToBeActive = .6;
  
  // the y (top start position) of the element is positive and greater than a specific top offset but fewer than the height of the viewport 
  if (distanceFromTop >= topOffsetHeight && distanceFromTop < window.innerHeight * (1 - ratioMinInViewToBeActive)) {
    if (distanceFromLeft < window.innerWidth || (distanceFromLeft + width) > 0) {
      return true;
    }
  }
  // default return 
  return false;
}

// find if an element's body is currently inside the viewport 
function isBodyInView(element, topOffsetHeight = 0) {
  let { height, width, y: distanceFromTop, x: distanceFromLeft } = getElementPositions(element);
  
  // the y of the element is negative or fewer than a specific top offset 
  if (distanceFromTop < topOffsetHeight && (distanceFromTop + height) > topOffsetHeight) {
    if (distanceFromLeft < window.innerWidth || (distanceFromLeft + width) > 0) {
      return true;
    }
  }
  // default return 
  return false;
}
// find the positions of an element
function getElementPositions(element) {
  let elementClientRects = element.getClientRects()[0];
  return elementClientRects;
}