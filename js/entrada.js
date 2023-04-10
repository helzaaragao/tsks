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
    valideEmailForm()
});

senhaLogin.addEventListener("input", () => {
    loginUsuario.password = senhaLogin.value
    valideSenhaForm()
});



function validEmail(email){ 
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
}

function valideEmailForm(){ 
  const emailValida = emailLogin.value.trim();
  if (emailValida === "" || !validEmail(emailValida)) { 
    spanEmail.classList.remove("hidden"); 
    spanEmail.innerHTML = "Email inválido"
    botaoLogin.disabled = true; 
    botaoLogin.style.backgroundColor = "#CCCCCC";
    botaoLogin.style.color = "#000000";
} else { 
  spanEmail.classList.add("hidden");
  botaoLogin.disabled = false; 
}
}

function valideSenhaForm(){ 
  const senhaValida = senhaLogin.value.trim(); 
  if (senhaValida === "" || senhaValida.length < 8) { 
    botaoLogin.disabled = true;
    spanSenha.innerHTML = "Senha inválido"
    botaoLogin.style.backgroundColor = "#CCCCCC";
    botaoLogin.style.color = "#000000";
}else { 
    spanSenha.classList.add("hidden"); 
    botaoLogin.style.backgroundColor = "#C7379C";
    botaoLogin.style.color = "#FFFFFF";
    botaoLogin.disabled = false;
}
}

function valideForm(){ 
    const emailValida = emailLogin.value.trim(); 
    const senhaValida = senhaLogin.value.trim(); 

    if (emailValida === "" || !validEmail(emailValida)) { 
        //a lógica não está validando os dois mas quando termino de colocr o email ele ainda deixa como se tivesse invalido ( apenas digitando, se pegar pronto do search ele aceita de boas) e  a senha também antes mesmo de eu clicar nela| Já tentei o if else para cada um e o problema se volta para o botão de login que aciona apenas colocando a senha ( seguindo a ordem que eu coloquei) | Eu só não sei que logica usar para que tudo saia como planejado sabe?
        spanEmail.classList.remove("hidden"); 
        spanEmail.innerHTML = "Email inválido"
        botaoLogin.disabled = true; 
        botaoLogin.style.backgroundColor = "#CCCCCC";
        botaoLogin.style.color = "#000000";
    } else { 
      spanEmail.classList.add("hidden");
    }

    if (senhaValida === "" || senhaValida.length < 8) { 
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
    //a lógica tava certa so que estava sendo passado chaveJwt ao invés de chaveJwt.jwt para o localStorage e sessionStorage
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