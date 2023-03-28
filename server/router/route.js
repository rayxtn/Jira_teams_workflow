import { Router } from "express";


const router = new Router();

// POST Methods
router.route('/Register').post((req, res) =>{
    res.json('register route');
})

// GET Methods


// PUT Methods


export default router;