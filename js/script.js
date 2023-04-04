const timelineDate = document.querySelector('#date');
const date = new Date();
const options = { month: 'short', day: 'numeric', weekday: 'short'};
timelineDate.innerText =  date.toLocaleDateString('pt-Br', options).toUpperCase().replaceAll('.', '');


let loginUsuario = { 
        email: "afrataiza@007.com",
        password: "xxx"
}

const loginUsuarioJson = JSON.stringify(loginUsuario); 

let configuracoesRequisicao = { 
    method: 'POST', 
    body: loginUsuarioJson, 
    headers:{ 
        'Content-type': 'application/json',
    },
}

async function fazerLogin(){ 
    const resposta = await fetch("https://todo-api.ctd.academy/v1/users/login", configuracoesRequisicao)
    let chaveJwt = await resposta.json();
    console.log(resposta);  
    // if(chaveJwt.jwt){
    //     window.location.href = "./index.html";
       
    // }
}

const search = document.querySelector('#search');

search.addEventListener('click', fazerLogin);
