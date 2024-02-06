var listaTodasCriptos = [];

$('#nomeMoeda').on('input', function(){
    let valor = $(this).val();
    $(this).val(valor.toUpperCase());
});
$('#clicarAddTransacao').click(function() {
    desocultar('#adicionarTransacao');
});
$('#clicarIncluir').click(controlaAdicao);

function controlaAdicao(){
    adicionarCompra();
    resetarCampos();
    mostrarTransacoesInclusas();
}

function adicionarCompra(){
    let operacao = {
        dataCompra: $('#dataCompra').val(),
        valorInvestido: $('#valorInvestido').val(),
        precoMoeda: $('#precoMoeda').val(),
        nomeMoeda: $('#nomeMoeda').val().toUpperCase(),              
    }
    operacao.quantidadeMoeda = operacao.valorInvestido / operacao.precoMoeda;   
    
    let verificaSeJaExiste = listaTodasCriptos.find(objeto => objeto.nome === operacao.nomeMoeda); // Verifica se existe uma cripto com esse nome armazenada

    if(verificaSeJaExiste){  //Se ja existe, adiciona uma nova operação e acrescenta o valor obtido
        verificaSeJaExiste.listaOperacaoCripto.push(operacao);
        verificaSeJaExiste.totalObtido += operacao.quantidadeMoeda;
        calculaMediaCripto(verificaSeJaExiste);
    }
    else{ //Se não existe, cria um novo objeto para essa cripto, e adiciona na listaTodasCriptos
        let cripto = {
            nome: operacao.nomeMoeda, 
            listaOperacaoCripto: [operacao], 
            totalObtido: operacao.quantidadeMoeda, 
            mediaTotalValor: operacao.precoMoeda
        };
        calculaMediaCripto(cripto);
        listaTodasCriptos.push(cripto);
    }
    
}

function calculaMediaCripto(criptoAtual){ // Calcula preço médio da moeda
    let totalTransacao = 0;
    let valorInvestido = 0;
    for(let transacao of criptoAtual.listaOperacaoCripto){
        totalTransacao += transacao.precoMoeda * transacao.quantidadeMoeda;
        valorInvestido += parseFloat(transacao.valorInvestido);
    }
    criptoAtual.mediaTotalValor = totalTransacao / criptoAtual.totalObtido;
    criptoAtual.valorTotalInvestido = valorInvestido;
}

function resetarCampos(){
    $('#dataCompra').val('');
    $('#valorInvestido').val('');
    $('#precoMoeda').val(''); 
    $('#nomeMoeda').val('');
}

function ocultar(val){
    $(val).addClass('ocultar');
}

function desocultar(val){
    $(val).removeClass('ocultar');
}

function mostrarTransacoesInclusas(){
    $('#listaTrasacoes').empty();
    for (let moeda of listaTodasCriptos) {
        let transacao = $('#listaTrasacoes');
        transacao.append('<div>');
        transacao.append('<div>Moeda: ' + moeda.nome + '</div>');
        transacao.append('<div>Média total: ' + moeda.mediaTotalValor + '</div>');
        transacao.append('<div>Quantidade de ' + moeda.nome +' total: ' + moeda.totalObtido + '</div>');
        transacao.append('<div>Total investido: '+ moeda.valorTotalInvestido + '</div>');
        transacao.append('<div>Número de transações: ' + moeda.listaOperacaoCripto.length + '</div>');
        transacao.append('</div>');
    }
}