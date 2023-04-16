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
let loading = document.getElementById("loading");
let textoBotao = document.getElementById("texto-botao");



let registerUser = {
        "firstName": nomeUser,
        "lastName": sobrenomeUser,
        "email": emailUser,
        "password": senhaUser
};

nomeUser.addEventListener("input", () => {
    registerUser.firstName = nomeUser.value
    valideNomeForm();
    valideButaoForm();
});

sobrenomeUser.addEventListener("input", () => {
    registerUser.lastName = sobrenomeUser.value
    valideSobrenomeForm();
    valideButaoForm();
});

emailUser.addEventListener("input", () => {
    registerUser.email = emailUser.value
    valideEmailForm();
    valideButaoForm();
});

senhaUser.addEventListener("input", () => {
    registerUser.password = senhaUser.value
    valideSenhaForm();
    valideButaoForm();
});


function valideNomeForm(){ 
    const nomeValida = nomeUser.value.trim();
    if (nomeValida === "" || nomeValida.length < 2) {
      spanName.classList.remove("hidden");
      return false
    } else {
      spanName.classList.add("hidden");
      return true
    }
}

function valideSobrenomeForm(){ 
    const sobrenomeValida = sobrenomeUser.value.trim();
    if (sobrenomeValida === "" || sobrenomeValida.length < 2) {
      spanSobrenome.classList.remove("hidden"); 
      return false
    } else {
      spanSobrenome.classList.add("hidden");
      return true
    }
}


function validEmail(email){ 
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
}

function valideEmailForm(){ 
    const emailValida = emailUser.value.trim();
    if (emailValida === "" || !validEmail(emailValida)) {
      spanEmail.classList.remove("hidden");
      return false
    } else {
      spanEmail.classList.add("hidden");
      return true
    }
}
  
  function valideSenhaForm(){ 
    const senhaValida = senhaUser.value.trim(); 
    if (senhaValida === "" || senhaValida.length < 8) {
      spanSenha.classList.remove("hidden");
      return false
    } else {
      spanSenha.classList.add("hidden");
      return true
    }
  }
  
  function valideButaoForm(){
      const nameValidado = valideNomeForm();
      const sobrenomeValidado = valideSobrenomeForm();
      const emailValidado = valideEmailForm();
      const senhaValidada = valideSenhaForm();
      if ( nameValidado && sobrenomeValidado && emailValidado && senhaValidada ) { 
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
    loading.classList.remove('hidden');
    textoBotao.classList.add('hidden');
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
        localStorage.setItem('chaveJwt', chaveJwt.jwt);
        window.location.href = "./tasks.html";
    } else{ 
        loading.classList.add('hidden');
        textoBotao.classList.remove('hidden');
        alert("Não foi possível realizar o cadastro")
    }
}

botaoUser.addEventListener("click", cadastro);