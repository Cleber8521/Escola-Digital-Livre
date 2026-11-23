/*
   SCRIPT.JS — Interatividade da página

   O JavaScript reage às ações do usuário (como cliques)
   e altera o HTML/CSS da página em tempo real.

   DICA DE DEPURAÇÃO: se algo não funcionar, aperte F12
   no navegador e abra a aba "Console". Os erros de
   JavaScript aparecem lá em vermelho, com o número da linha.
 */

// Mensagem de teste: se ela aparecer no Console (F12),
// significa que o arquivo script.js foi carregado corretamente.
console.log("script.js carregado com sucesso!");


/*
   1) MENU HAMBÚRGUER (celular)
 */

// getElementById procura o elemento pelo id.
// querySelector procura pelo seletor CSS (aqui, a classe .main-nav).
const btnMenu = document.getElementById("btn-menu");  // o botão ☰
const menu = document.querySelector(".main-nav");     // o <nav>

// "if (btnMenu && menu)" = só executa se os DOIS elementos existirem.
// Sem essa verificação, um elemento faltando gera um erro que
// TRAVA todo o resto do script (inclusive o carrossel!).
if (btnMenu && menu) {

    // addEventListener: "fique escutando um evento".
    btnMenu.addEventListener("click", function () {

        // classList.toggle liga/desliga a classe "ativo"
        menu.classList.toggle("ativo");

        // Troca o símbolo do botão: ☰ (fechado) ou ✕ (aberto)
        if (menu.classList.contains("ativo")) {
            btnMenu.textContent = "✕";
        } else {
            btnMenu.textContent = "☰";
        }
    });
}


/*
   2) CARROSSEL DE CURSOS
 */

const courseList = document.getElementById("course-list"); // lista de cards
const btnNext = document.getElementById("btn-next");       // seta da direita
const btnPrev = document.getElementById("btn-prev");       // seta da esquerda

if (courseList && btnNext && btnPrev) {

    // Função que calcula quanto rolar: a largura de UM card + o espaço entre eles.
    // Assim, cada clique anda exatamente um card.
    function tamanhoDoPasso() {
        const card = courseList.querySelector(".course-card"); // pega o 1º card
        return card.offsetWidth + 16; // 16 = o "gap" definido no CSS
    }

    // Seta da DIREITA
    btnNext.addEventListener("click", function () {

        // scrollLeft  = quanto a lista já rolou (em pixels)
        // clientWidth = largura visível da lista
        // scrollWidth = largura TOTAL da lista (inclusive o que está escondido)
        const chegouNoFim =
            courseList.scrollLeft + courseList.clientWidth >= courseList.scrollWidth - 10;

        if (chegouNoFim) {
            // Já está no fim? Volta para o começo.
            courseList.scrollTo({ left: 0, behavior: "smooth" });
        } else {
            // Senão, anda um card para a direita (número positivo).
            courseList.scrollBy({ left: tamanhoDoPasso(), behavior: "smooth" });
        }
    });

    // Seta da ESQUERDA
    btnPrev.addEventListener("click", function () {
        // Número NEGATIVO = rola para a esquerda.
        courseList.scrollBy({ left: -tamanhoDoPasso(), behavior: "smooth" });
    });

} else if (courseList) {
    // AJUSTE: o aviso só aparece se a lista de cursos EXISTE mas faltam as setas.
    // Antes ele aparecia em todas as páginas sem carrossel (Cursos, Sobre...),
    // o que não é um erro de verdade.
    // Se algum elemento não foi encontrado, avisa no Console qual é o problema.
    console.error("Carrossel: verifique os ids course-list, btn-next e btn-prev no HTML.");
}


/*
   3) ANO AUTOMÁTICO NO RODAPÉ
 */

const ano = document.getElementById("ano");

if (ano) {
    // new Date() pega a data de hoje; getFullYear() devolve só o ano.
    ano.textContent = new Date().getFullYear();
}

/* 
   PARTE 3 — NOVAS PÁGINAS

   IMPORTANTE: todas as páginas usam ESTE MESMO arquivo.
   Por isso, cada bloco começa com um "if" que confere se
   os elementos existem na página aberta. Exemplo: o filtro
   de cursos só existe em cursos.html; nas outras páginas,
   o "if" é falso e o bloco é simplesmente pulado.
 */


/* 
   4) FILTRO DE CURSOS (página cursos.html)
*/

// querySelectorAll pega TODOS os elementos com a classe (vem uma lista).
const botoesFiltro = document.querySelectorAll(".filter-btn");
const cardsCursos = document.querySelectorAll(".course-grid .course-card");

// .length = quantidade de itens na lista. Se for 0, a página não tem filtro.
if (botoesFiltro.length > 0) {

    // forEach = "para cada": repete o código para cada botão da lista.
    botoesFiltro.forEach(function (botao) {

        botao.addEventListener("click", function () {

            // 1º) Lê qual categoria o botão representa (o atributo data-categoria).
            //     Em JavaScript, data-categoria vira dataset.categoria
            const categoriaEscolhida = botao.dataset.categoria;

            // 2º) Tira o destaque de todos os botões e destaca só o clicado.
            botoesFiltro.forEach(function (b) {
                b.classList.remove("active");
            });
            botao.classList.add("active");

            // 3º) Passa por cada card e decide se ele aparece ou não.
            cardsCursos.forEach(function (card) {
                const categoriaDoCard = card.dataset.categoria;

                // || significa "OU": mostra se escolheu "todos" OU se a categoria é igual.
                if (categoriaEscolhida === "todos" || categoriaEscolhida === categoriaDoCard) {
                    card.classList.remove("escondido"); // mostra
                } else {
                    card.classList.add("escondido");    // esconde
                }
            });
        });
    });
}


/* 
   5) MOSTRAR / ESCONDER SENHA (entrar.html e cadastro.html)
 */

const botoesSenha = document.querySelectorAll(".toggle-senha");

botoesSenha.forEach(function (botao) {
    // (se a página não tiver nenhum botão, a lista está vazia
    //  e o forEach não faz nada — por isso aqui nem precisamos do "if")

    botao.addEventListener("click", function () {

        // data-alvo guarda o id do campo de senha que este botão controla
        const campo = document.getElementById(botao.dataset.alvo);
        const icone = botao.querySelector(".material-symbols-outlined");

        // Se o campo está escondendo a senha (type="password")...
        if (campo.type === "password") {
            campo.type = "text";               // ...mostra o texto
            icone.textContent = "visibility_off"; // ícone de olho riscado
        } else {
            campo.type = "password";           // ...senão, esconde de novo
            icone.textContent = "visibility";
        }
    });
});


/*
   6) FUNÇÃO PARA MOSTRAR MENSAGENS NOS FORMULÁRIOS

   Uma FUNÇÃO é um bloco de código com nome, que podemos
   usar várias vezes. Vamos usá-la nos 3 formulários.

   Ela recebe 3 informações (parâmetros):
     elemento = o <p> onde a mensagem vai aparecer
     texto    = o que vai ser escrito
     tipo     = "sucesso" (verde) ou "erro" (vermelho)
 */
function mostrarMensagem(elemento, texto, tipo) {
    elemento.textContent = texto;
    elemento.className = "form-message " + tipo; // troca as classes do <p>
}


/*
   6.1) TRADUZIR OS ERROS DO SUPABASE  (PASSO 3)

   O Supabase responde os erros em INGLÊS.
   Esta função recebe a mensagem original e devolve
   (return) uma mensagem em português para o usuário.

   .includes("texto") pergunta: "a mensagem CONTÉM este texto?"
 */
function traduzirErro(mensagemOriginal) {

    if (mensagemOriginal.includes("User already registered")) {
        return "Este e-mail já está cadastrado. Tente entrar na sua conta.";
    }
    if (mensagemOriginal.includes("Invalid login credentials")) {
        return "E-mail ou senha incorretos.";
    }
    if (mensagemOriginal.includes("Password should be at least")) {
        return "A senha deve ter pelo menos 6 caracteres.";
    }
    if (mensagemOriginal.includes("invalid format") || mensagemOriginal.includes("is invalid")) {
        return "Este e-mail não é válido.";
    }
    if (mensagemOriginal.includes("Email not confirmed")) {
        return "Confirme seu e-mail antes de entrar (veja sua caixa de entrada).";
    }
    if (mensagemOriginal.includes("rate limit") || mensagemOriginal.includes("security purposes")) {
        return "Muitas tentativas seguidas. Aguarde um pouco e tente de novo.";
    }
    if (mensagemOriginal.includes("Failed to fetch")) {
        return "Sem conexão com o servidor. Verifique sua internet.";
    }

    // Se não for nenhum dos erros acima, mostra a mensagem original
    return "Ocorreu um erro: " + mensagemOriginal;
}


/*
   6.2) LEMBRAR O CURSO ESCOLHIDO  (PASSO 5)

   O endereço de uma página pode levar informações extras
   depois do sinal "?". Elas se chamam PARÂMETROS. Exemplo:

       entrar.html?curso=python
                   └─ nome ─┘└ valor ┘

   URLSearchParams é uma ferramenta do JavaScript que lê
   esses parâmetros. window.location.search é a parte do
   endereço que começa no "?".
 */
const parametrosDaUrl = new URLSearchParams(window.location.search);

// .get("curso") devolve o valor ("python").
// Se o endereço não tiver ?curso=, devolve null (nada).
const cursoEscolhido = parametrosDaUrl.get("curso");

// Função que decide PARA ONDE ir depois do login ou do cadastro:
//  - se o aluno clicou em um curso → vai para a página desse curso
//  - se não → vai para a lista de cursos
function paginaDeDestino() {
    if (cursoEscolhido) {
        return "curso.html?curso=" + cursoEscolhido;
    }
    return "cursos.html";
}

// Nas páginas Entrar e Cadastrar existe o link "Cadastre-se grátis" / "Entrar".
// Se o aluno trocar de página, o curso escolhido precisa ir junto!
const linkTrocarPagina = document.querySelector(".auth-switch a");

if (linkTrocarPagina && cursoEscolhido) {
    // getAttribute("href") lê o endereço atual do link (ex.: "cadastro.html")
    linkTrocarPagina.href = linkTrocarPagina.getAttribute("href") + "?curso=" + cursoEscolhido;
}


/*
   7) FORMULÁRIO DE LOGIN (entrar.html)  — PASSO 4

   Agora o login também é DE VERDADE: o Supabase confere
   se o e-mail existe e se a senha está correta.

   Funciona igual ao cadastro (Passo 3):
   async/await para esperar a resposta, e depois
   conferimos se veio resposta.error.

   SESSÃO: quando o login dá certo, o Supabase guarda
   uma "sessão" no navegador (como um crachá de visitante).
   Por isso o usuário continua logado mesmo trocando de
   página ou fechando o navegador. Vamos usar isso no Passo 6.
 */

const formLogin = document.getElementById("form-login");

if (formLogin) {

    // O evento "submit" acontece quando o formulário é enviado
    // (ao clicar no botão "Entrar" ou apertar Enter).
    formLogin.addEventListener("submit", async function (evento) {

        // Por padrão, enviar um formulário RECARREGA a página.
        // preventDefault() impede isso, para o JavaScript cuidar de tudo.
        evento.preventDefault();

        // .value = o que o usuário digitou no campo
        // .trim() = remove espaços em branco do começo e do fim
        const email = document.getElementById("login-email").value.trim();
        const senha = document.getElementById("login-senha").value;
        const mensagem = document.getElementById("msg-login");
        const botao = formLogin.querySelector("button[type='submit']");

        // O HTML (required e type="email") já confere se os campos estão
        // preenchidos. Aqui o JavaScript faz uma verificação EXTRA:
        if (senha.length < 6) {
            mostrarMensagem(mensagem, "A senha deve ter pelo menos 6 caracteres.", "erro");
            return; // "return" para a função aqui: o resto do código não roda
        }

        // ----- ENVIANDO PARA O SUPABASE -----
        botao.disabled = true;
        botao.textContent = "Entrando...";

        // auth.signInWithPassword = "entrar com e-mail e senha"
        const resposta = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: senha
        });

        botao.disabled = false;
        botao.textContent = "Entrar";

        // E-mail não cadastrado ou senha errada? Mostra o erro e para.
        if (resposta.error) {
            mostrarMensagem(mensagem, traduzirErro(resposta.error.message), "erro");
            return;
        }

        // Deu certo! Pegamos o nome que foi guardado no cadastro.
        // O caminho é: resposta → data → user → user_metadata → nome
        const nome = resposta.data.user.user_metadata.nome;

        mostrarMensagem(mensagem, "Bem-vindo de volta, " + nome + "! Redirecionando...", "sucesso");

        // setTimeout espera um tempo (em milissegundos) e depois executa o código.
        // 1500 ms = 1,5 segundo.
        setTimeout(function () {
            // PASSO 5: em vez de ir sempre para "cursos.html",
            // a função paginaDeDestino() decide (curso escolhido ou lista de cursos)
            window.location.href = paginaDeDestino();
        }, 1500);
    });
}


/*
   8) FORMULÁRIO DE CADASTRO (cadastro.html)  — PASSO 3

   AGORA É DE VERDADE! O cadastro não é mais uma simulação:
   os dados são enviados para o Supabase, que cria o usuário
   e guarda no banco de dados.

   NOVIDADES DESTE PASSO:
   - async / await: falar com o Supabase leva um tempinho,
     porque os dados vão pela internet. "await" significa
     "ESPERE a resposta chegar antes de continuar".
     Só podemos usar "await" dentro de uma função "async".
   - A resposta do Supabase tem duas partes:
       resposta.data  → os dados (o usuário criado)
       resposta.error → o erro (fica vazio se deu tudo certo)
 */

const formCadastro = document.getElementById("form-cadastro");

if (formCadastro) {

    // Repare no "async" antes de function: ele permite usar "await" lá dentro
    formCadastro.addEventListener("submit", async function (evento) {
        evento.preventDefault();

        const nome = document.getElementById("cadastro-nome").value.trim();
        const email = document.getElementById("cadastro-email").value.trim();
        const senha = document.getElementById("cadastro-senha").value;
        const confirmar = document.getElementById("cadastro-confirmar").value;
        const mensagem = document.getElementById("msg-cadastro");

        // O botão "Criar conta" (o botão de submit deste formulário)
        const botao = formCadastro.querySelector("button[type='submit']");

        // ----- VERIFICAÇÕES (iguais às de antes) -----

        // Verificação 1: o nome precisa ter pelo menos 3 letras
        if (nome.length < 3) {
            mostrarMensagem(mensagem, "Digite seu nome completo.", "erro");
            return;
        }

        // Verificação 2: tamanho mínimo da senha
        if (senha.length < 6) {
            mostrarMensagem(mensagem, "A senha deve ter pelo menos 6 caracteres.", "erro");
            return;
        }

        // Verificação 3: as duas senhas precisam ser iguais
        // !== significa "é diferente de"
        if (senha !== confirmar) {
            mostrarMensagem(mensagem, "As senhas não são iguais. Digite novamente.", "erro");
            return;
        }

        // ----- ENVIANDO PARA O SUPABASE -----

        // Desativa o botão enquanto espera, para o usuário não clicar duas vezes
        botao.disabled = true;
        botao.textContent = "Criando conta...";

        // auth.signUp = "cadastrar um usuário"
        //   email e password: dados de acesso (obrigatórios)
        //   options.data: informações EXTRAS que queremos guardar (aqui, o nome)
        const resposta = await supabaseClient.auth.signUp({
            email: email,
            password: senha,
            options: {
                data: { nome: nome }
            }
        });

        // A resposta chegou: reativa o botão
        botao.disabled = false;
        botao.textContent = "Criar conta";

        // Se veio algum erro, mostra (em português) e para aqui
        if (resposta.error) {
            mostrarMensagem(mensagem, traduzirErro(resposta.error.message), "erro");
            return;
        }

        // Deu tudo certo! O usuário foi criado e JÁ ESTÁ LOGADO.
        // O sinal de + junta textos (isso se chama "concatenar").
        mostrarMensagem(mensagem, "Conta criada com sucesso, " + nome + "! Redirecionando...", "sucesso");

        // Depois de 2 segundos, leva para o curso escolhido ou para a lista de cursos
        // (PASSO 5: a função paginaDeDestino() decide)
        setTimeout(function () {
            window.location.href = paginaDeDestino();
        }, 2000);
    });
}


/*
   9) FORMULÁRIO DE CONTATO (contato.html)
 */

const formContato = document.getElementById("form-contato");

if (formContato) {

    formContato.addEventListener("submit", function (evento) {
        evento.preventDefault();

        const nome = document.getElementById("contato-nome").value.trim();
        const mensagemTexto = document.getElementById("contato-mensagem").value.trim();
        const mensagem = document.getElementById("msg-contato");

        // Verificação extra: a mensagem não pode ser curta demais
        if (mensagemTexto.length < 10) {
            mostrarMensagem(mensagem, "Sua mensagem está muito curta. Escreva um pouco mais.", "erro");
            return;
        }

        // Simula o envio (em um site real, os dados iriam para o servidor)
        mostrarMensagem(mensagem, "Obrigado, " + nome + "! Sua mensagem foi enviada. Responderemos em breve.", "sucesso");

        // reset() limpa todos os campos do formulário
        formContato.reset();
    });
}


/*
   10) PÁGINA DO CURSO (curso.html)  — PASSO 5

   Uma única página serve para TODOS os cursos.
   Os dados de cada curso ficam guardados aqui, em um
   OBJETO: uma "lista com etiquetas".
   A etiqueta (ex.: "python") é o mesmo valor que vem
   no endereço: curso.html?curso=python

   Futuramente, esses dados poderão vir de uma tabela
   no banco de dados do Supabase.
 */
const listaDeCursos = {
    "logica-programacao": {
        titulo: "Lógica de Programação",
        categoria: "Programação",
        descricao: "Aprenda os fundamentos da lógica para desenvolver qualquer programa.",
        icone: "code",
        cor: "icon-blue",
        aulas: 12
    },
    "html-css": {
        titulo: "HTML e CSS",
        categoria: "Desenvolvimento Web",
        descricao: "Crie páginas web modernas aprendendo HTML e CSS desde o zero.",
        icone: "web",
        cor: "icon-orange",
        aulas: 14
    },
    "javascript": {
        titulo: "JavaScript Básico",
        categoria: "Desenvolvimento Web",
        descricao: "Introdução ao JavaScript para tornar suas páginas web interativas.",
        icone: "data_object",
        cor: "icon-yellow",
        aulas: 16
    },
    "informatica-basica": {
        titulo: "Informática Básica",
        categoria: "Informática",
        descricao: "Aprenda o essencial sobre computadores, internet e produtividade.",
        icone: "computer",
        cor: "icon-green",
        aulas: 10
    },
    "banco-de-dados": {
        titulo: "Banco de Dados",
        categoria: "Dados",
        descricao: "Entenda como guardar e consultar informações usando SQL.",
        icone: "database",
        cor: "icon-purple",
        aulas: 11
    },
    "redes": {
        titulo: "Redes de Computadores",
        categoria: "Informática",
        descricao: "Descubra como os computadores se conectam e conversam entre si.",
        icone: "lan",
        cor: "icon-orange",
        aulas: 9
    },
    "python": {
        titulo: "Python para Iniciantes",
        categoria: "Programação",
        descricao: "Dê os primeiros passos em Python, uma linguagem simples e muito usada.",
        icone: "terminal",
        cor: "icon-blue",
        aulas: 15
    },
    "planilhas": {
        titulo: "Planilhas Eletrônicas",
        categoria: "Dados",
        descricao: "Organize informações e faça cálculos com fórmulas e gráficos.",
        icone: "table_chart",
        cor: "icon-green",
        aulas: 8
    },
    "git-github": {
        titulo: "Git e GitHub",
        categoria: "Programação",
        descricao: "Salve as versões dos seus projetos e compartilhe seu código na internet.",
        icone: "account_tree",
        cor: "icon-purple",
        aulas: 8
    }
};


// Função que monta a página do curso. Ela é "async" porque
// precisa ESPERAR (await) o Supabase dizer se o aluno está logado.
async function carregarPaginaDoCurso() {

    // ----- 1º) O ALUNO ESTÁ LOGADO? -----
    // getSession() pergunta ao Supabase se existe uma sessão (o "crachá" do login).
    const resposta = await supabaseClient.auth.getSession();

    // ! significa "NÃO". Ou seja: "se NÃO existe sessão..."
    if (!resposta.data.session) {
        // ...manda para o login, levando o curso junto no endereço.
        // Depois do login, a função paginaDeDestino() traz o aluno de volta para cá!
        let enderecoDoLogin = "entrar.html";
        if (cursoEscolhido) {
            enderecoDoLogin = enderecoDoLogin + "?curso=" + cursoEscolhido;
        }
        window.location.href = enderecoDoLogin;
        return;
    }

    // ----- 2º) QUAL CURSO MOSTRAR? -----
    // listaDeCursos["python"] devolve os dados do curso Python.
    // Se o valor do endereço não existir na lista, devolve undefined (nada).
    const curso = listaDeCursos[cursoEscolhido];

    if (!curso) {
        tituloDoCurso.textContent = "Curso não encontrado";
        document.getElementById("curso-descricao").textContent =
            "Não encontramos este curso. Volte para a lista e escolha outro.";
        document.getElementById("curso-em-breve").hidden = true; // esconde o aviso
        return;
    }

    // ----- 3º) PREENCHE A PÁGINA COM OS DADOS DO CURSO -----
    document.title = curso.titulo + " | Escola Digital Livre"; // texto da aba
    tituloDoCurso.textContent = curso.titulo;
    document.getElementById("curso-categoria").textContent = curso.categoria;
    document.getElementById("curso-descricao").textContent = curso.descricao;
    document.getElementById("curso-aulas").textContent = curso.aulas;
    document.getElementById("curso-icone-nome").textContent = curso.icone;

    // Troca a cor do quadrado: mantém as classes fixas e acrescenta a cor do curso
    document.getElementById("curso-icone").className = "course-icon course-hero-icon " + curso.cor;
}


// Só roda na página curso.html (a única que tem o id "curso-titulo")
const tituloDoCurso = document.getElementById("curso-titulo");

if (tituloDoCurso) {
    carregarPaginaDoCurso();
}


/*
   11) QUEM ESTÁ LOGADO? HEADER E BOTÃO SAIR  — PASSO 6

   Esta parte roda em TODAS as páginas e faz 3 coisas:

   1. Nas páginas Entrar e Cadastrar: se o aluno JÁ está
      logado, não faz sentido entrar de novo → vai direto
      para os cursos (ou para o curso escolhido).

   2. Nas outras páginas: se o aluno está logado, o header
      mostra "Olá, Nome!" e o botão "Começar agora" vira "Sair".

   3. Ao clicar em "Sair", o Supabase encerra a sessão
      (rasga o "crachá") e o aluno volta para a página inicial.
 */
async function verificarUsuarioLogado() {

    // Pergunta ao Supabase se existe uma sessão (igual à página do curso)
    const resposta = await supabaseClient.auth.getSession();
    const sessao = resposta.data.session;

    // ----- 1. JÁ ESTÁ LOGADO E ABRIU O LOGIN OU O CADASTRO? -----
    // formLogin e formCadastro foram criados nas partes 7 e 8.
    // Eles só existem (não são null) nas páginas entrar.html e cadastro.html.
    if (sessao && (formLogin || formCadastro)) {
        window.location.href = paginaDeDestino();
        return;
    }

    // Ninguém logado? Então o header continua como está ("Começar agora").
    if (!sessao) {
        return;
    }

    // ----- 2. MOSTRA O NOME NO HEADER -----
    // O nome foi guardado no cadastro (Passo 3).
    // || "aluno" = se por acaso não tiver nome, usa a palavra "aluno"
    const nomeCompleto = sessao.user.user_metadata.nome || "aluno";

    // split(" ") corta o texto em pedaços em cada espaço:
    //   "Ana Souza".split(" ")  →  ["Ana", "Souza"]
    // [0] pega o PRIMEIRO pedaço (as listas começam a contar do zero!)
    const primeiroNome = nomeCompleto.split(" ")[0];

    const saudacao = document.getElementById("saudacao");
    if (saudacao) {
        saudacao.textContent = "Olá, " + primeiroNome + "!";
        saudacao.hidden = false; // tira o "hidden": a saudação aparece
    }

    // ----- 3. "COMEÇAR AGORA" VIRA "SAIR" -----
    // .btn-primary = botão do header (computador)
    // .nav-link-mobile = link "Entrar / Cadastrar" do menu (celular)
    const botoesSair = document.querySelectorAll(".btn-primary, .nav-link-mobile");

    botoesSair.forEach(function (botao) {
        botao.textContent = "Sair";
        botao.href = "#";
        botao.addEventListener("click", sair); // ao clicar, chama a função sair
    });
}


// Função chamada ao clicar em "Sair"
async function sair(evento) {
    // O link agora é "#". preventDefault impede que a página pule para o topo.
    evento.preventDefault();

    // auth.signOut = "sair da conta": o Supabase apaga a sessão do navegador
    await supabaseClient.auth.signOut();

    // Volta para a página inicial, já como visitante
    window.location.href = "index.html";
}


// Chama a função assim que a página abre
verificarUsuarioLogado();
