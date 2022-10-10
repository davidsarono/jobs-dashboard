require('dotenv').config();
const express = require("express");
const axios = require('axios');

const instance = axios.create();

instance.defaults.baseURL = process.env.DANS_API_URL
instance.interceptors.request.use(function (config) {
    if (!config.url) {
        return config;
    }

    const currentUrl = new URL(config.url, config.baseURL);
    Object.entries(config.urlParams || {}).forEach(([k, v,]) => {
        currentUrl.pathname = currentUrl.pathname.replace(`:${k}`, encodeURIComponent(v));
    });

    return { ...config, url: currentUrl.pathname }
}, function (error) {
    return Promise.reject(error);
});

const jobsRoute = express.Router();

jobsRoute.get(
    '/',
    async (req, res) => {
        try {
            const response = await instance.get(
                '/recruitment/positions.json',
                {
                    params: {
                        page: req.query?.page,
                        description: req.query?.description,
                        location: req.query?.location,
                        full_time: req.query?.full_time,
                    }
                }
            );

            return res.status(200).json({
                data: response.data,
                message: 'Success to get Jobs'
            });
        } catch (error) {
            return res.status(500).json({
                data: null,
                message: 'ERROR',
                error
            });
        }
    }
);

jobsRoute.get(
    '/:id',
    async (req, res) => {
        try {
            const response = await instance.get(
                '/recruitment/positions/:id',
                {
                    urlParams: {
                        id: req.params?.id,
                    }
                }
            );

            return res.status(200).json({
                data: response.data,
                message: 'Success to get Jobs'
            });
        } catch (error) {
            return res.status(500).json({
                data: null,
                message: 'ERROR',
                error
            });
        }
    }
)

module.exports = jobsRoute;