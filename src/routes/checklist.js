const express = require('express')
const router = express.Router()

const Checklist = require('../models/checklist')


router.get('/', async (req, res) => {
    try {
        let checklists = await Checklist.find({})
        res.status(200).render("checklists/index", { checklists: checklists})
    } catch (error) {
        res.status(500).render("pages/error", { error: "Error ao exibir as listas..."})
    }
})

router.get('/new', async (req, res) => {
    try {
        let checklist = new Checklist()
        res.status(200).render('checklists/new', { checklist: checklist})
    } catch (error) {
        res.status(500).render("pages/error", { error: "Error ao cadastrar formulário..."})
    }
})

router.get('/:id/edit', async(req, res) => {
    try {
        let checklist = await Checklist.findById(req.params.id)
        res.status(200).render('checklists/edit', { checklist: checklist})
    } catch (error) {
        res.status(500).render("pages/error", { error: "Error ao exibir a edição da lista de tarefas..."})
    }
})

router.post('/', async (req, res) => {
    let { name } = req.body.checklist
    let checklist = new Checklist({name})

    try {
        await checklist.save()
        res.redirect('/checklists')
    } catch (error) {
        res.status(422).render('checklists/new', { checklists: {...checklist, error}})
    }
})

router.get('/:id', async (req, res) => {
    try {
        let checklist = await Checklist.findById(req.params.id).populate('tasks')
        res.status(200).render("checklists/show", { checklist: checklist})

    } catch (error) {
        res.status(500).render("pages/error", { error: "Error ao exibir a lista..."})
    }
})

router.put('/:id', async (req, res) => {
    const { name } = req.body.checklist;
    try {
        const checklist = await Checklist.findByIdAndUpdate(req.params.id, { name }, { new: true });
        res.redirect('/checklists');
    } catch (error) {
        const errors = error.errors;
        const checklist = await Checklist.findById(req.params.id); // Re-carrega o checklist
        res.status(422).render('checklists/edit', { checklist: { ...checklist.toObject(), errors } });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        let checklist = await Checklist.findByIdAndDelete(req.params.id)
        if (!checklist) {
            res.status(404).send("Checklist não encontrado...")
        }
        res.redirect('/checklists')
    } catch (error) {
        res.status(500).render("pages/error", { error: "Error ao deletar a lista..."})
    }
})

module.exports = router