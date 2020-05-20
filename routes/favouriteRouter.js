const express = require('express'); 
const bodyParser = require('body-parser'); 
const mongoose = require('mongoose'); 
const Favorites = require('../models/favourites'); 
const Dishes = require('../models/dishes');
const favoriteRouter = express.Router(); 
const cors = require('./cors'); 

var authentication = require('../authenticate'); 


favoriteRouter.use(bodyParser.json()); 

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res)=> {res.sendStatus(200);})
.get(cors.corsWithOptions, authentication.verifyUser, (req, res, next)=> {
    Favorites.findOne({user: req.user._id})
    .populate('user')
    .populate('dishes')
    .then((favorites)=> {
        res.statusCode =200; 
        res.setHeader('Content-type', 'application/json'); 
        res.json(favorites);
    }, (err)=> next(err))
    .catch((err)=> next(err))
})
.post(cors.corsWithOptions, authentication.verifyUser, (req, res, next) => {
    Favorites.findOne({user: req.user._id})
    .then((favorite) => {
        if (favorite) {
            for (var i=0; i<req.body.length; i++) {
                if (favorite.dishes.indexOf(req.body[i]._id) === -1) {
                    favorite.dishes.push(req.body[i]._id);
                }
            }
            favorite.save()
            .then((favorite) => {
                console.log('Favorite Created ', favorite);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            }, (err) => next(err)); 
        }
        else {
            Favorites.create({"user": req.user._id, "dishes": req.body})
            .then((favorite) => {
                console.log('Favorite Created ', favorite);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            }, (err) => next(err));
        }
    }, (err) => next(err))
    .catch((err) => next(err));  
})
.put(cors.corsWithOptions, authentication.verifyUser, (req, res)=> {
    statusCode = 403; 
    req.setEncoding('PUT is not supported on /favorites/'+ req.params.dishId)
})

.delete(cors.corsWithOptions, authentication.verifyUser, (req, res, next) => {
    Favorites.findOneAndRemove({"user": req.user._id})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));   
});

favoriteRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res)=> {res.sendStatus(200);})
.get(cors.corsWithOptions, authentication.verifyUser, (req, res, next)=> {
    req.statusCode = 4.3; 
    res.end('Get operation is not supported on the /favorites/'+ req.params.dishId);
})

.post(cors.corsWithOptions, authentication.verifyUser, (req, res, next)=> {
    Favorites.findOne({user: req.user._id})
    .then((favorite)=> {
        if(favorite){
            if(favorite.dishes.indexOf(req.params.dishId)){
                favorite.dishes.push(req.params.dishId)
                favorite.save()
                .then((favorite)=> {
                    console.log('Favorite Created ', favorite); 
                    res.statusCode = 200; 
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);

                }, (err)=> next(err))
            }
        }
        else{
            Favorites.create({"user": req.user._id, "dishes": [req.params.dishId]})
            .then((favorite)=> {
                console.log('Fvaorite Created ', favorite); 
                res.statusCode = 200; 
                res.setHeader('Content-Type', 'application/json'); 
                res.json(favorite); 

            }, (err) => next(err))
        }
    }, (err) => next(err))
    .catch((err)=> next(err));
})

.put(cors.corsWithOptions, authentication.verifyUser, (erq, ers, next)=> {
    res.statusCode = 304;
    res.end('PUT opertaion is not supported on /favorites/ ' + req.params.dishId);

})

.delete(cors.corsWithOptions, authentication.verifyUser, (req, res, next)=> {
    Favorites.findOne({'user': req.user._id})
    .then((favorite)=> {
        if(favorite){
            index = favorite.dishes.indexOf(req.params.dishId); 
            if(index >= 0){
                favorite.dishes.splice(index, 1); 
                favorite.save()
                .then((favorite)=> {
                    console.log('Favorite delete ', favorite); 
                    res.statusCode = 200; 
                    res.setHeader('Content-type', 'application/json'); 
                    res.json(favorite); 
                }, (err)=> next(err))
            }
            else {
                err = new Error('Dish '+ req.params.dishId + ' Not found'); 
                err.status = 404; 
                return next(err);
            }
        }else {
            err = new Error ('Favorite not found! Sad -_-');
            err.status = 404; 
            return next(err); 
        }
    }, (err)=> next(err))
    .catch((err)=> next(err))
}); 
module.exports = favoriteRouter; 