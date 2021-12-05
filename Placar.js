class Placar {
  #pontos = 0;

  get pontos() {
    return this.#pontos;
  }
  set pontos(ponto) {
    const placar = document.querySelector(".pontuacao");
    this.#pontos = ponto;
    placar.textContent = this.#pontos;
  }
}
