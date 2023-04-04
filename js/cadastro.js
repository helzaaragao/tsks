let configuracoesRequisicao = { 
    method: 'POST', 
    body: {
        "firstName": "Afra",
        "lastName": "Taiza",
        "email": "afrataiza@test.com",
        "password": "12345678"
      }, 
    headers:{ 
        'Content-type': 'application/json'
    },
}
        //function muxando dos pinuts esses valores

async function cadastro(){ 
    const resposta = await fetch("https://todo-api.ctd.academy/v1/users", configuracoesRequisicao)
    let chaveJwt = await resposta.json();
    if(chaveJwt.jwt){
        window.location.href = "./index.html";
       
    }
}

cadastro();