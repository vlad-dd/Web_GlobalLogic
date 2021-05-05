const Event = require('../models/Event');
const User = require('../models/User')


const get_user_events = (req, res) => {
    Event.find({author: req.user._id}, 
        function (err, docs) {
        if(err) {
            res.status(500).json({message: "Could not get events", err})
        } else if (docs) {
            res.status(200).json(docs)
        }
    })
}

const post_event = (req, res) => {
    if(req.body.event && req.body.day) {
        const newEvent = new Event({
            author: req.user._id,
            event: req.body.event,
            day: req.body.day,
            bkgColor: req.body.bkgColor,
            onEdit: false
        })

        newEvent.save((err, result) => {
            if(err) {
                console.log('Error at adding event')
                res.status(500).json({message: 'Error at adding event', err});
            } else {
                console.log('Event added')
                res.status(200).json({message: 'Successfully added event', result})
            }
        })
    } else {
        res.json({message: 'Please fill in info'});
    }
}

const delete_event = (req, res) => {
    if(req.body._id) {
        Event.findByIdAndDelete(req.body._id, 
            (err, result) => {
                if(err) {
                    res.status(500).json({message: 'Error at deleting user'})
                } else {
                    res.status(200).json({message: 'Event successfully deleted', result})
                }
            })
    } else {
        res.json({message: 'Please fill in info'});
    }
}

const update_event = (req, res) => {
    if(req.body._id && req.body.updated_event) {
        Event.findByIdAndUpdate(
            req.body._id,
            {
                $set: {event: req.body.updated_event}
            },
            {new: true}
            )      
        .then(data => {
            res.status(200).json({message: 'Successfully updated', data})
        })
        .catch(err => {
            res.status(500).json({message: 'Error at updating', err})
        })
    } else {
        res.json({message: 'Please fill in info'});
    }
}

module.exports = {
    get_user_events,
    post_event,
    delete_event,
    update_event
}