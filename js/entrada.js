let emailLogin = document.getElementById("email"); 
let senhaLogin = document.getElementById("password");
let botaoLogin = document.getElementById("login"); 
let formLogin = document.getElementById("form");

let loginUsuario = { 
    "email": emailLogin.value,
    "password": senhaLogin
} 

emailLogin.addEventListener("input", () => {
    loginUsuario.email = emailLogin.value
});

senhaLogin.addEventListener("input", () => {
    loginUsuario.password = senhaLogin.value
});

/*function emailValido(emailColocado){ 
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailColocado)) {
        return console.log(emailLogin.value);
      } else {
        return false;
      }
} */

async function fazerLogin(){ 
    const loginUsuarioJson = JSON.stringify(loginUsuario); 
   
    const configuracoesRequisicao = { 
        method: 'POST', 
        body: loginUsuarioJson, 
        headers:{ 
            'Content-type': 'application/json'
        },
    }
    const resposta = await fetch("https://todo-api.ctd.academy/v1/users/login", configuracoesRequisicao)
    let chaveJwt = await resposta.json(); 
     if(chaveJwt.jwt){
     window.location.href = "./index.html";
     } else { 
     alert("sem as informações necessárias para logar"); 
    }
}

botaoLogin.addEventListener("click", fazerLogin);

 /* Campos de Nome e Sobrenome não devem estar vazios e o campo de email deve conter um email válido para que o formulário não apresente erros 
 deve-se desbloquear o botão de login quando os campos estão preenchidos e o campo de email está validado.
 Fazer validação do lembra-me do usuário. Se marcado, o token do usuário deve ser salvo no local storage, se não o token deve ser salvo no session storage.
 Um ícone de Loading enquanto ocorre o processo de login e de cadastro do usuário.
 */