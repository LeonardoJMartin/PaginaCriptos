var listaTodasCriptos = [];

function adicionarCompra(nome){
    let operacao = {
        dataCompra: "17/12/1995",
        valorPago: 19000,
        valorMoeda: 40000,              
    }
    operacao.quantidadeMoeda = operacao.valorPago / operacao.valorMoeda;   
    
    let verificaSeJaExiste = listaTodasCriptos.find(objeto => objeto.nome === nome); // Verifica se existe uma cripto com esse nome armazenada

    if(verificaSeJaExiste){  //Se ja existe, adiciona uma nova operação e acrescenta o valor obtido
        verificaSeJaExiste.listaOperacaoCripto.push(operacao);
        verificaSeJaExiste.totalObtido += operacao.quantidadeMoeda;
        calculaMediaCripto(verificaSeJaExiste);
    }
    else{ //Se não existe, cria um novo objeto para essa cripto, e adiciona na listaTodasCriptos
        let cripto = {
            nome: nome, 
            listaOperacaoCripto: [operacao], 
            totalObtido: operacao.quantidadeMoeda, 
            mediaTotalValor: operacao.valorMoeda
        };
        calculaMediaCripto(cripto);
        listaTodasCriptos.push(cripto);
    }
    
}

function calculaMediaCripto(criptoAtual){ // Calcula preço médio da moeda
    let totalTransacao = 0;
    for(let transacao of criptoAtual.listaOperacaoCripto){
        totalTransacao += transacao.valorMoeda * transacao.quantidadeMoeda;
    }
    criptoAtual.mediaTotalValor = totalTransacao / criptoAtual.totalObtido;
}
