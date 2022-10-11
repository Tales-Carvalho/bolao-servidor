const http = require('http')
const fs = require('fs')

const port = process.env.PORT || 3000

const server = http.createServer((req, res) => {
    if (req.url === '/' && req.method === 'GET') {
        res.end('Hello!')
    }
    else if (req.url === '/aposta' && req.method == 'POST') {
        let body = ''
        req.on('data', chunk => {
            body += chunk.toString()
        })
        req.on('end', () => {
            const dados = Object.fromEntries(new URLSearchParams(body))
            fs.writeFile(`Dados/${dados.data}${dados.nome}.json`, JSON.stringify(dados), (err) => {
                if (err) throw err
                console.log(`Arquivo Dados/${dados.data}${dados.nome}.json salvo.`)
                res.end(`<html><head><meta charset="utf-8"></head><body><h2>Obrigado por participar, ${dados.nome}! Aguarde a confirmação de sua participação por e-mail ou whatsapp. Chave pix para pagamento: Celular (35)99982-7930. Valor R$50,00. Boa Sorte!!!</h2></body></html>`)
            })
        })
    }
    else if (req.url === '/participantes' && req.method == 'GET') {
        let response = '<html><head><meta charset="utf-8"></head><body>'
        const files = fs.readdirSync('Dados/')
        for (const file of files) {
            if (!file.includes('.json')) continue
            response += `<h1>${file}</h1>`
            const content = fs.readFileSync(`Dados/${file}`, {encoding: "utf-8"})
            response += `<p>${content}</p>`
        }
        response += '</body></html>'
        res.end(response)
    }
    else if (req.url === '/classificacao' && req.method == 'GET') {
        res.end('Aqui vai aparecer a classificação da galera.')
    }
    else {
        res.end(`{"Erro 404": "${http.STATUS_CODES[404]}"}`)
    }
})

server.listen(port, () => {
    console.log(`Servidor iniciado na porta ${port}.`)
})
