let emailLogin = document.getElementById("email"); 
let senhaLogin = document.getElementById("password");
let botaoLogin = document.getElementById("login"); 
let formLogin = document.getElementById("form");
let mostrarSenha = document.getElementById("show-password-checkbox");
let lembrarLogin = document.getElementById("checkbox-remember"); 

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

    if (emailValida === "" || !validEmail(emailValida)) { 
        botaoLogin.disabled = true; 
        ///span ativo class remove  span.innerText + remove  SEPARAR O MEIAL E SENHA  senha  < 8 
    } else if (senhaValida === "") { 
        botaoLogin.disabled = true;
        //span desativo class list add 
    } else{ 
        botaoLogin.disabled = false; // else false no fim
    }
}

mostrarSenha.addEventListener("change",() => { 
    if (mostrarSenha.checked){ 
        senhaLogin.type = "text"; 
    } else { 
        senhaLogin.type = "password"
    }
})


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
     if(chaveJwt.jwt){ //ver isso aqui 
        if(lembrarLogin.checked){ 
          localStorage.setItem("chaveJwt", chaveJwt);
        } else{ 
            sessionStorage.setItem("chaveJwt", chaveJwt);
        }  
     window.location.href = "./index.html";
     } else { 
       alert("Usuário ou senha inválido")
    }
}

botaoLogin.addEventListener("click", fazerLogin);

 /* Campos de Nome e Sobrenome não devem estar vazios e o campo de email deve conter um email válido para que o formulário não apresente erros 
 Fazer validação do lembra-me do usuário. Se marcado, o token do usuário deve ser salvo no local storage, se não o token deve ser salvo no session storage.
 Um ícone de Loading enquanto ocorre o processo de login e de cadastro do usuário.

 Exibi a senha + Lembrar o login na próxima vez, aqueles que não foram lembrados é pra colocar na session

   class disabled: oppacite  no html
   hidden no span, colocar as classes no span , javascript hidden
   https://daisyui.com/components/button/ 
   setTimeout(() => {
        console.log('Acabou o tempo')}, 3000);
        setTimeout(() => {
            console.log('Acabou o tempo')}, 3000);
 */