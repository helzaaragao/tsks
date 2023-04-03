let emailLogin = document.getElementById("email"); 
let senhalogin = document.getElementById("password");
let botaoLogin = document.getElementById("logar"); 
let formsLogin = document.getElementById("form");

let loginUsuario = { 
        'email': "afrataiza@test.com",
        'password': "12345678"
}

const loginUsuarioJson = JSON.stringify(loginUsuario); 

let configuracoesRequisicao = { 
    method: 'POST', 
    body: loginUsuario, 
    Headers:{ 
        'Content-type': 'application/json'
    },
}

async function fazerLogin(){ 
    const resposta = await fetch("https://todo-api.ctd.academy/v1/users/login", configuracoesRequisicao)
    let chaveJwt = await resposta.json();
    console.log(chaveJwt);  
    if(chaveJwt.jwt){
        window.location.href = "./index.html";
       
    }
    

}

botaoLogin.addEventListener("click", fazerLogin);

