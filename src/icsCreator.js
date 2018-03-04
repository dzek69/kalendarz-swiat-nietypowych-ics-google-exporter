const ics = require("ics");

const create = (list) => {
    const { error, value } = ics.createEvents(list.map((event) => {
        return {
            title: event.name,
            start: [event.year, event.month, event.day, 23, 58],
            end: [event.year, event.month, event.day, 23, 59],
        }
    }));

    if (error) {
        throw new Error(error);
    }
    return value;
};

module.exports = create;
