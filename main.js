// trouver la hauteur de l'element header (la barre de navigation  comprise)
function getHeaderOffset() {
  let headerElement = document.querySelector("header");
  return headerElement.offsetHeight;
}
// Required input | champs de rentrée obligatoire 
const champsObligatoires = document.querySelectorAll("input[type='text'][required],textarea[required]");

// attach
champsObligatoires.forEach(elementEntree => {
  elementEntree.addEventListener("blur", gererEntreeVide);
});

function gererEntreeVide(e) {
  let elementEntree = e.target;
  
  // tester si la valeur de l'entrée est vide
  if (elementEntree.value.trim() === "") {
    // demander à l'utilisateur de confirmer sa sortie
    if (!confirm("Remplir ce champ est obligatoire !\nVoulez sortir du champ ?")) {
      elementEntree.focus();
    }
  }
}

// liensInternes
const liensInternes = document.querySelectorAll(".internal-link");

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
}