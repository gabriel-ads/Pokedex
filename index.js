var user = require('readline-sync')
var axios = require('axios')

var pokeRequisitado = user.question(`Digite o Pokemon desejado por nome ou por sua ID: `).trim().toLowerCase()

var DesligarPokedex = 'Ligada'



axios.get(`https://pokeapi.co/api/v2/pokemon/${pokeRequisitado}`)
    .then(Result => {

        var pokemon = Result.data.name
        function MostraPokemon() {
            
            console.log(`O ${pokemon.toUpperCase()} tem o(s) tipo(o):`)
        }
        function MostraAtributos() {
            var atributos = Result.data.types
            var tipos = Result.data.types.map(tipo => {
                return tipo.type.name
            })
            console.log(`>> ${tipos.join(', ').toUpperCase()}`)
        }

        while (true) {
            console.log('>> Bem Vindo a sua Pokedex << \n')
            console.log(`Voce procurou por ${pokemon.toUpperCase()}`)
            var pergunta = user.questionInt(`Se quer saber os atributos de ${pokemon.toUpperCase()} Pressione 1 \nSe quer saber as habilidades de ${pokemon.toUpperCase()} Pressione 2 \nSe quiser desligar sua Pokedex, Pressione 9 \n`)
            if(pergunta == 9){
                console.log('Ate logo!\n')
                process.exit()
            }
            if(pergunta == 1){
                MostraAtributos()
            }
        }
    })