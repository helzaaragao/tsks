let emailLogin = document.getElementById("email"); 
let senhaLogin = document.getElementById("password");
let botaoLogin = document.getElementById("login"); 
let formLogin = document.getElementById("form");
let mostrarSenha = document.getElementById("show-password-checkbox");
let mostrarSenhaIcone = document.getElementById("password-show");
let lembrarLogin = document.getElementById("checkbox-remember"); 
let spanEmail = document.getElementById("span-email");
let spanSenha = document.getElementById("span-senha");
let loading = document.getElementById("loading");
let textoBotao = document.getElementById("texto-botao");

let loginUsuario = { 
    email: '',
    password: ''
} 

valideUser();

emailLogin.addEventListener("input", () => {
    loginUsuario.email = emailLogin.value
    valideEmailForm();
    valideBotaoForm();
});

senhaLogin.addEventListener("input", () => {
    loginUsuario.password = senhaLogin.value
    valideSenhaForm();
    valideBotaoForm();
});



function validEmail(email){ 
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
}

function valideEmailForm(){ 
  const emailValida = emailLogin.value.trim();
  if (emailValida === "" || !validEmail(emailValida)) {
    spanEmail.classList.remove("hidden");
    return false
  } else {
    spanEmail.classList.add("hidden");
    return true
  }
}

function valideSenhaForm(){ 
  const senhaValida = senhaLogin.value.trim(); 
  if (senhaValida === "" || senhaValida.length < 8) {
    spanSenha.classList.remove("hidden");
    return false
  } else {
    spanSenha.classList.add("hidden");
    return true
  }
}

function valideBotaoForm(){
    const emailValidado = valideEmailForm();
    const senhaValidada = valideSenhaForm();
    if (emailValidado && senhaValidada) { 
      botaoLogin.disabled = false;
      botaoLogin.style.backgroundColor = "#C7379C";
      botaoLogin.style.color = "#FFFFFF";
    }  
}

mostrarSenha.addEventListener("change",() => { 
    if (mostrarSenha.checked){ 
        senhaLogin.type = "text";
        mostrarSenhaIcone.classList.remove('fi-rr-eye');
        mostrarSenhaIcone.classList.add('fi-rr-eye-crossed');
    } else { 
        senhaLogin.type = "password";
        mostrarSenhaIcone.classList.remove('fi-rr-eye-crossed');
        mostrarSenhaIcone.classList.add('fi-rr-eye');
    }
})

//loading aqui
async function fazerLogin() {
  loading.classList.remove('hidden');
  textoBotao.classList.add('hidden');
  const loginUsuarioJson = JSON.stringify(loginUsuario);
  const configuracoesRequisicao = {
    method: 'POST',
    body: loginUsuarioJson,
    headers: {
      'Content-type': 'application/json',
    },
  };
  const resposta = await fetch('https://todo-api.ctd.academy/v1/users/login',
    configuracoesRequisicao);
  let chaveJwt = await resposta.json();
  if (chaveJwt.jwt) {
    if (lembrarLogin.checked) {
      localStorage.setItem('chaveJwt', chaveJwt.jwt);
    } else {
      sessionStorage.setItem('chaveJwt', chaveJwt.jwt);
    }
    window.location.href = './tasks.html';
  } else {
    loading.classList.add('hidden');
    textoBotao.classList.remove('hidden');
    alert('Usuário ou senha inválido');
  }
}

function valideUser(){ 
  let userToken = localStorage.getItem("chaveJwt"); 
  if(userToken){ //MUDA 
    window.location.href = './tasks.html';
  }
}


botaoLogin.addEventListener("click", fazerLogin);

 /*
  FALTA FAZER:   
  Verificar se o llogin está okay e colocar a ValideUser em ação
  Colocar o que falta no cadastro + verificar se está tudo okay
   (ajeitar a responsividade dos dois)
 */