document.getElementById('calcular').addEventListener('click', function() {
    // Obter valores
    const valorImovel = document.getElementById('valor-imovel').value;
    const entrada = document.getElementById('entrada').value;
    const taxaJurosAnual = document.getElementById('taxa-juros').value;
    const numeroParcelas = document.getElementById('numero-parcelas').value;
    const valorAluguel = document.getElementById('valor-aluguel').value;
    const amortizacaoMensal = document.getElementById('amortizacao-mensal').value;
    const comissaoImobiliaria = document.getElementById('comissao-imobiliaria').checked;

    // Salvar valores no LocalStorage
    localStorage.setItem('valorImovel', valorImovel);
    localStorage.setItem('entrada', entrada);
    localStorage.setItem('taxaJurosAnual', taxaJurosAnual);
    localStorage.setItem('numeroParcelas', numeroParcelas);
    localStorage.setItem('valorAluguel', valorAluguel);
    localStorage.setItem('amortizacaoMensal', amortizacaoMensal);
    localStorage.setItem('comissaoImobiliaria', comissaoImobiliaria);

    // Aqui você pode chamar a função para calcular e exibir os resultados
    exibirValorTotalComJurosEAmortizacao();
});


document.addEventListener('DOMContentLoaded', function() {
    // Recuperar valores
    document.getElementById('valor-imovel').value = localStorage.getItem('valorImovel') || '';
    document.getElementById('entrada').value = localStorage.getItem('entrada') || '';
    document.getElementById('taxa-juros').value = localStorage.getItem('taxaJurosAnual') || '';
    document.getElementById('numero-parcelas').value = localStorage.getItem('numeroParcelas') || '';
    document.getElementById('valor-aluguel').value = localStorage.getItem('valorAluguel') || '';
    document.getElementById('amortizacao-mensal').value = localStorage.getItem('amortizacaoMensal') || '';
    document.getElementById('comissao-imobiliaria').checked = (localStorage.getItem('comissaoImobiliaria') === 'true');

    // Opcional: Automaticamente calcular e exibir os resultados ao carregar se todos os campos necessários estiverem preenchidos
    if (localStorage.getItem('valorImovel') && localStorage.getItem('entrada') && localStorage.getItem('taxaJurosAnual') && localStorage.getItem('numeroParcelas')) {
        exibirValorTotalComJurosEAmortizacao();
    }
});
