let emailLogin = document.getElementById("email"); 
let senhalogin = document.getElementById("password");
let botaoLogin = document.getElementById("login"); 
let formLogin = document.getElementById("form");

let loginUsuario = { 
        "email": "afrataiza@test.com",
        "password": "12345678"
        //function muxando dos pinuts esses valores
}

const loginUsuarioJson = JSON.stringify(loginUsuario); 

let configuracoesRequisicao = { 
    method: 'POST', 
    body: loginUsuario, 
    headers:{ 
        'Content-type': 'application/json'
    },
}

async function fazerLogin(){ 
    const resposta = await fetch("http://todo-api.ctd.academy:3000//v1/users/login", configuracoesRequisicao)
    let chaveJwt = await resposta.json();
    console.log(chaveJwt);  
    if(chaveJwt.jwt){
        window.location.href = "./index.html";
       
    }
}

botaoLogin.addEventListener("click", fazerLogin);

