
const Main = {
    selectValue: false,
    init(){
        this.selectors()
        this.bindEvents()
    },

    selectors(){
        this.form = document.querySelector('form')
        this.select = document.querySelector('select')
        this.button = document.querySelector('#new-simulation')
    },

    bindEvents(){
        this.form.onsubmit = this.Events.submit_SendValues.bind(this)
        this.select.onchange = this.Events.select_Value.bind(this)
        this.button.onclick = this.Events.click_BackPage1.bind(this)
    },

    Events: {
        submit_SendValues(e){
            let valid = true
            const inputs = e.target.querySelectorAll('input')
            const select = e.target.querySelector('select')
            
            valid = this.Validations.handleForm.bind(this)(e)
            
            if(!valid) return
            this.UsefulMethods.sendInfos(inputs, select)
            const page1 = document.querySelector('.first-page')
            page1.classList.add('none')
        },

        select_Value(e){
            if(e.target.value) return this.selectValue = true
            this.selectValue = false
        },

        click_BackPage1(e){
            const page1 = document.querySelector('.first-page')
            const page2 = document.querySelector('.second-page')
            page1.classList.remove('none')
            page2.classList.add('none')
            this.selectValue = false
        }
    },

    Validations: {
        handleForm(e){
            e.preventDefault()
            let valid = true
            let selected = this.selectValue
            let numbers = true
            const ul = document.querySelector('.errors')
            ul.innerHTML = ''

            if(selected){
                e.target.querySelector('select').classList.remove('error')
            } else{
                e.target.querySelector('select').classList.add('error')
                this.Errors.error('Campos não podem estar vazios')
            }
            
            valid = this.Validations.isEmpty.bind(this)(e)

            number = this.Validations.isNumbers.bind(this)(e)

            if(valid && selected && numbers) return true
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
                this.Errors.error('Campos não podem estar vazios')
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
                if(isNumber === 0 || isNaN(isNumber)) {
                    el.classList.add('error')
                    if(valid) this.Errors.errorNumber('Campo de mensalidade e/ou taxa de juros devem ser números válidos')
                    return valid = false
                }
                el.classList.remove('error')
            })
            return valid
        }
    },

    UsefulMethods: {
        sendInfos(inputs, select){
            const json = JSON.stringify({expr: `${inputs[1].value.replace(',','.').replace('%', '')}*(((1+${(inputs[2].value.replace(',','.').replace('%', '')) / 100})^${select.value * 12}-1)/${(inputs[2].value.replace(',','.').replace('%', '')) / 100})`})
            console.log(json);
            fetch('http://api.mathjs.org/v4/', {
                method: 'POST',
                body: json,
                headers: {'content-type': 'application/json'}
            })
            .then(response => {
                console.log('resposta:', response);
                return response.json()
            })    
            .then(json => {
                const page2 = document.querySelector('.second-page')
                page2.classList.remove('none')
                Main.UsefulMethods.showInfos(inputs, select,json)
                console.log(json);
            })
        },

        showInfos(inputs, select, json){
            const h2 = document.querySelector('.title-answer')
            const p = document.querySelector('.text-answer')
            h2.innerText = 'Olá ' + inputs[0].value + ','
            p.innerHTML = `juntando <strong>R$ ${Number(inputs[1].value.replace(',','.')).toFixed(2)}</strong> todo mês, você terá <strong>R$ ${Number(json.result).toFixed(2)}</strong> em <strong>${select.value}</strong> anos sob uma taxa de juros de <strong>${inputs[2].value.replace(',','.').replace('%','')}%</strong>`
            inputs.forEach(el => {
                el.value = ''
            })
            select.value = ''
        }
    },

    Errors: {
        error(msg){
            const li = document.createElement('li')
            li.innerText = '- ' + msg
            const ul = document.querySelector('.errors')
            ul.innerHTML = ''
            ul.appendChild(li)
        },

        errorNumber(msg){
            const li = document.createElement('li')
            li.innerText = '- ' + msg
            const ul = document.querySelector('.errors')
            ul.appendChild(li)
        }
    }
}

Main.init()