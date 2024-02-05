var listaTodasCriptos = [];

$('#clicarAddTransacao').click(function(event) {
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
        valorPago: $('#valorPago').val(),
        precoMoeda: $('#precoMoeda').val(),
        nomeMoeda: $('#nomeMoeda').val(),              
    }
    operacao.quantidadeMoeda = operacao.valorPago / operacao.precoMoeda;   
    
    let verificaSeJaExiste = listaTodasCriptos.find(objeto => objeto.nome === nomeMoeda); // Verifica se existe uma cripto com esse nome armazenada

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
    for(let transacao of criptoAtual.listaOperacaoCripto){
        totalTransacao += transacao.precoMoeda * transacao.quantidadeMoeda;
    }
    criptoAtual.mediaTotalValor = totalTransacao / criptoAtual.totalObtido;
}

function resetarCampos(){
    $('#dataCompra').val('');
    $('#valorPago').val('');
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
        let clonaBloco = $('#listaTrasacoes').clone();
        clonaBloco.append('<div>Moeda: ' + moeda.nome + '</div>');
        clonaBloco.append('<div>Média total: ' + moeda.mediaTotalValor + '</div>');
        clonaBloco.append('<div>Quantidade de ' + moeda.nome +' total: ' + moeda.totalObtido + '</div>');
        clonaBloco.append();
        clonaBloco.append('<div>Número de transações: ' + moeda.listaOperacaoCripto.length + '</div>');
        clonaBloco.appendTo('#listaTrasacoes');
    }
}