const model = require('../database/models');
const Location = model.Locations;
const {validationResult} = require('express-validator');


const getAllLocations = async (req, res) => {
try {
    const locations = await Location.findAll(include = {all: true});
    res.status(200).json(locations);
    
} catch (error) {
    res.status(500).json({ error: error.message });
}
}

const createLocation = async (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }
    else
    {
        try{
            console.log(req.body);
            const location = await Location.create({"name": req.body.name});
            return res.status(201).json({
                location,
            });
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        
        }
    }
}

const updateLocation = async (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }
    else
    {
        try {
            const { id } = req.params;
            const [updated] = await Location.update({"name":req.body.name}, {
                where: { id: id }
            });
            if (updated) {
                const updatedLocation = await Location.findOne({ where: { id: id } });
                return res.status(200).json({ location: updatedLocation });
            }
            else
            {
                return res.status(404).json({error: error.message});  
            }
        }
        catch (error) {
            return res.status(500).json({error: error.message});
        }}}

const deleteLocation = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Location.destroy({
            where: { id: id }});
            if (deleted) {
                return res.status(204).send("Location deleted");
            }
            else
            {
                return res.status(404).json({error: "Location not found"});  
            }
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }}


module.exports = {
createLocation,
getAllLocations,
updateLocation,
deleteLocation}