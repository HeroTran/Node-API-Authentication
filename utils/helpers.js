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
    return res.status(200).send({
        "isSuccess": true,
        'data': data
    });
}

const generateRandomCode = (length) =>{
    const USABLE_CHARACTERS = "abcdefghijklmnopqrstuvwxyz".split("");
    return new Array(length).fill(null).map(() => {
        return USABLE_CHARACTERS[Math.floor(Math.random() * USABLE_CHARACTERS.length)];
    }).join("");
};

module.exports.createObjectPagination = createObjectPagination;
module.exports.createRespondObjectError = createRespondObjectError;
module.exports.createRespondObjectSuccess = createRespondObjectSuccess;
module.exports.generateRandomCode = generateRandomCode;