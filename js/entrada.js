let emailLogin = document.getElementById("email"); 
let senhaLogin = document.getElementById("password");
let botaoLogin = document.getElementById("login"); 
let formLogin = document.getElementById("form");
let mostrarSenha = document.getElementById("show-password-checkbox");
let mostrarSenhaIcone = document.getElementById("password-show");
let lembrarLogin = document.getElementById("checkbox-remember"); 
let spanEmail = document.getElementById("span-email");
let spanSenha = document.getElementById("span-senha");
// let loading = document.getElementById("btn")

let loginUsuario = { 
    "email": emailLogin.value,
    "password": senhaLogin.value
} 

//valideUser();

emailLogin.addEventListener("input", () => {
    loginUsuario.email = emailLogin.value
    valideEmailForm();
    valideButaoForm();
});

senhaLogin.addEventListener("input", () => {
    loginUsuario.password = senhaLogin.value
    valideSenhaForm();
    valideButaoForm();
});



function validEmail(email){ 
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
}

function valideEmailForm(){ 
  const emailValida = emailLogin.value.trim();
  if (emailValida === "" || !validEmail(emailValida)) {
    spanEmail.classList.remove("hidden");
    botaoLogin.style.backgroundColor = "#CCCCCC";
    botaoLogin.style.color = "#000000"; 
    return false
  } else {
    spanEmail.classList.add("hidden");
    return true
  }
}

function valideSenhaForm(){ 
  const senhaValida = senhaLogin.value.trim(); 
  if (senhaValida === "" || senhaValida.length < 8) {
    spanSenha.classList.remove("hidden");
    botaoLogin.style.backgroundColor = "#CCCCCC";
    botaoLogin.style.color = "#000000";
    return false
  } else {
    spanSenha.classList.add("hidden");
    return true
  }
}

function valideButaoForm(){
    const emailValidado = valideEmailForm();
    const senhaValidada = valideSenhaForm();
    if (emailValidado && senhaValidada) { 
      botaoLogin.disabled = false;
      botaoLogin.style.backgroundColor = "#C7379C";
      botaoLogin.style.color = "#FFFFFF";
    }  
}

mostrarSenha.addEventListener("change",() => { 
    if (mostrarSenha.checked){ 
        senhaLogin.type = "text";
        mostrarSenhaIcone.classList.remove('fi-rr-eye-crossed');
        mostrarSenhaIcone.classList.add('fi-rr-eye');
    } else { 
        senhaLogin.type = "password";
        mostrarSenhaIcone.classList.remove('fi-rr-eye');
        mostrarSenhaIcone.classList.add('fi-rr-eye-crossed');
    }
})


async function fazerLogin() {
  const loginUsuarioJson = JSON.stringify(loginUsuario);
  const configuracoesRequisicao = {
    method: 'POST',
    body: loginUsuarioJson,
    headers: {
      'Content-type': 'application/json',
    },
  };
  const resposta = await fetch('https://todo-api.ctd.academy/v1/users/login',
    configuracoesRequisicao);
  let chaveJwt = await resposta.json();
  if (chaveJwt.jwt) {
    if (lembrarLogin.checked) {
      localStorage.setItem('chaveJwt', chaveJwt.jwt);
    } else {
      sessionStorage.setItem('chaveJwt', chaveJwt.jwt);
    }

    window.location.href = './index.html';
  } else {
    alert('Usuário ou senha inválido');
  }
}

function valideUser(){ 
  let userToken = localStorage.getItem("chaveJwt"); 
  if(userToken){ //MUDA 
    window.location.href = './index.html';
  }
}


botaoLogin.addEventListener("click", fazerLogin);

 /*
  FALTA FAZER:   
   Um ícone de Loading enquanto ocorre o processo de login e de cadastro do usuário.
    https://daisyui.com/components/button/ 
    setTimeout(() => {
        console.log('Acabou o tempo')}, 3000);
        setTimeout(() => {
            console.log('Acabou o tempo')}, 3000);
    Verificar o cadastro e colocar as alterações 

    <button type="button" class="bg-indigo-500 ..." disabled>
  <svg class="animate-spin h-5 w-5 mr-3 ..." viewBox="0 0 24 24">
    <!-- ... -->
  </svg>
  Processing...
</button>
 */