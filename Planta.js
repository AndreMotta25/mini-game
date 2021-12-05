class Planta {
  #lifeProgress;
  #img;
  #seletor;
  #id;
  #viva;
  #loop;
  static ObjPlacar;
  static pla = [];

  constructor(img, life) {
    this.amarela = false;
    this.#lifeProgress = life;
    this.#img = img;
    this.#id = this.setId();
    this.#seletor = `#${this.#id} .life::before`;
    this.#viva = true;
    this.click = 0;
    this.init();

    if (Planta.pla.length <= 0) {
      Planta.pla.push(this);
    }
  }
  /**
   * utiliza o metodo criarVaso, para colocar a planta no navegador
   **/
  montarPlanta() {
    const canteiro = document.querySelector(".container-plantas");
    let planta = this.criarVaso();
    planta.innerHTML = `<div class="life"></div><img src="${
      this.#img
    }" alt=""/>`;
    canteiro.appendChild(planta);
    this.planta = planta;
    planta.addEventListener("click", this.molhar.bind(this));
  }
  /** cria o elemento lista, e insere a classe planta(é o vaso da "planta")*/
  criarVaso() {
    let planta = document.createElement("li");
    planta.classList.add("planta");
    planta.setAttribute("data-click", "0");
    planta.id = this.#id;
    return planta;
  }
  /** usa o metodo loseLife para retirar a vida, para isso faz um loop com o interval para tal */
  diminuiBarra() {
    console.log(document.styleSheets[0].cssRules);
    this.#loop = setInterval(() => {
      this.loseLife();
    }, 150);
  }
  /**é o metodo que retirar a "vida" da planta*/
  loseLife() {
    // se a vida estiver entre 32 e 100, a planta vai perdendo a vida
    if (this.#viva) {
      if (this.amarela) {
        if (this.#lifeProgress >= 31 && this.#lifeProgress <= 69) {
          this.plantaBoa();
        } else if (this.#lifeProgress >= 70 && this.#lifeProgress <= 100) {
          this.florecendo();
        } else if (this.#lifeProgress >= 0 && this.#lifeProgress <= 31) {
          this.plantaMorrrendo();
        } else if (this.#lifeProgress >= 100) {
          Planta.mataTodasPlantas();
        } else {
          Planta.mataTodasPlantas();
        }
      } else {
        if (this.#lifeProgress >= 32 && this.#lifeProgress <= 100) {
          this.plantaBoa();
        } else if (this.#lifeProgress >= 0 && this.#lifeProgress <= 31) {
          this.plantaMorrrendo();
        } else if (this.#lifeProgress >= 100) {
          Planta.mataTodasPlantas();
        } else {
          Planta.mataTodasPlantas();
        }
      }
    }
  }
  /**procura o indice para ser excluido*/
  procuraIndice() {
    let indice;
    let objCss = document.styleSheets[0].cssRules;
    for (let i = 0; i < objCss.length; i++) {
      if (objCss[i].selectorText === this.#seletor) {
        indice = i;
        return indice;
      }
    }
    return -1;
  }
  /**utiliza o metodo procuraIndice para achar o indice e exclui-lo*/
  excluir() {
    let indice = this.procuraIndice();
    if (indice === -1) {
      return false;
    }
    document.styleSheets[0].deleteRule(indice);
    return true;
  }
  setId() {
    const totPlantas = document.querySelectorAll(".planta");
    return "planta" + (totPlantas.length + 1);
  }
  /** 
   * muda a cor da planta para verde, e retira 1 ponto de vida a cada segundo, isso se
     a porcentagem de vida estiver entre 32 e 100%
  */
  plantaBoa() {
    this.planta.children[1].src = "./Assets/Figures/plant-default.png";
    let regra = "";
    regra = `${this.#seletor}{width:${
      this.#lifeProgress
    }% !important; background-color: green; border-radius:10px;}`;
    this.excluir();
    document.styleSheets[0].insertRule(regra);
    this.#lifeProgress -= 1;
    console.log("diminuindo");
  }
  /**  muda a cor da planta para marrom, e retira 1 ponto de vida a cada segundo,
   *   isso se a porcentagem de vida estiver entre 32 e 100%
   */
  plantaMorrrendo() {
    this.planta.children[1].src = "./Assets/Figures/plant-dying-flies.gif";
    let regra = "";
    regra = `${this.#seletor}{width:${
      this.#lifeProgress
    }% !important; background-color:brown; border-radius:10px; }`;
    this.excluir();
    document.styleSheets[0].insertRule(regra);
    this.#lifeProgress -= 1;
    if (Planta.ObjPlacar.pontos > 0) {
      this.atribuiPontos(-100);
    }

    console.log("diminuindo 2");
  }
  /**quando uma unica planta morrer, e algumas ainda estiverem vivas, esse metodo vai ser o responsavel por zerar suas vidas*/
  mata() {
    this.planta.children[1].src = "./Assets/Figures/plant-dying-flies.gif";
    this.excluir();
    console.log("apagando");
    this.#lifeProgress = 0;
    let regra = "";
    regra = `${this.#seletor}{width:${
      this.#lifeProgress
    }% !important; background-color:brown; border-radius:10px;}`;
    document.styleSheets[0].insertRule(regra);
    this.#viva = false;
    // acaba com o loop
    clearInterval(this.#loop);
    this.planta.dataset.viva = false;
  }
  florecendo() {
    this.planta.children[1].src = "./Assets/Figures/plant-flower.png";
    let regra = "";
    regra = `${this.#seletor}{width:${
      this.#lifeProgress
    }% !important; background-color:yellow !important; border-radius:10px;}`;
    this.excluir();
    document.styleSheets[0].insertRule(regra);
    this.#lifeProgress -= 1;
    console.log("florescendo");
  }

  /**molha a planta, e nas condinçoes 'ideais' cria ramos  */
  molhar() {
    this.click += 1;
    this.#lifeProgress += 10;
    this.atribuiPontos(50);
    // a planta só vai poder ter um ramo, quando a vida for acima de 32
    // aqui estamos tambem controlando quantos ramos uma planta pode ter(3);
    if (this.click >= 5 && Planta.pla.length < 3 && this.#lifeProgress > 32) {
      this.atribuiPontos(500);
      this.planta.children[1].src = "./Assets/Figures/plant-flower.png";
      this.amarela = true;
      console.log(this.planta);
      this.click = 0;
      // usa um metodo estatico
      Planta.getPlantasExistentes(
        new Planta("./Assets/Figures/plant-default.png", 50)
      );
    }
  }
  /*inicia os metodos montarPlanta e diminuirBarra para o construtor(assim ninguem precisa de mexer nisso)*/
  init() {
    this.montarPlanta();
    this.diminuiBarra();
  }
  /**vai ser responsavel por guardar as outras instancias da planta, veja, isso tecnicamente não é composiçao pq as plantas ficam
   * dentro de uma propriedade estatica, logo elas vão pertencer a classe e não a um outro objeto planta
   */
  static getPlantasExistentes(obj) {
    Planta.pla.push(obj);
    console.log(Planta.pla);
  }
  /** quando ocorrer o gameOver, este metodo vai ser responsavel por retirar todos os eventos de clicks que as plantas ainda teriam.
   * aqui tive que usar uma gambiarra, usei um clone para substituir o elemento original e o clone não carrega os eventos atribuidos.
   * Fiz isso pq não estava conseguindo retirar os eventos com o removeEventListener
   */
  static removeEventos() {
    let planta1 = document.querySelectorAll(".planta");
    planta1.forEach((elem) => {
      elem.outerHTML = elem.cloneNode(true).outerHTML;
    });
  }
  /**
   * Assim que uma planta morrer, todas as outras existentes tambem serão mortas
   * */
  static mataTodasPlantas() {
    console.log("entrei");
    let contador = 0;
    Planta.pla.forEach((planta) => {
      console.log("matei");
      planta.mata();
      contador++;
    });
    Planta.removeEventos();
    console.log(contador);
    window.alert("game over!!!");
  }
  /**aqui eu vou passar o objeto placar, a propriedade statica ObjPlacar vai receber o objeto(agregação)*/
  static placar(obj) {
    Planta.ObjPlacar = obj;
  }
  /**atribui os pontos no objeto Placar*/
  atribuiPontos(pontos) {
    Planta.ObjPlacar.pontos += pontos;
  }
}
