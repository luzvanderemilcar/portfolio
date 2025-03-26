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
    // retirer la classe active d'un élément ayant cette classe
    link.classList.contains('active') && link.classList.remove('active');
  })
}

//ajouter la classe active à un element qui référence l'id spécifié 
function addNavBarActive(id) {
  let targetElement = document.querySelector(`.navbar-link[href="#${id}"]`);
  !targetElement.classList.contains('active') && targetElement.classList.add("active");
}

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
// Sections 
let tTimeout;
let scrollDelaySeconds = .5;

document.addEventListener("scroll", (e) => {
  // différer(debounce) l'action de fixation de l'élément actif
  if (tTimeout) clearTimeout(tTimeout);
  tTimeout = setTimeout(() => {
    // trouver la section active à la fin d'un scroll 
    let activeSectionId = getActiveElementId(documentSections, getHeaderOffset());
    
    setActive(activeSectionId)
  }, scrollDelaySeconds * 1000);
});

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