let nomeUser = document.getElementById("name"); 
let sobrenomeUser = document.getElementById("sobrename"); 
let emailUser = document.getElementById("email"); 
let senhaUser = document.getElementById("password");
let botaoUser = document.getElementById("button");

let registerUser = {
        "firstName": nomeUser,
        "lastName": sobrenomeUser,
        "email": emailUser,
        "password": senhaUser
};

nomeUser.addEventListener("input", () => {
    registerUser.firstName = nomeUser.value
});

sobrenomeUser.addEventListener("input", () => {
    registerUser.lastName = sobrenomeUser.value
});

emailUser.addEventListener("input", () => {
    registerUser.email = emailUser.value
});

senhaUser.addEventListener("input", () => {
    registerUser.password = senhaUser.value
});

async function cadastro(){ 
    const registerUserJson = JSON.stringify(registerUser); 
    const configuracoesRequisicao = { 
        method: 'POST', 
        body: registerUserJson, 
        headers:{ 
            'Content-type': 'application/json'
        },
    }
    const resposta = await fetch("https://todo-api.ctd.academy/v1/users", configuracoesRequisicao)
    let chaveJwt = await resposta.json();
    if(chaveJwt.jwt){
        window.location.href = "./index.html";
       
    } else{ 
        alert("Não foi possível realizar o cadastro")
    }
}

botaoUser.addEventListener("click", cadastro);