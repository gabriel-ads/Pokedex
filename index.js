var user = require('readline-sync')
var axios = require('axios')
var fs = require('fs')
var pergunta = -1
var atributo = ''
var doubleDamageRelation = []
var halfDamageRelation = []
var noDamageRelation = []
var poke = new Object()


var pokeRequisitado = user.question(`Digite o Pokemon desejado pelo NOME ou por sua ID: \n`).trim().toLowerCase()
console.log('Bem Vindo a sua Pokedex!!!')

axios.get(`https://pokeapi.co/api/v2/pokemon/${pokeRequisitado}`)
    .then(Result => {
        function Menu() {
            pergunta = user.questionInt(`\nPara saber as habilidades, digite 1\nPara saber os atributos, digite 2\nPara saber a relacao de dano, digite 3\nPara saber o(s) efeito(s) da(s) habilidade(s), digite 4\nPara salvar seu Pokemon, digite 0\n>> `)
        }
        var pokemon = Result.data.name
        var habilidades = Result.data.abilities.map(habilidades => {
            return habilidades.ability.name
        })
        var efeitosDeHabilidades = Result.data.abilities.map(efeitos => {
            return efeitos.ability.url
        })

        var relacaoDeDano = Result.data.types.map(relacao => {
            return relacao.type.url
        })
        console.log(`Voce encontrou um ${pokemon.toUpperCase()} selvagem`)
        function MostraAtributos() {
            //Pegando os tipos/atributos dos Pokemons
            var tipos = Result.data.types.map(tipo => {
                atributo = tipo.type.name
                return atributo
            })

            console.log(`O ${pokemon.toUpperCase()} tem o(s) seguinte(s) atributo(s): \n${tipos.join(', ').toUpperCase()}`)
        }
        function MostraHabilidades() {
            console.log(habilidades.join(', ').toUpperCase())
        }
        var abilitiesEffects = []
        efeitosDeHabilidades.map(effect => {
            axios.get(effect)
                .then(ResultEfeitos => {
                    var efeito = ResultEfeitos.data.effect_entries.map(efeito => {
                        var effect = efeito.effect
                        return effect
                    })
                    abilitiesEffects.push(efeito)

                    function MostraEfeitosDeHabilidades() {
                        console.log(abilitiesEffects.join('\n'))

                    }
                    relacaoDeDano.map(pegandoRelacoes => {
                        axios.get(pegandoRelacoes)
                            .then(ResultRelacao => {
                                var double_damage_to = ResultRelacao.data.damage_relations.double_damage_to.map(doubleDamage => {
                                    return doubleDamage.name
                                })
                                var half_damage_to = ResultRelacao.data.damage_relations.half_damage_to.map(halfDamage => {
                                    return halfDamage.name
                                })
                                var no_damage_to = ResultRelacao.data.damage_relations.no_damage_to.map(noDamage => {
                                    return noDamage.name
                                })
                                                         
                                doubleDamageRelation.push(double_damage_to)
                                halfDamageRelation.push(half_damage_to)
                                noDamageRelation.push(no_damage_to)
                                function MostraRelacaoDano() {
                                    console.log(`Tem dobro de dano em ${doubleDamageRelation.join(', ')}\nTem metade do dano em ${halfDamageRelation.join(', ')}\nNão tem efeito em ${noDamageRelation.join(', ')}`)
                                }
                                
                                    if (pergunta == 1) {
                                        MostraHabilidades()
                                        Menu()
                                    }
                                    if (pergunta == 2) {
                                        MostraAtributos()
                                        Menu()
                                    }
                                    if (pergunta == 3) {
                                        MostraRelacaoDano()
                                        Menu()
                                    }
                                    if (pergunta == 4) {
                                        MostraEfeitosDeHabilidades()
                                        Menu()
                                    }
                                    if (pergunta == 0) {
                                        var str = fs.readFileSync('pokedesktop.json')
                                        var listaDePokemons = JSON.parse(str)

                                        poke.nome = pokemon
                                        poke.atributo = atributo
                                        poke.habilidade = habilidades

                                        listaDePokemons.push(poke)
                                        console.log(listaDePokemons)

                                        var pokemonSerializado = JSON.stringify(listaDePokemons)
                                        var caminhoArquivo = 'pokedesktop.json'
                                        fs.writeFileSync(caminhoArquivo, pokemonSerializado)
                                        Menu()
                                    }                              
                                
                                Menu()

                            })
                    })
                })
        })
    })

