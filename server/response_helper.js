'use strict'

module.exports = {
    returnSuccessResponse: function(req, res, hasPayload, payload) {
        if(hasPayload === true) {
            return res.status(200).json(
                {"status": "success", "hasPayload": hasPayload, "payload": payload}
            );
        }
        else {
            return res.status(200).json(
                {"status": "success", "hasPayload": hasPayload}
            );
        }
    },

    returnInternalServerError: function(req, res, message) {
        return res.status(500).json(
            {"status": "error", "message": message}
        );
    },

    returnBadRequest: function(req, res, message) {
        return res.status(400).json(
            {"status": "error", "message": message}
        );
    },

    returnNotFound: function (req, res, message) {
        return res.status(404).json(
            {"status": "error", "message": message}
        )
    },

    returnUnacceptableResponse: function (req, res, message) {
        return res.status(HttpStatus.NOT_ACCEPTABLE).json(
            {"status": "error", "message": message}
        )
    },

    returnStatusError: function (status, req, res, json) {
        return res.status(status).json(
            json
        );
    }
}