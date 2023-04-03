let configuracoesRequisicao = { 
    method: 'POST', 
    body: {
        "firstName": "Afra",
        "lastName": "Taiza",
        "email": "afrataiza@test.com",
        "password": "12345678"
      }, 
    Headers:{ 
        'Content-type': 'application/json'
    },
}

async function cadastro(){ 
    const resposta = await fetch("https://todo-api.ctd.academy/v1/users", configuracoesRequisicao)
    let chaveJwt = await resposta.json();
    console.log(chaveJwt);
}

cadastro();