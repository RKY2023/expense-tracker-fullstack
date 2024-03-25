const getExpenses = (req, res) => {
    return req.user.getExpenses();
}

module.exports = {
    getExpenses
}