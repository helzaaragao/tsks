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

emailLogin.addEventListener("input", () => {
    loginUsuario.email = emailLogin.value
    valideForm();
});

senhaLogin.addEventListener("input", () => {
    loginUsuario.password = senhaLogin.value
    valideForm();
});



function validEmail(email){ 
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
}


function valideForm(){ 
    const emailValida = emailLogin.value.trim(); 
    const senhaValida = senhaLogin.value.trim(); 

    if (emailValida === "" && !validEmail(emailValida)) { 
        spanEmail.classList.remove("hidden"); 
        spanEmail.innerHTML = "Email inválido"
        botaoLogin.disabled = true; 
        botaoLogin.style.backgroundColor = "#CCCCCC";
        botaoLogin.style.color = "#000000";
    } else { 
      spanEmail.classList.add("hidden");
    }

    if (senhaValida === "" && senhaValida.length < 8) { 
      spanSenha.classList.remove("hidden"); 
        botaoLogin.disabled = true;
        spanSenha.innerHTML = "Senha inválido"
        botaoLogin.style.backgroundColor = "#CCCCCC";
        botaoLogin.style.color = "#000000";
    }else { 
        spanSenha.classList.add("hidden"); 
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


botaoLogin.addEventListener("click", fazerLogin);

 /*
  FALTA FAZER:
    Validação com o span mostrando ( ainda existe um bug)
    Verificar o salvar senha + mostrar senha
    Vai existir? Um ícone de Loading enquanto ocorre o processo de login e de cadastro do usuário.
    https://daisyui.com/components/button/ 
    setTimeout(() => {
        console.log('Acabou o tempo')}, 3000);
        setTimeout(() => {
            console.log('Acabou o tempo')}, 3000);
 */