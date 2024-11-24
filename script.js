const httpClient = {
    // Objeto que faz requisições HTTP
    baseUrl: 'http://localhost:3000', // URL base da API
    endpointFormatter(endpoint) {
      // Função que formata o endpoint
      if (!endpoint.startsWith('/')) {
        endpoint = `/${endpoint}`;
      }
      return endpoint;
    },
  
    /**
     * Função que faz requisições GET
     * @param {string} endpoint - Endpoint da requisição
     * @param {object} queries - Parâmetros da query string
     * @returns {Promise} - Promise com a resposta da requisição
     */
    async get(endpoint, queries) {
      // Função que faz requisições GET
      endpoint = this.endpointFormatter(endpoint);
      if (queries) {
        const queryString = new URLSearchParams(queries).toString();
        endpoint = `${endpoint}?${queryString}`;
      }
      return fetch(`${this.baseUrl}${endpoint}`).then(
        async (response) => await response.json()
      );
    },
  };
  
  // explicação httpClient
  /**
   * O objeto httpClient é responsável por fazer requisições HTTP para a nossa API.
   * Ele é uma abstração para a função fetch, que é nativa do JavaScript e utilizada para fazer requisições HTTP. No objeto httpClient, temos a propriedade baseUrl, que armazena a URL base da nossa API, e a função endpointFormatter, que formata o endpoint da requisição.
   * A função get do objeto httpClient é responsável por fazer requisições GET para a nossa API. Ela recebe como argumento o endpoint da requisição e um objeto queries, que contém os parâmetros da query string da requisição. A função endpointFormatter é utilizada para formatar o endpoint da requisição, garantindo que ele comece com uma barra (/).
   * A função get utiliza o método fetch para fazer a requisição GET para a API. Ela concatena a URL base com o endpoint e, caso existam queries, adiciona-as à URL. Por fim, a função retorna a resposta da requisição em formato JSON.
   * Com o objeto httpClient, podemos fazer requisições GET para a nossa API de forma mais simples e organizada.
   */
  
  window.addEventListener('DOMContentLoaded', () => {
    // Evento que é disparado quando o conteúdo da página é carregado
  
    // Elementos do DOM
    const btnPrevious = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    const spanCurrentPage = document.getElementById('current-page');
  
    // Variáveis de controle
    let currentPage = 1;
    let totalPages = 0;
    let todos = [];
  
    function updateButtons() {
      // Função que atualiza o estado dos botões de navegação
      btnPrevious.disabled = currentPage === 1;
      btnNext.disabled = currentPage === totalPages;
    }
  
    async function updatePage(page) {
      const data = await httpClient.get('/todos', { page });
      totalPages = data.totalPages;
      currentPage = data.currentPage;
      spanCurrentPage.textContent = currentPage;
      updateButtons();
      todos = data.todos;
      renderTodos();
    }
  
    function renderTodos() {
      // Função que renderiza os todos na página
      const ul = document.getElementById('list-todo');
      ul.innerHTML = ''; // Limpa a lista de todos
  
      /**
       * Para cada todo, cria um elemento li com as informações do todo e adiciona à lista ul.
       * Cada todo é representado por um card com o nome, a descrição e um checkbox para marcar como feito ou pendente.
       * O evento change do checkbox atualiza o estado do todo e a classe done do card. Além disso, o texto do card é atualizado para refletir o estado do todo. OBS: O update do todo é apenas no front-end, não é persistido no back-end.
       * A função renderTodos é responsável por renderizar os todos na página, criando um card para cada todo e adicionando-o à lista ul.
       */
      todos.forEach((todo) => {
        const li = document.createElement('li');
        li.classList.add('card');
        if (todo.done) li.classList.add('done');
  
        const h3 = document.createElement('h3');
        h3.textContent = todo.name;
        const p = document.createElement('p');
        p.textContent = todo.description;
        const divDone = document.createElement('div');
        divDone.classList.add('card-checkbox');
        const textDone = document.createElement('span');
        textDone.textContent = todo.done ? 'Feito' : 'Pendente';
        const inputDone = document.createElement('input');
        inputDone.type = 'checkbox';
        inputDone.checked = todo.done;
        inputDone.classList.add('checkbox');
        inputDone.addEventListener('change', () => {
          todo.done = inputDone.checked;
          li.classList.toggle('done');
          textDone.textContent = todo.done ? 'Feito' : 'Pendente';
        });
  
        divDone.appendChild(textDone);
        divDone.appendChild(inputDone);
  
        li.appendChild(h3);
        li.appendChild(p);
        li.appendChild(divDone);
        ul.appendChild(li);
      });
    }
  
    btnPrevious.addEventListener('click', () => {
      updatePage(currentPage - 1);
    });
  
    btnNext.addEventListener('click', () => {
      updatePage(currentPage + 1);
    });
  
    // onLoad
    /**
     * Aqui não é utilizado o async/await, pois não é utilizado o async na função de callback do evento DOMContentLoaded.
     *  Por isso, é utilizado o método then para lidar com a Promise retornada pela função get do httpClient.
     */
    httpClient.get('/todos').then((data) => {
      todos = data.todos;
      currentPage = data.currentPage;
      totalPages = data.totalPages;
      renderTodos();
      updateButtons();
    });
  });