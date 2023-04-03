let loginUsuario = { 
    email: "helzaaragao1@gmail.com", 
    password: "123456789"
}

const loginUsuarioJson = JSON.stringify(loginUsuario); 

let configuracoesRequisicao = { 
    method: 'POST', 
    body: loginUsuarioJson, 
    Headers:{ 
        'Content-type': 'application/json'
    }
}

async function fazerLogin(){ 
    const resposta = await fetch("https://todo-api.ctd.academy/users/login", configuracoesRequisicao)
    let chaveJwt = await resposta.json(); 
    console.log(chaveJwt.jwt); 

}

fazerLogin();
