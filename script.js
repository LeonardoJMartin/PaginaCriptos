var listaTodasCriptos = [];
var casasDecimais = 2;

$('#adicionarTransacao').hide();
$('#infosTransacao').hide();
$('#nomeMoeda').on('input', function () {
    let valor = $(this).val();
    $(this).val(valor.toUpperCase());
});
$('#clicarAddTransacao').on('click', function () {
    $('#adicionarTransacao').show();
});
$('#clicarIncluir').on('click', controlaAdicao);
$('#limparCampos').on('click', function () {
    resetarCampos();
});
$('#excluirDados').on('click', function () {
    excluirDados();
    listaTodasCriptos = [];
});
$(document).on('click', '.fechar-icone', function () {
    let id = $(this).parent().attr('id');
    excluirCripto(id);
});
$('input[name="rdCompraVenda"]').on('input', function () {
    let retorno = $('input[name="rdCompraVenda"]:checked').val();
    if (retorno === "compra") {
        $('[for="valorTransacao"]').text('Quanto você comprou?');
        $('[for="dataTransacao"]').text('Qual a data da compra?');
        $('#clicarIncluir').text('Incluir Compra');
    }
    else if (retorno === "venda") {
        $('[for="valorTransacao"]').text('Quanto você vendeu?');
        $('[for="dataTransacao"]').text('Qual a data da venda?');
        $('#clicarIncluir').text('Incluir Venda');
    }
    $('#infosTransacao').show();
});

string = localStorage.getItem("criptos");
if (string != null) {
    listaTodasCriptos = JSON.parse(string);
    mostrarTransacoesInclusas();
}

function controlaAdicao() {
    let retornoRadio = $('input[name="rdCompraVenda"]:checked').val();
    let retornoValores = obtemValores(retornoRadio);
    retornoRadio === "compra" ? adicionarCompra(retornoValores) : adicionarVenda(retornoValores); // Se for radio for compra adiciona a compra, se não adicina venda
    resetarCampos();
    mostrarTransacoesInclusas();
}

function obtemValores(retornoRadio) {
    var operacao = {
        data: $('#data').val(),
        valorTransacao: parseFloat($('#valorTransacao').val()),
        precoMoeda: parseFloat($('#precoMoeda').val()),
        nomeMoeda: $('#nomeMoeda').val().toUpperCase(),
        transacao: retornoRadio,
    }
    operacao.quantidadeMoeda = (operacao.valorTransacao / operacao.precoMoeda);

    let criptoInfo = listaTodasCriptos.find(objeto => objeto.nome === operacao.nomeMoeda); // Verifica se existe uma cripto com esse nome armazenada
    let obj = { criptoInfo, operacao }
    return obj;
}

function adicionarCompra(obj) {
    if (obj.criptoInfo) {  //Se ja existe, adiciona uma nova operação e acrescenta o valor obtido
        obj.criptoInfo.listaOperacaoCripto.push(obj.operacao);
        obj.criptoInfo.qtdTotalMoeda += obj.operacao.quantidadeMoeda;
        obj.criptoInfo.valorTotalInvestido += obj.operacao.valorTransacao;
        obj.criptoInfo.qtdTransacaoCompra++;
        calculaMediaCripto(obj.criptoInfo);
    }
    else { //Se não existe, cria um novo objeto para essa cripto, e adiciona na listaTodasCriptos
        let cripto = {
            nome: obj.operacao.nomeMoeda,
            listaOperacaoCripto: [obj.operacao],
            qtdTotalMoeda: obj.operacao.quantidadeMoeda,
            qtdTransacaoCompra: 1,
            qtdTransacaoVenda: 0,
            valorTotalInvestido: obj.operacao.valorTransacao,
        };
        calculaMediaCripto(cripto);
        listaTodasCriptos.push(cripto);
    }
}

function adicionarVenda(obj) {
    if (obj.criptoInfo) {  //Se ja existe, adiciona uma nova operação e acrescenta o valor obtido
        obj.criptoInfo.listaOperacaoCripto.push(obj.operacao);
        obj.criptoInfo.qtdTotalMoeda -= obj.operacao.quantidadeMoeda;
        obj.criptoInfo.valorTotalInvestido -= obj.operacao.valorTransacao;
        obj.criptoInfo.qtdTransacaoVenda++;
    }
    else {
        alert("Você não possui nenhum registro de compra dessa moeda, primeiro registre a compra, depois a venda.")
    }
}

function calculaMediaCripto(criptoInfo) { // Calcula preço médio da moeda
    criptoInfo.mediaTotalValor = criptoInfo.valorTotalInvestido / criptoInfo.qtdTotalMoeda;
}

function resetarCampos() {
    $('#dataTransacao').val('');
    $('#valorTransacao').val('');
    $('#precoMoeda').val('');
    $('#nomeMoeda').val('');
}

function mostrarTransacoesInclusas() {
    let transacaoVenda = 0;
    let transacaoCompra = 0;
    $('#listaTrasacoes').empty();
    for (let cripto of listaTodasCriptos) {
        cripto.id = geraId(cripto);
        let transacao = $('<div>').attr('id', cripto.id);
        transacao.append('<div class="fechar-icone"></div>');
        transacao.append('<div>Moeda: ' + cripto.nome + '</div>');
        transacao.append('<div>Média total: ' + cripto.mediaTotalValor.toFixed(casasDecimais) + '</div>');
        transacao.append('<div>Quantidade de ' + cripto.nome + ' total: ' + cripto.qtdTotalMoeda.toFixed(2) + '</div>');
        transacao.append('<div>Total investido: ' + cripto.valorTotalInvestido.toFixed(2) + '</div>');
        transacao.append('<div>Total de transações de venda: ' + cripto.qtdTransacaoVenda + '</div>');
        transacao.append('<div>Total de transações de compra: ' + cripto.qtdTransacaoCompra + '</div>');
        transacao.append('<div>Total de todas as transações: ' + cripto.listaOperacaoCripto.length + '</div>');
        $('#listaTrasacoes').append(transacao);
        transacao.append('</div>');
    }
    salvaDados()
}

function excluirDados() {
    localStorage.removeItem("criptos");
    string = "";
    $('#listaTrasacoes').html(string);
}

function salvaDados() {
    let jsonString = JSON.stringify(listaTodasCriptos);
    localStorage.setItem("criptos", jsonString);
}

function geraId(moeda) {
    let id = moeda.nome + parseInt(Math.random() * 1000);
    if ($('#' + id).length) {
        return geraId(moeda);
    }
    return id;
}

function excluirCripto(id) {
    $('#' + id).remove();
    listaTodasCriptos = listaTodasCriptos.filter(item => item.id !== id);
    salvaDados();
}
