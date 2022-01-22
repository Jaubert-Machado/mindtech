// Query Selectors //

const btnOpenForm = document.querySelector(".btn-plus-round");
const formContainer = document.querySelector(".activity-form");
const listDisplay = document.querySelector(".list-display");
const listContainer = document.querySelector(".list-container");
const background = document.querySelector(".background");
const formInput = document.querySelectorAll(".new-activity-input");
const listItem = document.querySelector(".list-item");
const btnPlus = document.querySelector(".btn-plus-round");
const btnDel = document.querySelector(".btn-del");
const btnDone = document.querySelector(".btn-done");
const doneDisplay = document.querySelector(".done-display");

/**
 * @class
 * @description Class e constructor para a criação de cada elemento da lista.
 */
class TodoList {
  constructor(data) {
    this.title = data.title;
    this.description = data.description;
    this.date = this._getSubmitTime();
  }

  /**
   * @method
   * @returns a data formatada para o padrão brasileiro.
   */
  _getSubmitTime() {
    const date = new Date();
    const dateLocal = new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "full",
    }).format(date);
    const dateUppercase =
      dateLocal.charAt(0).toUpperCase() + dateLocal.slice(1);

    return dateUppercase;
  }

  /**
   * @method
   * @param {Object | Element}
   * Cria o markup com os dados fornecidos pelo primeiro parametro e o insere no parent também especificado no segundo parametro.
   */
  _render(data, parent) {
    const markup = `
        <li class="list-item">
          <h2 class="title-activity">${data.title}</h2>
            <p class="description-activity">${
              data.description ? data.description : ""
            }</p>
            <span class="date-activity">${data.date}</span>
            <button class="btn-del">Deletar</button>
            <button class="btn-edit">Editar</button>
            <span class="description-box"></span>
            <button class="btn-done complete-task">
            <i class="ph-check complete-task"></i></button>
        </li>
      `;

    parent.insertAdjacentHTML("afterbegin", markup);
  }
}

/**
 *
 * @param {Array} domEl array com DOM elements a serem manipulados
 * @param {string} tgClassHidden class a ser "toggleada"
 * @param {string} tgClassMov class a ser "toggleada"
 * Para evitar a repetição de código já que faço essa mesma sequencia de toggle em duas situações diferentes preferi fazer uma function para isso, essa function pega uma array de elementos e alterna as classes de acordo com a classe fornecida no segundo e terceiro argumento.
 *
 */

const togglerFunction = function (domEl, tgClassHidden, tgClassMov) {
  domEl[0].classList.toggle(tgClassHidden);
  domEl[1].classList.toggle(tgClassHidden);
  domEl[2].classList.toggle(tgClassMov);
};

const toggled = [formContainer, btnOpenForm, listContainer];

background.addEventListener("click", function () {
  if (!formContainer.classList.contains("hidden")) {
    togglerFunction(toggled, "hidden", "list-container-movement");
  }
});

btnOpenForm.addEventListener("click", function () {
  togglerFunction(toggled, "hidden", "list-container-movement");
});

/**
 * Aqui aguardo pelo submit do usuario usando spread com new FormData, como os dados vem em arrays com o label e os dados separadamente, guardo eles em uma array juntos e em seguida os transformo em um objeto, depois chamo a class/constructor com esses dados para criar o elemento exibido.
 */
formContainer.addEventListener("submit", function (e) {
  e.preventDefault();
  const dataArr = [...new FormData(this)];
  const data = Object.fromEntries(dataArr);
  const formData = new TodoList(data);

  // Removo o state padrão dos elementos //
  listContainer.classList.remove("list-container-default");
  btnPlus.classList.remove("btn-plus-round-default");

  // Limpo o form //
  formInput.forEach((e) => (e.value = ""));

  // Uso o metodo criado na class para renderizar o elemento //
  formData._render(formData, listDisplay);
});

listDisplay.addEventListener("click", function (e) {
  const container = e.target.closest("li");

  if (e.target.classList.contains("btn-del")) {
    // Crio o botão delete selecionando o elemento li enteiro e o removendo //
    const delet = e.target.closest("li");
    delet.remove(delet);
  } else if (e.target.textContent === "Editar") {
    // Crio o botão editar ao selecionar os antigos elementos e pegar seus valores, crio dois inputs com os valores ja inseridos no antigo para edição e depois substituo os valores antigos pelos novos valores //
    const [oldTitle, oldDescription] = container.children;
    const newTitle = document.createElement("input");
    const newDescription = document.createElement("textarea");

    newTitle.classList.add("input-edit-title");
    newDescription.classList.add("input-edit-description");

    newDescription.type = "text";
    newDescription.value = oldDescription.textContent;
    newTitle.type = "text";
    newTitle.value = oldTitle.textContent;

    container.insertBefore(newTitle, oldTitle);
    container.insertBefore(newDescription, oldDescription);

    container.removeChild(oldTitle);
    container.removeChild(oldDescription);

    e.target.textContent = "Salvar";
  } else if (e.target.textContent === "Salvar") {
    // Crio os novos elementos, substituo seus valores, os insiro em seus devidos lugares e removo os inputs edits //
    const [newTitle, newDescription] = container.children;
    const newTitleEl = document.createElement("h2");
    const newDescriptionEl = document.createElement("p");

    newTitleEl.textContent = newTitle.value;
    newDescriptionEl.textContent = newDescription.value;

    container.insertBefore(newTitleEl, newDescription);
    container.insertBefore(newDescriptionEl, newDescription);
    newTitle.remove();
    newDescription.remove();

    e.target.textContent = "Editar";
  } else if (e.target.classList.contains("complete-task")) {
    const li = e.target.closest("li");
    li.classList.toggle("activity-done");
    li.children[0].classList.toggle("done");
    li.children[1].classList.toggle("done");
    li.children[6].classList.toggle("btn-done-green");
  }
});
