    // Função para converter taxa de juros anual para mensal
    function converterTaxaAnualParaMensal(taxaAnual) {
        return (Math.pow(1 + taxaAnual, 1/12) - 1);
    }

    // Função para calcular a parcela mensal pelo método PRICE
    function calcularParcelaMensal(valorFinanciado, taxaJurosAnual, numeroParcelas) {
        const taxaJurosMensal = converterTaxaAnualParaMensal(taxaJurosAnual);
        return valorFinanciado * (taxaJurosMensal * Math.pow(1 + taxaJurosMensal, numeroParcelas)) / (Math.pow(1 + taxaJurosMensal, numeroParcelas) - 1);
    }

    // Função para calcular o valor total a ser pago com juros
    function calcularValorTotalComJuros(valorImovel, entrada, taxaJurosAnual, numeroParcelas) {
        const valorFinanciado = valorImovel - entrada;
        const parcelaMensal = calcularParcelaMensal(valorFinanciado, taxaJurosAnual / 100, numeroParcelas); // A taxa de juros é passada como percentual
        return parcelaMensal * numeroParcelas;
    }
  

    $(document).ready(function() {
        $('#valor-imovel, #entrada, #valor-aluguel, #amortizacao-mensal').maskMoney({
            prefix: 'R$ ',
            thousands: '.', // Separador de milhar
            decimal: ',', // Separador decimal
            allowZero: true, // Permite o valor zero
            allowNegative: false, // Não permite valores negativos
        });

        // Inicializa os campos com '0,00'
        $('#valor-imovel, #entrada, #valor-aluguel,  #amortizacao-mensal').maskMoney('mask', 0);
    });

    $(document).ready(function() {
        $('#taxa-juros').maskMoney({
            thousands: '.', // Separador de milhar
            decimal: ',', // Separador decimal
            allowZero: true, // Permite o valor zero
            allowNegative: false, // Não permite valores negativos
        });

        // Inicializa os campos com '0,00'
        $('#taxa-juros').maskMoney('mask', 0);
    });

    // Função para gerar e exibir a tabela de amortização
    function gerarTabelaAmortizacao(valorImovel, entrada, taxaJurosAnual, numeroParcelas, valorAluguel) {
        const valorFinanciado = valorImovel - entrada;
        const taxaJurosMensal = converterTaxaAnualParaMensal(taxaJurosAnual / 100); // Converte a taxa anual para mensal
        let saldoDevedor = valorFinanciado; // Define o saldo devedor inicial baseado no valor financiado
        const parcelaMensal = calcularParcelaMensal(valorFinanciado, taxaJurosAnual / 100, numeroParcelas); // Calcula a parcela mensal        
        
        let tabela = `<h2>Simulação das Parcelas do Financiamento</h2>
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Mês</th>
                                <th>Parcela</th>
                                <th>Juros do Mês</th>
                                <th>Amortização do Mês</th>
                                <th>Saldo Devedor</th>
                                <th>ROI do Aluguel</th>
                            </tr>
                        </thead>
                        <tbody>`;
        
        for (let mes = 1; mes <= numeroParcelas; mes++) {
            const jurosMes = saldoDevedor * taxaJurosMensal; // Calcula os juros do mês
            const amortizacaoMes = parcelaMensal - jurosMes; // Calcula a amortização do mês
            saldoDevedor -= amortizacaoMes; // Atualiza o saldo devedor

            // Calcula o ROI do aluguel subtraindo a parcela mensal do valor de aluguel estimado
            const roiAluguel = valorAluguel - parcelaMensal; 

            tabela += `<tr>
                            <td>${mes}</td>
                            <td>R$ ${parcelaMensal.toFixed(2)}</td>
                            <td>R$ ${jurosMes.toFixed(2)}</td>
                            <td>R$ ${amortizacaoMes.toFixed(2)}</td>
                            <td>R$ ${saldoDevedor.toFixed(2)}</td>
                            <td>R$ ${roiAluguel.toFixed(2)}</td>
                    </tr>`;
        }

        tabela += `</tbody></table>`;
        document.getElementById('resultado-tabela').innerHTML = tabela; // Exibe a tabela no elemento com ID 'resultado-tabela'
    }

    function gerarTabelaAmortizacaoAdicional(valorImovel, entrada, taxaJurosAnual, numeroParcelas, valorAluguel, amortizacaoMensalAdicional) {
        const valorFinanciado = valorImovel - entrada;
        let saldoDevedor = valorFinanciado;
        const taxaJurosMensal = converterTaxaAnualParaMensal(taxaJurosAnual / 100);
        let parcelaMensal = calcularParcelaMensal(valorFinanciado, taxaJurosAnual / 100, numeroParcelas);
        let mes = 1;
        let totalPagoAtivo = entrada;
        let totalRoiAluguel = 0;
        let mesPrevistoQuitar = 0;
        let tabela = `<h2>Simulação Por Amortização</h2>
                    <table class="table">
                            <thead>
                                <tr>
                                    <th>Mês</th>
                                    <th>Parcela</th>
                                    <th>Juros do Mês</th>
                                    <th>Amortização do Mês</th>
                                    <th>Amortização Adicional</th>
                                    <th>ROI do Aluguel</th>
                                    <th>Amortização Total</th>
                                    <th>Saldo Devedor</th>
                                </tr>
                            </thead>
                            <tbody>`;
        
        while (saldoDevedor > 0 && mes <= numeroParcelas) {
            const jurosMes = saldoDevedor * taxaJurosMensal;
            let amortizacaoMes = parcelaMensal - jurosMes;
            
            let amortizacaoAdicional = amortizacaoMensalAdicional;
            let roiAluguel = valorAluguel - parcelaMensal;
            
            // Amortizar com o ROI do aluguel
            let amortizacaoComROI = amortizacaoAdicional + roiAluguel;
            saldoDevedor -= amortizacaoComROI;
    
            // Se o saldo devedor for negativo após a amortização, ajuste para zero
            if (saldoDevedor < 0) {
                amortizacaoComROI += saldoDevedor; // Ajuste para garantir que a amortização não seja maior que o saldo devedor
                saldoDevedor = 0;
            }
    
            let amortizacaoTotal = amortizacaoMes + amortizacaoComROI;
            
            tabela += `<tr>
                                <td>${mes}</td>
                                <td>R$ ${parcelaMensal.toFixed(2)}</td>
                                <td>R$ ${jurosMes.toFixed(2)}</td>
                                <td>R$ ${amortizacaoMes.toFixed(2)}</td>
                                <td>R$ ${amortizacaoAdicional.toFixed(2)}</td>
                                <td>R$ ${roiAluguel.toFixed(2)}</td>
                                <td>R$ ${amortizacaoTotal.toFixed(2)}</td>
                                <td>R$ ${saldoDevedor.toFixed(2)}</td>
                           </tr>`;
            mes++;
            totalPagoAtivo += amortizacaoAdicional;
            totalRoiAluguel += roiAluguel;
            mesPrevistoQuitar = mes;
        }
        
        tabela += `</tbody></table>`;
        document.getElementById('resultado-tabela-amortizacao-adicional').innerHTML = tabela;

        // Se o imóvel não foi quitado, o número de meses previsto para quitar será o total de parcelas
        if (mesPrevistoQuitar === 0) mesPrevistoQuitar = numeroParcelas;

        // Converter meses em anos e meses para a previsão de quitação
        const anosPrevistoQuitar = Math.floor(mesPrevistoQuitar / 12);
        const mesesRestantes = mesPrevistoQuitar % 12;
        const tempoParaQuitarFormatado = `${anosPrevistoQuitar} anos e ${mesesRestantes} meses`;
        console.log(totalRoiAluguel);
    
        // Atualizando o div de resumo
        const resumoDiv = document.getElementById('resumo');
        resumoDiv.innerHTML = `
            <p>Total pago pelo imóvel (entrada + amortizações extras): R$ ${totalPagoAtivo.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            <p>O imóvel será quitado em: ${tempoParaQuitarFormatado}</p>
            <p>ROI do Aluguel (retorno total): R$ ${totalRoiAluguel.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            <p>ROI do Aluguel (percentual sobre pagamento ativo): ${((totalRoiAluguel / entrada) * 100).toFixed(2)}%</p>
        `;
    }
    
    function exibirValorTotalComJurosEAmortizacao() {
        const valorImovel = $('#valor-imovel').maskMoney('unmasked')[0];
        const entrada = $('#entrada').maskMoney('unmasked')[0];
        const taxaJurosAnual = parseFloat($('#taxa-juros').maskMoney('unmasked')[0]);
        const numeroParcelas = parseInt(document.getElementById('numero-parcelas').value);
        const comissaoImobiliaria = document.getElementById('comissao-imobiliaria').checked;
        let valorAluguel = $('#valor-aluguel').maskMoney('unmasked')[0];
        if (comissaoImobiliaria) {
            valorAluguel *= 0.85; // Reduz o valor do aluguel em 15%
        }
        // Correção: Obter corretamente o valor da amortização mensal adicional
        const amortizacaoMensalAdicional = $('#amortizacao-mensal').maskMoney('unmasked')[0]; // Adicionado
    
        // Chamada à função gerarTabelaAmortizacao - sem mudança
        gerarTabelaAmortizacao(valorImovel, entrada, taxaJurosAnual, numeroParcelas, valorAluguel);
        
        if(valorAluguel + amortizacaoMensalAdicional > 0) {
            // Corrigido: Agora passando o amortizacaoMensalAdicional corretamente para a função
            gerarTabelaAmortizacaoAdicional(valorImovel, entrada, taxaJurosAnual, numeroParcelas, valorAluguel, amortizacaoMensalAdicional);
        }

    }
        
        document.getElementById('calcular').addEventListener('click', exibirValorTotalComJurosEAmortizacao);
    
    
        $(document).ready(function() {
            $('.toggle-button').click(function(event) {
                event.preventDefault(); // Impede o comportamento padrão do elemento (útil se for um <button> dentro de um <form>)
                event.stopPropagation(); // Impede que o evento se propague mais no DOM (não é estritamente necessário aqui, mas pode ser útil em outros contextos)
                
                var target = $(this).data('target');
                $(target).toggle(); // Alterna a visibilidade do elemento alvo

            });
        });


  
        // Adiciona um ouvinte de evento de clique ao botão
        document.getElementById('button-financiamento').addEventListener('click', function() {
            
            if (this.innerText === "Mostrar Tabela Financiamento") {
                this.innerText = "Ocultar Tabela Financiamento"; // Altera para este texto se o texto atual for "Clique Aqui"
            } else {
                this.innerText = "Mostrar Tabela Financiamento"; // Altera de volta para "Clique Aqui" se for qualquer outro texto
            }
        });

        document.getElementById('button-amortizacao').addEventListener('click', function() {
            let target = this.getAttribute('data-target');

            if (this.innerText === "Mostrar Simulação de Amortização") {
                this.innerText = "Ocultar Simulação de Amortização";
                window.location.href = target;
            } else {
                this.innerText = "Mostrar Simulação de Amortização"; // Altera de volta para "Clique Aqui" se for qualquer outro texto
            }
        });

        window.onscroll = function() {
            var button = document.getElementById("voltar-topo");
            if (document.body.scrollTop > 450 || document.documentElement.scrollTop > 450) {
                button.style.opacity = "1";
                button.style.pointerEvents = "auto"; // Torna o botão clicável
            } else {
                button.style.opacity = "0";
                button.style.pointerEvents = "none"; // Torna o botão não-clicável
            }
        };
        
        document.getElementById("voltar-topo").addEventListener("click", function() {
            window.scrollTo({top: 0, behavior: 'smooth'});
        });
        
        

