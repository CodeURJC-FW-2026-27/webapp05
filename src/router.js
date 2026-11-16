import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';


const router = express.Router();
export default router;

const client = new MongoClient('mongodb://localhost:27017');

const db = client.db('cinema');
const moviesCollection = db.collection('movies');
const reviewsCollection = db.collection('reviews');


router.get('/', async (req, res) => {
    let movies = await moviesCollection.find().toArray();
    res.render('index', { movies });
});
//Movie details page(includes reviews and review form)
router.get('/movie/:id', async (req, res) => {
const movieId = paraseId(req.params.id);
const movie = movieId && await moviesCollection.findOne({ _id: movieId });
 if (!movie) return renderError(res, 'Movie not found', '/', 'Go back to home');
res.render('secondarypage', { movie, reviews: await getReviewsForMovie(movie._id), review:{}, ...buildRatingOptions() })   
});

//Edit review form
router.get('/movie/:movieId/review/:reviewId/edit', async (req, res) => {
 const movie = await loadMovie(req, res);
if(!movie) return;
const review = await reviewsCollection.findOne({ _id: parseId(req.params.reviewId), movieId: movie._id });
if(!review){
return renderError(res, 'Review not found', `/movie/${movie._id}`, 'Go back to movie page');

} 
res.render('reviewform', { movie, review, ...buildRatingOptions(review.rating), action: `/movie/${movie._id}/review/${review._id}` });

}); 

//create and update review form
async function saveReview(req, res) {
const movie = await loadMovie(req, res);
if (!movie) return;
const isEdit = Boolean(req.params.reviewId);
const reviewId = isEdit ? parseId(req.params.reviewId) : null;
const backUrl = isEdit ? `/movie/${movie._id}/review/${req.params.reviewId}/edit` : `/movie/${movie._id}`;
const errors = validatereview(req.body, movie._id, reviewId);
if (errors.lenght > 0) {
return renderError(res, errors.join(', '), backUrl, 'Go back');

} 
const data ={ 
 author: req.body.author.trim(),
title:req.body.title.trim(),
rating: Number(req.body.rating),
text: req.body.text.trim(),
} ;
if (isEdit) {
await reviewsCollection.updateOne({ _id: reviewId, movieId: movie._id }, { $set: data });


} else {
await reviewsCollection.insertOne({ ...data, movieId: movie._id , createdAt: new Date() });

} 

renderMessage(res, isEdit ? 'Review updated' : 'Review created', `/movie/${movie._id}`, 'Go back to movie page');

} 

router.post('/movie/:movieId/review', saveReview);
router.post('/movie/:movieId/review/:reviewId', saveReview);

//delete review
router.post('/movie/:movieId/review/:reviewId/delete', async (req, res) => {
const movie = await loadMovie(req, res);
if(!movie) return;

await reviewsCollection.deleteOne({ _id: parseId(req.params.reviewId), movieId: movie._id });
renderMessage(res, 'Review deleted', `/movie/${movie._id}`, 'Go back to movie page');

});

//helper functions
function parseId(id) {
return ObjectId.isValid(id) ? new ObjectId(id) : null;

} 
function renderMessage(res, text, link, linkText) {
res.render('message', { text, link, linkText });

} 
function renderError(res, message, backUrl, backText) {
res.status(400).render('error', { message, backUrl, backText });

} 

//Loads movie from database and renders error if not found
async function loadMovie(req, res) {
const movieId = parseId(req.params.movieId);
const movie = movieId && await moviesCollection.findOne({ _id: movieId });
if (!movie) renderError(res, 'Movie not found', '/', 'Go back to home');
return movie;
}

//Validates review data and returns an array of error messages
async function validatereview(data, movieId, reviewId) {
const errors = [];
const author = (data.author || '').trim();
const title = (data.title || '').trim();
const rating = Number(data.rating);
const text = (data.text || '').trim();
if (!author) errors.push('Author is required');
if (!title){
errors.push('Title is required');   
} else if (title.length > 100) {
errors.push('Title is too long (max 100 characters)');
} else {
const filter = {movieId, title}; 
if(reviewId) filter._id = { $ne: reviewId };
if(await reviewsCollection.findOne(filter)){
errors.push('Title must be unique for this movie');
} 

}
if (!data.rating || !Number.isInteger(rating) || rating < 1 || rating > 5) {
errors.push('Rating must be an integer between 1 and 5');
}
if (text.lenght < 10 || text.lenght > 500){
errors.push('Text must be between 10 and 500 characters');
} 
return errors;
}

//Builds an object with rating options for the review form
function buildRatingOptions(selected) {
const options = [1,2,3,4,5].map(value => ({
value,
label: `${value} star${value > 1 ? 's' : ''}`,
selected: value === selected
}));
return { ratingOption, noRating: !selected };
}

//Returns the reviews of a movie with a "stars" string ready for the template
async function getReviewsForMovie(movieId){
const list = await reviewsCollection.find({movieId}).toArray();
return list.map(review => ({...review, stars: '★'.repeat(review.rating)}));
} 


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
