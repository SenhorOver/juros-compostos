
const Main = {
    selectValue: false,
    init(){
        this.selectors()
        this.bindEvents()
    },

    selectors(){
        this.form = document.querySelector('form')
        this.select = document.querySelector('select')
    },

    bindEvents(){
        this.form.onsubmit = this.Events.submit_SendValues.bind(this)
        this.select.onchange = this.Events.select_Value.bind(this)
    },

    Events: {
        submit_SendValues(e){
            let valid = true
            const inputs = e.target.querySelectorAll('input')
            const select = e.target.querySelector('select')

            valid = this.Validations.handleForm.bind(this)(e)

            if(!valid) return
            this.UsefulMethods.sendInfos(inputs, select)
        },

        select_Value(e){
            if(e.target.value) return this.selectValue = true
            this.selectValue = false
        }
    },

    Validations: {
        handleForm(e){
            e.preventDefault()
            let valid = true
            let selected = this.selectValue
            let numbers = true

            if(selected){
                e.target.querySelector('select').classList.remove('error')
            } else{
                e.target.querySelector('select').classList.add('error')
            }
            
            valid = this.Validations.isEmpty(e)

            number = this.Validations.isNumbers(e)

            if(valid && selected && number) return true
            return false
            
        },

        isEmpty(e){
            let valid = true
            const inputs = e.target.querySelectorAll('input')

            inputs.forEach(el => {
                if(el.value){
                    el.classList.remove('error') 
                    return
                } 
                el.classList.add('error')
                valid = false
            })
            return valid
        },

        isNumbers(e){
            const inputs = e.target.querySelectorAll('input')
            let valid = true

            inputs.forEach((el, ix) => {
                if(ix === 0) return

                const wdPercent = el.value.replace('%', '')
                const dot = wdPercent.replace(',','.')
                const isNumber = Number(dot)
                console.log(isNumber);
                //TODO: Estou resolvendo o problema de adicionar a classe de erro, sempre que for um erro, porém, ao digitar letras, está removendo a classe de erro,
                //TODO: Pensei em resolver, mudando o if, e colocando o Number(dot) no próprio if
                if(isNumber == NaN || isNumber === 0) {
                    el.classList.add('error')
                    return valid = false
                }
                el.classList.remove('error')
            })
            return valid
        }
    },

    UsefulMethods: {
        sendInfos(inputs, select){
            const json = JSON.stringify({expr: `${inputs[1].value}*(((1+${inputs[2].value})^${select.value}-1)/${inputs[2].value})`})
            fetch('http://api.mathjs.org/v4/', {
                method: 'POST',
                body: {json}
            })    
        }
    },
}

Main.init()