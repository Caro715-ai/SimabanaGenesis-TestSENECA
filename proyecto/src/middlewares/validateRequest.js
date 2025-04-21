const validateRequest = (schema) => async (req, res, next) => {
    try {
        await schema.parseAsync({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        return next();
    } catch (error) {
        const errorMessages = error.issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message,
        }));
        return res.status(400).json({ errors: errorMessages });
    }
};

module.exports = validateRequest; 