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
    let retorno = verificaRadioCompraVenda();
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

function verificaRadioCompraVenda() {
    let valorCompraVenda = $('input[name="rdCompraVenda"]:checked').val();
    return valorCompraVenda;
}

function controlaAdicao() {
    let retornoRadio = verificaRadioCompraVenda();
    let retornoValores = {};
    if (retornoRadio === "compra") {
        retornoValores = obtemValores(retornoRadio);
        adicionarCompra(retornoValores);
    }
    else if (retornoRadio === "venda") {
        retornoValores = obtemValores(retornoRadio);
        adicionarVenda(retornoValores);
    }

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

    let verificaSeExiste = listaTodasCriptos.find(objeto => objeto.nome === operacao.nomeMoeda); // Verifica se existe uma cripto com esse nome armazenada
    let obj = { verificaSeExiste, operacao }
    return obj;
}

function adicionarCompra(obj) {
    if (obj.verificaSeExiste) {  //Se ja existe, adiciona uma nova operação e acrescenta o valor obtido
        obj.verificaSeExiste.listaOperacaoCripto.push(obj.operacao);
        obj.verificaSeExiste.totalObtido += obj.operacao.quantidadeMoeda;
        calculaMediaCripto(obj.verificaSeExiste);
    }
    else { //Se não existe, cria um novo objeto para essa cripto, e adiciona na listaTodasCriptos
        let cripto = {
            nome: obj.operacao.nomeMoeda,
            listaOperacaoCripto: [obj.operacao],
            totalObtido: obj.operacao.quantidadeMoeda,
            mediaTotalValor: obj.operacao.precoMoeda
        };
        calculaMediaCripto(cripto);
        listaTodasCriptos.push(cripto);
    }
}

function adicionarVenda(obj) {
    if (obj.verificaSeExiste) {  //Se ja existe, adiciona uma nova operação e acrescenta o valor obtido
        obj.verificaSeExiste.listaOperacaoCripto.push(obj.operacao);
        obj.verificaSeExiste.totalObtido -= obj.operacao.quantidadeMoeda;
        calculaMediaCripto(obj.verificaSeExiste);
    }
    else {
        alert("Você não possui nenhum registro de compra dessa moeda, primeiro registre a compra, depois a venda.")
    }
}

function calculaMediaCripto(criptoAtual) { // Calcula preço médio da moeda
    let totalTransacoes = 0;
    for (let transacao of criptoAtual.listaOperacaoCripto) {
        if (transacao.transacao === "compra") {
            totalTransacoes += transacao.valorTransacao;
        }     
    }

    criptoAtual.mediaTotalValor = totalTransacoes / criptoAtual.totalObtido;
     for (let transacao of criptoAtual.listaOperacaoCripto) {
        if (transacao.transacao === "venda") {
            totalTransacoes -= transacao.valorTransacao;
        }
    }
    criptoAtual.valorTotalInvestido = totalTransacoes;

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
    for (let moeda of listaTodasCriptos) {
        moeda.id = geraId(moeda);
        let transacao = $('<div>').attr('id', moeda.id);
        transacao.append('<div class="fechar-icone"></div>');
        transacao.append('<div>Moeda: ' + moeda.nome + '</div>');
        transacao.append('<div>Média total: ' + moeda.mediaTotalValor.toFixed(casasDecimais) + '</div>');
        transacao.append('<div>Quantidade de ' + moeda.nome + ' total: ' + moeda.totalObtido.toFixed(2) + '</div>');
        transacao.append('<div>Total investido: ' + moeda.valorTotalInvestido.toFixed(2) + '</div>');
        for (let transacao of moeda.listaOperacaoCripto) {
            if (transacao.transacao === "compra") {
                transacaoCompra++;
            }
            else if (transacao.transacao === "venda") {
                transacaoVenda++;
            }
        }
        transacao.append('<div>Total de transações de venda: ' + transacaoVenda + '</div>');
        transacao.append('<div>Total de transações de compra: ' + transacaoCompra + '</div>');
        transacao.append('<div>Total de todas as transações: ' + moeda.listaOperacaoCripto.length + '</div>');
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
