import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import multer from 'multer';
import path from 'path';

const router = express.Router();
export default router;

const client = new MongoClient('mongodb://localhost:27017');

const db = client.db('cinema');
const moviesCollection = db.collection('movies');
const reviewsCollection = db.collection('reviews');

const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, unique + path.extname(file.originalname));
    }
});
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // máx 5 MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) cb(null, true);
        else cb(null, false); // ignora archivos que no sean imagen
    }
});

const PAGE_SIZE = 6;

// Render the index with pagination
async function renderMovieList(res, filter, basePath, extraQuery, pageParam) {
    const total = await moviesCollection.countDocuments(filter);
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

    let page = parseInt(pageParam) || 1;
    page = Math.min(Math.max(page, 1), totalPages);

    const movies = await moviesCollection.find(filter)
        .sort({ _id: 1 })
        .skip((page - 1) * PAGE_SIZE)
        .limit(PAGE_SIZE)
        .toArray();

    const prefix = extraQuery ? `${basePath}?${extraQuery}&` : `${basePath}?`;

    res.render('index', {
        movies,
        showPagination: totalPages > 1,
        currentPage: page,
        totalPages,
        hasPrev: page > 1,
        hasNext: page < totalPages,
        prevUrl: `${prefix}page=${page - 1}`,
        nextUrl: `${prefix}page=${page + 1}`
    });
}

router.get('/', async (req, res) => {
    await renderMovieList(res, {}, '/', '', req.query.page);
});

//Search bar
router.get('/search', async (req, res) => {
    const searchTerm = req.query.title || '';
    const safeTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    await renderMovieList(
        res,
        { title: { $regex: safeTerm, $options: 'i' } },
        '/search',
        `title=${encodeURIComponent(searchTerm)}`,
        req.query.page
    );
});

//Filter by genre
router.get('/genre/:genreName', async (req, res) => {
    const genre = req.params.genreName;
    await renderMovieList(
        res,
        { genre: genre },
        `/genre/${encodeURIComponent(genre)}`,
        '',
        req.query.page
    );
});

// Form to create a new movie
router.get('/movie/new', (req, res) => {
    res.render('new-item', {
        movie: {},
        isEdit: false,
        ...buildAgeRatingOptions(),
        ...buildGenreOptions(),
        ...buildPlatformsOptions(),
        action: '/movie',
        actionCancel: '/'
    });
});

// Delete movie (Main Entity)
router.post('/movie/:id/delete', async (req, res) => {
    const movieId = parseId(req.params.id);
    if (!movieId) return renderError(res, 'Invalid movie ID', '/', 'Return to main page');

    await reviewsCollection.deleteMany({ movieId: movieId });
    await moviesCollection.deleteOne({ _id: movieId });
    renderMessage(res, 'Movie deleted succesfully', '/', 'Return to main page');
});

//Edit Movie (Main Entity)
router.get('/movie/:id/edit', async (req, res) => {
    const movieId = parseId(req.params.id);
    const movie = movieId && await moviesCollection.findOne({ _id: movieId });

    if (!movie) return renderError(res, 'Movie not found', '/', 'Return to main page');

    res.render('new-item', {
        movie,
        isEdit: true,
        hasImage: Boolean(movie.frontpage),
        ...buildAgeRatingOptions(movie.ageRating),
        ...buildGenreOptions(movie.genre),
        ...buildPlatformsOptions(movie.platforms),
        action: `/movie/${movie._id}/edit`,
        actionCancel: `/movie/${movie._id}`
    });
});

router.post('/movie', upload.any(), saveMovie);
router.post('/movie/:id/edit', upload.any(), saveMovie);

router.get('/movie/:id/image', async (req, res) => {
    const movieId = parseId(req.params.id);
    const movie = movieId && await moviesCollection.findOne({ _id: movieId });
    if (!movie) return renderError(res, 'Movie not found', '/', 'Return to main page');

    res.download('.' + movie.frontpage);
});



async function saveMovie(req, res) {
    const isEdit = Boolean(req.params.id);
    const movieId = isEdit ? parseId(req.params.id) : null;
    const backUrl = isEdit ? `/movie/${req.params.id}` : `/`;
    const errors = validateMovie(req.body);
    if (errors.length > 0) {
        return renderError(res, errors.join(', '), isEdit ? `/movie/${req.params.id}/edit` : '/movie/new', 'Go back');
    }

    const movie = movieId && await moviesCollection.findOne({ _id: movieId });

    const theMovie = {
        title: req.body.movieTitle ? req.body.movieTitle.trim() : '',
        year: req.body.movieYear ? req.body.movieYear.trim() : '',
        ageRating: req.body.ageRating || '',
        genre: req.body.genre || '',
        synopsis: req.body.synopsis ? req.body.synopsis.trim() : '',
        platforms: Array.isArray(req.body.platforms) ? req.body.platforms.join(', ') : (req.body.platforms || ''),
        duration: req.body.duration ? req.body.duration.trim() : '',
        director: req.body.director ? req.body.director.trim() : '',
        cast: req.body.cast ? req.body.cast.trim() : '',
      frontpage: (req.files && req.files.length > 0) ? `/uploads/${req.files[0].filename}` : (movie ? movie.frontpage : '')
    };

    if (isEdit) {
        await moviesCollection.updateOne({ _id: movieId }, { $set: theMovie });
    } else {
        await moviesCollection.insertOne({ ...theMovie, createdAt: new Date() });
    }

    renderMessage(res, isEdit ? 'Movie updated' : 'Movie created', backUrl, 'Go back to movie page');
}



// 3. Route to view details of a specific movie by its ID
router.get('/movie/:id', async (req, res) => {
    const movieId = parseId(req.params.id);
    const movie = movieId && await moviesCollection.findOne({ _id: movieId });
    if (!movie) return renderError(res, 'Movie not found', '/', 'Go back to home');
    
    res.render('secondarypage', { 
        movie, 
        reviews: await getReviewsForMovie(movie._id), 
        review: {}, 
        ...buildRatingOptions() 
    });   
});

// Edit review form
router.get('/movie/:movieId/review/:reviewId/edit', async (req, res) => {
    const movie = await loadMovie(req, res);
    if (!movie) return;
    const review = await reviewsCollection.findOne({ _id: parseId(req.params.reviewId), movieId: movie._id });
    if (!review) {
        return renderError(res, 'Review not found', `/movie/${movie._id}`, 'Go back to movie page');
    } 
    res.render('review_form', { 
        movie, 
        review, 
        ...buildRatingOptions(review.rating), 
        action: `/movie/${movie._id}/review/${review._id}` 
    });
});

//create and update review form
async function saveReview(req, res) {
const movie = await loadMovie(req, res);
if (!movie) return;
const isEdit = Boolean(req.params.reviewId);
const reviewId = isEdit ? parseId(req.params.reviewId) : null;
const backUrl = isEdit ? `/movie/${movie._id}/review/${req.params.reviewId}/edit` : `/movie/${movie._id}`;
const errors = await validatereview(req.body, movie._id, reviewId);
if (errors.length > 0) {
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
if (text.length < 10 || text.length > 500){
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
return { options, noRating: !selected };
}


//Builds an object with age rating options for the movie form
function buildAgeRatingOptions(selected) {
    const options = ["General audiences","Parental guidance","PG-13","Restricted", "NC-17"  ].map(value => ({
        value,
        label: `${value}`,
        selected: value === selected
    }));
    return { options, noAgeRating: !selected };
}

//Builds an object with genre options for the movie form
function buildGenreOptions(selected) {
    const genreOptions = ["Action","Comedy","Romance","Sci-fi", "Terror"  ].map(value => ({
        value,
        label: `${value}`,
        selectedGenre: value === selected
    }));
    return { genreOptions, noGenre: !selected };
}

//Builds an object with genre options for the movie form
function buildPlatformsOptions(selected) {
    let aSelected = selected ? selected.split(", "):[];

    const platformsOptions = ["Netflix","HBO","Prime Video","Disney+", "Movistar+", "Max", "Paramount+"].map(value => ({
        value,
        label: `${value}`,
        selectedPlatform: aSelected.includes(value)
    }));
    return { platformsOptions, noPlatforms: !selected };
}



//Returns the reviews of a movie with a "stars" string ready for the template
async function getReviewsForMovie(movieId){
const list = await reviewsCollection.find({movieId}).toArray();
return list.map(review => ({...review, stars: '★'.repeat(review.rating)}));
} 


// Inserts sample movies only if the collection is empty
async function loadMovies() {
    if (await moviesCollection.countDocuments() > 0) return;

    const movies = [
        {
            title: 'Smile 2',
            frontpage: '/001_m.jpg',
            genre: 'Terror',
            duration: 127,
            year: '2024-10-18',
            ageRating: 'NC-17',
            director: 'Parker Finn',
            platforms: 'Paramount+',
            cast: 'Naomi Scott, Rosemarie DeWitt, Lukas Gage',
            synopsis: 'A pop star, about to go on tour, starts experiencing terrifying and inexplicable events after a traumatic incident.'
        },
        {
            title: 'Titanic',
            frontpage: '/002_m.jpg',
            genre: 'Romance',
            duration: 195,
            year: '1997-12-19',
            ageRating: 'PG-13',
            director: 'James Cameron',
            platforms: 'Disney+, Prime Video',
            cast: 'Leonardo DiCaprio, Kate Winslet, Billy Zane',
            synopsis: 'A young aristocrat falls in love with a poor artist aboard the ill-fated R.M.S. Titanic.'
        },
        {
            title: 'Interstellar',
            frontpage: '/005_m.jpg',
            genre: 'Sci-fi',
            duration: 169,
            year: '2014-11-07',
            ageRating: 'PG-13',
            director: 'Christopher Nolan',
            platforms: 'Netflix, Prime Video',
            cast: 'Matthew McConaughey, Anne Hathaway, Jessica Chastain',
            synopsis: 'A team of explorers travels through a wormhole in space to ensure humanity\'s survival.'
        },
        {
            title: 'Lalaland',
            frontpage: '/581119.jpg',
            genre: 'Romance',
            duration: 128,
            year: '2016-12-09',
            ageRating: 'General audiences',
            director: 'Damien Chazelle',
            platforms: 'Netflix, Prime Video',
            cast: 'Ryan Gosling, Emma Stone, John Legend',
            synopsis: 'A jazz pianist and an aspiring actress fall in love while chasing their dreams in Los Angeles.'
        },
        {
            title: 'Resacon En Las Vegas',
            frontpage: '/20028573.jpg',
            genre: 'Comedy',
            duration: 100,
            year: '2009-06-05',
            ageRating: 'NC-17',
            director: 'Todd Phillips',
            platforms: 'Max, Prime Video',
            cast: 'Bradley Cooper, Ed Helms, Zach Galifianakis',
            synopsis: 'Three friends wake up after a bachelor party in Las Vegas with no memory of the night and the groom missing.'
        },
        {
            title: 'Avengers End Game',
            frontpage: '/MV5BMTc5MDE2ODcwNV5BMl5BanBnXkFtZTgwMzI2NzQ2NzM@._V1_FMjpg_UX1000_.jpg',
            genre: 'Action',
            duration: 181,
            year: '2019-04-26',
            ageRating: 'PG-13',
            director: 'Anthony and Joe Russo',
            platforms: 'Disney+',
            cast: 'Robert Downey Jr., Chris Evans, Scarlett Johansson',
            synopsis: 'The Avengers assemble once more to reverse the damage caused by Thanos.'
        },
    ];

    await moviesCollection.insertMany(movies);
}

await loadMovies();
// Validates movie data and returns an array of errors
function validateMovie(data) {
    const errors = [];
    const title = (data.movieTitle || '').trim();
    const synopsis = (data.synopsis || '').trim();
    const director = (data.director || '').trim();
    const cast = (data.cast || '').trim();
    const duration = Number(data.duration);
    const year = (data.movieYear || '').trim();

    if (!title) errors.push('Title is required');
    else if (title.length > 100) errors.push('Title is too long (max 100 characters)');

    if (!/^\d{4}-\d{2}-\d{2}$/.test(year) || isNaN(Date.parse(year))) {
        errors.push('Year must be a valid date');
    } else {
        const y = Number(year.slice(0, 4));
        if (y < 1888 || y > 2100) errors.push('Year must be between 1888 and 2100');
    }

    if (!data.ageRating) errors.push('Age rating is required');
    if (!data.genre) errors.push('Genre is required');

    if (synopsis.length < 10 || synopsis.length > 1000) {
        errors.push('Synopsis must be between 10 and 1000 characters');
    }

    if (!Number.isInteger(duration) || duration < 1 || duration > 600) {
        errors.push('Duration must be a whole number between 1 and 600 minutes');
    }

    if (!director) errors.push('Director is required');
    else if (director.length > 100) errors.push('Director is too long (max 100 characters)');

    if (!cast) errors.push('Cast is required');
    else if (cast.length > 500) errors.push('Cast is too long (max 500 characters)');

    return errors;
}