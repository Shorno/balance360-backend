import {NewsLetter} from "../models/NewsLetter.js";

export const subscribe = async (req, res) => {
    try {
        const {name, email} = req.body;
        const existingSubscriber = await NewsLetter.findOne({email});
        if (existingSubscriber) {
            return res.status(400).json({error: 'Email already subscribed'});
        }
        const subscriber = await NewsLetter.create({
            email,
            name
        });
        res.status(201).json(subscriber);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

export const getAllSubscribers = async (req, res) => {
    try {
        const subscribers = await NewsLetter.find();
        res.status(200).json(subscribers);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}