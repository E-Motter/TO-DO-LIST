const express = require('express')

const checkListRouter = require('./src/routes/checklist')
const taskRouter = require('./src/routes/task')

const rootRouter = require('./src/routes/index')
const path = require("path")
const matehodOverride = require('method-override')

require('./config/database')

const app = express()
const port = 3000

app.use(express.json())

app.use(express.urlencoded({ extended: true}))
app.use(matehodOverride('_method', { methods: ['POST', 'GET']}))
app.use(express.static(path.join(__dirname, "public")))

app.set("views", path.join(__dirname, 'src/views'))
app.set("view engine", "ejs")

app.use('/', rootRouter)
app.use('/checklists', checkListRouter)
app.use('/checklists', taskRouter.checklistDependent)
app.use('/tasks', taskRouter.simple)

app.listen(port, () => {
    console.log('Servidor online!')
})