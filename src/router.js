import express from 'express';
import { MongoClient } from 'mongodb';

const router = express.Router();
export default router;

const client = new MongoClient('mongodb://localhost:27017');

const db = client.db('cinema');
const moviesCollection = db.collection('movies');

router.get('/', async (req, res) => {
    let movies = await moviesCollection.find().toArray();
    res.render('index', { movies });
});

async function loadMovies() {
    const movies = [
        {
            "title": "Smile 2",
            "frontpage": "/001_m.jpg"
        },
        {
            "title": "Titanic",
            "frontpage": "/002_m.jpg"
        },
        {
            "title": "Interstellar",
            "frontpage": "/005_m.jpg"
        },
        {
            "title": "Lalaland",
            "frontpage": "/581119.jpg"
        },
        {
            "title": "Resacon En Las Vegas",
            "frontpage": "/20028573.jpg"
        },
        {
            "title": "Gladiator",
            "frontpage": "/20149073.jpg"
        },
        {
            "title": "Avengers End Game",
            "frontpage": "/MV5BMTc5MDE2ODcwNV5BMl5BanBnXkFtZTgwMzI2NzQ2NzM@._V1_FMjpg_UX1000_.jpg"
        },
        {
            "title": "Obsession",
            "frontpage": "/obsession__236x336.jpg"
        },
        {
            "title": "Padre No Hay Mas Que Uno 5",
            "frontpage": "/padrenohaymasquno.jpg" 
        }
    ];
    
    await moviesCollection.deleteMany();
    await moviesCollection.insertMany(movies);

    
    await moviesCollection.deleteMany();
    await moviesCollection.insertMany(movies);
}

await loadMovies();
