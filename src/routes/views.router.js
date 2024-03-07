import express from 'express';

const router = express();

router.get('/', (req, res) => {
    res.render('index', {});
})

export default router;
