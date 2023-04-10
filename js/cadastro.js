let nomeUser = document.getElementById("name"); 
let sobrenomeUser = document.getElementById("sobrename"); 
let emailUser = document.getElementById("email"); 
let senhaUser = document.getElementById("password");
let botaoUser = document.getElementById("button");
let mostrarSenha = document.getElementById("show-password-checkbox");
let mostrarSenhaIcone = document.getElementById("password-show");
let spanName = document.getElementById("span-name"); 
let spanSobrenome = document.getElementById("span-sobrenome"); 
let spanEmail = document.getElementById("span-email");
let spanSenha = document.getElementById("span-senha");


let registerUser = {
        "firstName": nomeUser,
        "lastName": sobrenomeUser,
        "email": emailUser,
        "password": senhaUser
};

nomeUser.addEventListener("input", () => {
    registerUser.firstName = nomeUser.value
    valideForm()
});

sobrenomeUser.addEventListener("input", () => {
    registerUser.lastName = sobrenomeUser.value
    valideForm()
});

emailUser.addEventListener("input", () => {
    registerUser.email = emailUser.value
    valideForm()
});

senhaUser.addEventListener("input", () => {
    registerUser.password = senhaUser.value
    valideForm()
});

function validEmail(email){ 
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
}

function valideForm(){
    const nameValida = nomeUser.value.trim(); 
    const sobrenomeValida = sobrenomeUser.value.trim();
    const emailValida = emailUser.value.trim(); 
    const senhaValida = senhaUser.value.trim();

    if (nameValida === "" || sobrenomeValida === "" || emailValida === "" || !validEmail(emailValida) || senhaValida === "" || senhaValida.length < 8){ 
        spanName.classList.remove("hidden"); 
        spanName.innerHTML = "Nome incompleto"
        spanSobrenome.classList.remove("hidden"); 
        spanSobrenome.innerHTML = "Sobrenome incompleto"
        spanEmail.classList.remove("hidden"); 
        spanEmail.innerHTML = "Email Inválido";
        spanSenha.classList.remove("hidden"); 
        spanSenha.innerHTML = "Senha Inválida";
        botaoUser.disabled = true; 
        botaoUser.style.backgroundColor = "#CCCCCC";
        botaoUser.style.color = "#000000";
    } else {
        spanName.classList.add("hidden");
        spanSobrenome.classList.add("hidden"); 
        spanEmail.classList.add("hidden");
        spanSenha.classList.add("hidden"); 
        botaoUser.disabled = false;
        botaoUser.style.backgroundColor = "#C7379C";
        botaoUser.style.color = "#FFFFFF";
    }
}

mostrarSenha.addEventListener("change",() => { 
    if (mostrarSenha.checked){ 
        senhaUser.type = "text";
        mostrarSenhaIcone.classList.remove('fi-rr-eye-crossed');
        mostrarSenhaIcone.classList.add('fi-rr-eye');
    } else { 
        senhaUser.type = "password";
        mostrarSenhaIcone.classList.remove('fi-rr-eye');
        mostrarSenhaIcone.classList.add('fi-rr-eye-crossed');
    }
})

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