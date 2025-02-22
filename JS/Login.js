// Lista de credenciales válidas
const validCredentials = [
  { username: "JLuis09", password: "Kariokito12" },
  { username: "Javi1", password: "JavierVargas12" }
];

// Referencias a elementos del DOM
const loginForm = document.getElementById("loginForm");
const usernameGroup = document.getElementById("usernameGroup");
const passwordGroup = document.getElementById("passwordGroup");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginCard = document.getElementById("loginCard");
const forgotPasswordLink = document.getElementById("forgotPasswordLink");
const contactLink = document.getElementById("contactLink");
const backToLoginFromRecovery = document.getElementById("backToLoginFromRecovery");
const backToLoginFromContact = document.getElementById("backToLoginFromContact");
const passwordRecoveryForm = document.getElementById("passwordRecoveryForm");
const contactForm = document.getElementById("contactForm");
const passwordRecoveryCard = document.getElementById("passwordRecoveryCard");
const contactCard = document.getElementById("contactCard");

// Efecto flip para olvidó contraseña
forgotPasswordLink.addEventListener("click", function(e) {
  e.preventDefault();
  // Asegurarse de que ambas tarjetas traseras estén ocultas antes de voltear
  passwordRecoveryCard.style.display = "block";
  contactCard.style.display = "none";
  loginCard.classList.add("flipped");
  loginCard.classList.add("flipped-recovery");
  loginCard.classList.remove("flipped-contact");
});

// Efecto flip para contacto
contactLink.addEventListener("click", function(e) {
  e.preventDefault();
  // Asegurarse de que ambas tarjetas traseras estén ocultas antes de voltear
  passwordRecoveryCard.style.display = "none";
  contactCard.style.display = "block";
  loginCard.classList.add("flipped");
  loginCard.classList.add("flipped-contact");
  loginCard.classList.remove("flipped-recovery");
});

// Volver al login desde recuperación de contraseña
backToLoginFromRecovery.addEventListener("click", function() {
  loginCard.classList.remove("flipped");
  loginCard.classList.remove("flipped-recovery");
  setTimeout(() => {
      passwordRecoveryCard.style.display = "none";
  }, 500); // Esperar a que termine la animación
});

// Volver al login desde contacto
backToLoginFromContact.addEventListener("click", function() {
  loginCard.classList.remove("flipped");
  loginCard.classList.remove("flipped-contact");
  setTimeout(() => {
      contactCard.style.display = "none";
  }, 500); // Esperar a que termine la animación
});

// Enviar formulario de recuperación
passwordRecoveryForm.addEventListener("submit", function(e) {
  e.preventDefault();
  
  const email = document.getElementById("recovery-email").value;
  
  // Validar email
  if (!email || !email.includes("@")) {
      alert("Please enter a valid email address");
      return;
  }
  
  // Cambiar botón para indicar éxito
  const button = this.querySelector(".login__button");
  button.textContent = "EMAIL SENT!";
  button.style.background = "linear-gradient(135deg, #4CAF50, #2E7D32)";
  
  // Mensaje temporal
  setTimeout(() => {
      alert(`Recovery instructions sent to ${email}. Please check your inbox.`);
      loginCard.classList.remove("flipped");
      loginCard.classList.remove("flipped-recovery");
      this.reset();
      button.textContent = "SEND RESET LINK";
      button.style.background = "linear-gradient(135deg, #1484c5, #18618b)";
      setTimeout(() => {
          passwordRecoveryCard.style.display = "none";
      }, 500);
  }, 1500);
});

// Enviar formulario de contacto
contactForm.addEventListener("submit", function(e) {
  e.preventDefault();
  
  const name = document.getElementById("contact-name").value;
  const email = document.getElementById("contact-email").value;
  const message = document.getElementById("contact-message").value;
  
  // Validación básica
  if (!name || !email || !message) {
      alert("Please fill in all fields");
      return;
  }
  
  if (!email.includes("@")) {
      alert("Please enter a valid email address");
      return;
  }
  
  // Cambiar botón para indicar éxito
  const button = this.querySelector(".login__button");
  button.textContent = "MESSAGE SENT!";
  button.style.background = "linear-gradient(135deg, #4CAF50, #2E7D32)";
  
  // Mensaje temporal
  setTimeout(() => {
      alert(`Thank you, ${name}! Your message has been sent to our support team.`);
      loginCard.classList.remove("flipped");
      loginCard.classList.remove("flipped-contact");
      this.reset();
      button.textContent = "SEND MESSAGE";
      button.style.background = "linear-gradient(135deg, #1484c5, #18618b)";
      setTimeout(() => {
          contactCard.style.display = "none";
      }, 500);
  }, 1500);
});

// Función para mostrar mensajes de error
function showError(element, message) {
  element.classList.add("error");
  element.classList.remove("success");
  const errorMessage = element.querySelector(".login__error-message");
  if (errorMessage) {
      errorMessage.textContent = message;
  }
  
  // Efecto de pulsación
  element.classList.add("form-pulse");
  setTimeout(() => {
      element.classList.remove("form-pulse");
  }, 500);
}

// Función para limpiar errores
function clearError(element) {
  element.classList.remove("error");
}

// Función para mostrar éxito
function showSuccess(element) {
  element.classList.remove("error");
  element.classList.add("success");
}

// Función para validar el formulario
function validateForm() {
  let isValid = true;
  
  // Validar username
  if (usernameInput.value.trim() === "") {
      showError(usernameGroup, "Username cannot be empty");
      isValid = false;
  } else {
      clearError(usernameGroup);
  }
  
  // Validar password
  if (passwordInput.value === "") {
      showError(passwordGroup, "Password cannot be empty");
      isValid = false;
  } else {
      clearError(passwordGroup);
  }
  
  return isValid;
}

// Animación al cargar la página
document.addEventListener("DOMContentLoaded", function() {
  // Ocultar las tarjetas traseras al inicio
  passwordRecoveryCard.style.display = "none";
  contactCard.style.display = "none";
  
  // Efecto suave de entrada
  setTimeout(() => {
      usernameInput.focus();
  }, 1800);
  
  // Efecto del botón cuando se pasa el cursor
  const loginButtons = document.querySelectorAll(".login__button");
  loginButtons.forEach(button => {
      button.addEventListener("mousemove", function(e) {
          const rect = this.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          
          this.style.background = `radial-gradient(circle at ${x}px ${y}px, 
                                  #1484c5 0%, 
                                  #18618b 50%, 
                                  #6b1b99 100%)`;
      });
      
      button.addEventListener("mouseleave", function() {
          this.style.background = "linear-gradient(135deg, #1484c5, #18618b)";
      });
  });
});

// Evento para manejar el submit del formulario
loginForm.addEventListener("submit", function(event) {
  event.preventDefault(); // Evita el comportamiento por defecto del formulario
  
  // Primero validamos el formulario
  if (!validateForm()) {
      return;
  }
  
  const username = usernameInput.value;
  const password = passwordInput.value;
  
  // Verifica si las credenciales son válidas
  const isValid = validCredentials.some(
      cred => cred.username === username && cred.password === password
  );
  
  if (isValid) {
      // Muestra efecto de éxito
      showSuccess(usernameGroup);
      showSuccess(passwordGroup);
      
      // Efecto de botón
      const loginButton = this.querySelector(".login__button");
      loginButton.textContent = "LOGGING IN...";
      loginButton.style.background = "linear-gradient(135deg, #4CAF50, #2E7D32)";
      
      // Redirigir después de una pequeña animación
      setTimeout(() => {
        window.location.href = "/IA-1/HTML/Welcome.html";
      }, 900);
  } else {
      // Muestra error con efecto más sutil
      showError(usernameGroup, "Invalid username or password");
      showError(passwordGroup, "Invalid username or password");
      
      // Efecto visual para errores
      document.querySelectorAll(".login__input").forEach(input => {
          input.style.transition = "transform 0.1s ease";
          input.style.transform = "translateX(5px)";
          setTimeout(() => {
              input.style.transform = "translateX(-5px)";
              setTimeout(() => {
                  input.style.transform = "translateX(0)";
              }, 100);
          }, 100);
      });
  }
});

// Limpiar errores al escribir y añadir efectos interactivos
usernameInput.addEventListener("input", function() {
  clearError(usernameGroup);
});

passwordInput.addEventListener("input", function() {
  clearError(passwordGroup);
});

// Efecto de enfoque para los inputs
document.querySelectorAll(".login__input, .password-recovery__input").forEach(input => {
  input.addEventListener("focus", function() {
      this.parentElement.parentElement?.classList.add("form-focus");
  });
  
  input.addEventListener("blur", function() {
      this.parentElement.parentElement?.classList.remove("form-focus");
  });
});