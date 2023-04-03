botaoAcessarLogin.addEventListener("click", function (evento) {

    //Verifica se ambos os campos estão preenchidos, normalizados e validados
    if (validaTelaDeLogin()) {

        evento.preventDefault();

        //NORMALIZANDO...

        //Retirando os espaços das informações obtidass
        campoEmailLoginNormalizado = retiraEspacosDeUmValorInformado(
            campoEmailLogin.value
        );
        campoSenhaLoginNormalizado = retiraEspacosDeUmValorInformado(
            campoSenhaLogin.value
        );

        //Converte para minusculo os valores recebidos
        campoEmailLoginNormalizado = converteValorRecebidoParaMinusculo(
            campoEmailLoginNormalizado
        );


        //Atribui as informações normalizadas e validadas no objeto JS do usuário
        loginUsuario.email = campoEmailLoginNormalizado;
        loginUsuario.password = campoSenhaLoginNormalizado;

        /// Converter o objeto JS para objeto JSON (formato aceito pela API no corpo da requisição)
        let loginUsuarioEmJson = JSON.stringify(loginUsuario);

        let configuracoesRequisicao = {
            method: 'POST',
            body: loginUsuarioEmJson,
            headers: {
                'Content-type': 'application/json',
            },
        }

        /// Utilizando Promisses
        //Chamando a API
        fetch(`${apiBaseUrl()}/users/login`, configuracoesRequisicao)
            .then((response) => {
                /* Verifica status de sucesso na execução da promisse */
                console.log(response);
                if (response.status == 201 || response.status == 200) {
                    return response.json()
                }
                // Se o código for diferente de sucesso (201), lança um throw para que a execução caia no Catch() 
                throw response;
            }).then(function (resposta) {
                console.log(resposta);
                // Chama função ao obter sucesso no login
                loginSucesso(resposta.jwt)
            })
            .catch(error => {
                // Chama função ao obter algum erro no login
                loginErro(error.status)
            });

        //  Ao obter o sucesso, recebe o json (token JWT) do usuário
        function loginSucesso(jwtRecebido) {

            console.log("Jwt recebido\n");
            console.log(jwtRecebido);

            /// Setando o token usando Cookies
            document.cookie = `jwt=${jwtRecebido}`;

            /// Também é possivel setar utilizando o Storage no navegador.
            //sessionStorage.setItem("jwt", jwtRecebido);

            /// Direciona o usuário para a tela de tarefas após sucesso ao logar
            window.location.href = "tarefas.html";
        }

        function loginErro(statusRecebido) {

            let loginValidacao = document.getElementById("loginValidacao");
            elementoSmallErro(loginValidacao);

            //Limpa o campo da senha ao errar o login
            campoSenhaLogin.value = "";

            if (statusRecebido == 400 || statusRecebido == 404) {
                console.log("Ocorreu algum erro, verifique o e-mail e/ou senha");
                loginValidacao.innerHTML = "Ocorreu algum erro, verifique o e-mail e/ou senha";
                loginApiValidacao = false;

            } else {
                loginApiValidacao = true;
            }
            validaTelaDeLogin();
        }

    } else {
        evento.preventDefault();
        alert("Ambos campos devem ser preenchidos");
    }
});
