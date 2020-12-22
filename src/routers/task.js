const express = require ('express')
const { update } = require('../models/task')
const Task = require('../models/task')
const auth = require('../middleware/auth')

const router = new express.Router()

//GET /tasks?completed=false //filter
//GET /tasks?limit=10&skip=10 //limit: limits the no of results shown on 1 page; //skip skips those many results to show next(in accordance to limit specified) //pagination
//GET /tasks?sortBy=createdAt:desc //sorting 
router.get('/tasks', auth,  async (req, res)=>{
    const match = {}
    const sort = {}
    if(req.query.completed){
        match.completed = req.query.completed === 'true'
        
    }
    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1]==='desc' ? -1: 1
    }
    try{
        await req.user.populate({
            path: "tasks",
            match , 
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        
        }).execPopulate() //populate
        res.send(req.user.tasks)
    }catch(e){
        res.status(500).send()
    }
})



router.get('/tasks/:id', auth, async (req, res)=>{
    const _id = req.params.id
    
    try{
        const task = await Task.findOne({_id, owner: req.user._id})  
        if(!task){
            return res.status(404).send()
        }
        res.status(200).send(task)
    }catch(e){
        res.status(500).send()
    }
})



router.post('/tasks', auth, async (req, res)=>{  
    const task = new Task({
        ...req.body,   
        owner: req.user._id
    })

    try{
        await task.save()
        res.status(201).send(task)
    }catch(e){
        res.status(400).send(e)
    }
})
  
  

router.patch('/tasks/:id', auth, async(req, res)=>{
    const Updates = Object.keys(req.body)
    const AllowedUpdates = ['completed', 'description']
    const isValidUpdate = Updates.every((update)=>{
        return AllowedUpdates.includes(update)
    })
    if(!isValidUpdate){
        return res.status(400).send({error: 'Invalid updates'})
    }
    try{

        const task = await Task.findOne({_id: req.params.id, owner: req.user._id}) 
    
        if(!task){
            return res.status(404).send()
        }
        // making updates only when we are sure that there's actually such a task, if not it will display a 404 status code right away(either because there's no task with that taskId, or you are not the one who created the task)
        Updates.forEach(update=>{
            task[update] = req.body[update]
            
        }) 
        await task.save()
        res.send(task)
    }catch(e){
        return res.status(400).send(e)
    }
})

router.delete('/tasks/:id', auth, async(req, res)=>{
    try{
        const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id})
        if(!task){  //if no res to delete
            return res.status(404).send()
        }
        res.send(task) //task found
    }catch(e){
        res.status(500).send()  //some error occured
    }
})

module.exports = router