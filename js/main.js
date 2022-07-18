const url = 'https://jsonplaceholder.typicode.com/posts'

const loadingElement  = document.querySelector("#loading")
const postsContainer = document.querySelector("#posts-container")

const postPage = document.querySelector('#post')
const postContainer = document.querySelector('#post-container')
const commentsContainer = document.querySelector('#comments-container')

const commentForm = document.querySelector('#comment-form')
const emailInput = document.querySelector('#email')
const bodyInput = document.querySelector('#body')

//Pegar id da URL
const urlSearchParams = new URLSearchParams(window.location.search)
const postId = urlSearchParams.get('id')



//Pegar todos os posts
 async function getAllPosts() {

    //o await faz  a conts response esperar o resultado da função fetch
    const response = await fetch(url)

    console.log(response)

    //o padrão do nome é data mas podia ser posts pois é o nome do dado que vamos receber, aqui esperamos os dados da resposta/response que é convertida em json
    const data = await response.json()

    console.table(data)

    //faz com que quando os dados da api forem carregados o elemento loadingElement presente no nosso html ira receber a class hide, que faz com seu display se torne none dessa forma sumindo da pagina
    loadingElement.classList.add('hide')

    //passa em cada um dos elementos recebidos da requisição e os chama de post
    data.map((post) => {

        const div = document.createElement('div')
        const title = document.createElement('h2')
        const body = document.createElement('p')
        const link = document.createElement('a')

        //pega o title de cada 'post' obtido pela requisição da api e o armazena dentro do elemento title do html, pegamos o titulo do post acessando a propriedade do mesmo post.title, ou podia ser o id tbm post.id e etc
        title.innerText = post.title

        //pega o conteudo escrito em cada 'post' gerado pela api
        body.innerText = post.body
        link.innerText = 'Ler'

        //criamos o link para estar presente em cada post, quando o link for clicado ele ira redicionar para um arquivo html que mostra somente as informações do post selecionado
        link.setAttribute('href', `./post.html?id=${post.id}`)

        //adicionando os dados obtidos dentro da div
        div.appendChild(title)
        div.appendChild(body)
        div.appendChild(link)

        //adicionando no html
        postsContainer.appendChild(div)

    })

 }

 //Pegar post individual
 async function getPost (id) {

    //desestruturação de array
    const [responsePost, responseComments] = await Promise.all([
        fetch(`${url}/${id}`),
        fetch(`${url}/${id}/comments`)
    ])

    const dataPost = await responsePost.json()

    const dataComments = await responseComments.json()

    loadingElement.classList.add('hide')
    postPage.classList.remove('hide')

    const title = document.createElement('h1')
    const body = document.createElement('p')

    title.innerText = dataPost.title;
    body.innerText = dataPost.body;

    postContainer.appendChild(title)
    postContainer.appendChild(body)

    console.log(dataComments)

    dataComments.map((comment) => {
        createComment(comment)
    })
    
 }

 function createComment(comment) {
    
    const div = document.createElement('div')
    const email = document.createElement('h3')
    const commentBody = document.createElement('p')

    email.innerHTML = comment.email
    commentBody.innerText = comment.body

    div.appendChild(email)
    div.appendChild(commentBody)

    commentsContainer.appendChild(div)

 }

 //Postar comentario
 async function postComment(comment){

    const response = await fetch(`${url}/${postId}/comments`, {
        method: 'POST',
        body: comment,
        headers: {
            'Content-type': 'application/json' 
        },
    })

    const data = await response.json()

    createComment(data)

 }

 if(!postId){
    getAllPosts();
 } else {
    getPost(postId)

    //adcionar evento do comment form
    commentForm.addEventListener('submit', (e) => {

        e.preventDefault()
        let comment = {
            email: emailInput.value,
            body: bodyInput.value
        }

        //transforma o texto em formato de JSON
        comment = JSON.stringify(comment)

        //insere o comentario no sistema
        postComment(comment)

    })
 }