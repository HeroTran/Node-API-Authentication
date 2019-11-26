function createObjectPagination(res, count, pageNumber, pageSize, results) {
    return res.json({
        total: count,
        page: pageNumber,
        pageSize: pageSize,
        results: results
    });
}

function createRespondObjectError(res, error) {
    return res.status(400).send({
        "isSuccess": false,
        'error': error
    });
}

function createRespondObjectSuccess(res, data) {
    return res.status(400).send({
        "isSuccess": true,
        'data': data
    });
}

module.exports.createObjectPagination = createObjectPagination;
module.exports.createRespondObjectError = createRespondObjectError;
module.exports.createRespondObjectSuccess = createRespondObjectSuccess;