var listaTodasCriptos = [];
var casasDecimais = 2;
$('#adicionarTransacao').hide();
$('#nomeMoeda').on('input', function(){
    let valor = $(this).val();
    $(this).val(valor.toUpperCase());
});
$('#clicarAddTransacao').on('click', function() {
    $('#adicionarTransacao').show();
});
$('#clicarIncluir').on('click', controlaAdicao);
$('#limparCampos').on('click', function(){
    resetarCampos();
});
$('#excluirDados').on('click', function(){
    excluirDados();
    listaTodasCriptos = [];
});
$(document).on('click', '.fechar-icone', function(){
    let id = $(this).parent().attr('id');
    excluirCripto(id);
});

string = localStorage.getItem("criptos");
if(string != null){
    listaTodasCriptos = JSON.parse(string);
    mostrarTransacoesInclusas();
}

function controlaAdicao(){
    adicionarCompra();
    resetarCampos();
    mostrarTransacoesInclusas();
}

function adicionarCompra(){
    let operacao = {
        dataCompra: $('#dataCompra').val(),
        valorInvestido: parseFloat($('#valorInvestido').val()),
        precoMoeda: parseFloat($('#precoMoeda').val()),
        nomeMoeda: $('#nomeMoeda').val().toUpperCase(),              
    }
    operacao.valorInvestido = operacao.valorInvestido;
    operacao.precoMoeda = operacao.precoMoeda;
    operacao.quantidadeMoeda = (operacao.valorInvestido / operacao.precoMoeda);   
    
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

function mostrarTransacoesInclusas(){
    $('#listaTrasacoes').empty();
    for (let moeda of listaTodasCriptos) {
        moeda.id = geraId(moeda);
        let transacao = $('<div>').attr('id', moeda.id);
        transacao.append('<div class="fechar-icone"></div>');
        transacao.append('<div>Moeda: ' + moeda.nome + '</div>');
        transacao.append('<div>Média total: ' + moeda.mediaTotalValor.toFixed(casasDecimais) + '</div>');
        transacao.append('<div>Quantidade de ' + moeda.nome +' total: ' + moeda.totalObtido.toFixed(2) + '</div>');
        transacao.append('<div>Total investido: '+ moeda.valorTotalInvestido.toFixed(2) + '</div>');
        transacao.append('<div>Número de transações: ' + moeda.listaOperacaoCripto.length + '</div>');
        $('#listaTrasacoes').append(transacao);
        transacao.append('</div>');
    }
    salvaDados()
}

function excluirDados(){
    localStorage.removeItem("criptos");
    string = "";
    $('#listaTrasacoes').html(string);
}

function salvaDados(){
    let jsonString = JSON.stringify(listaTodasCriptos);
    localStorage.setItem("criptos", jsonString);
}

function geraId(moeda){
    let id = moeda.nome + parseInt(Math.random() * 1000);
    if($('#'+id).length){
        return geraId(moeda);
    }
    return id;
}

function excluirCripto(id){
    $('#'+ id).remove();
    listaTodasCriptos = listaTodasCriptos.filter(item => item.id !== id);
    console.log(listaTodasCriptos);
}