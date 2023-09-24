interface note {
    text: string,
    color: string,
    meta: {
        time: {
        hour: string,
        min: string,
        },
        date: {
        day: string,
        month: string,
        year: string,
        }
    }
}

interface date {
    year: string,
    month: string,
    day: string
}

interface time {
    hour: string,
    min: string
}

export {
    note, date, time
}