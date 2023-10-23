const fs = require('fs');
const path = require('path');
const data = fs.readFileSync(path.join(__dirname + '/vacation_record.json'), 'utf8');
const vacationRecord = JSON.parse(data);
const result = vacationRecord
    .reduce((acc, {user:{
        _id,
        name
    }, endDate, startDate}) => {
        const user = acc.find((item) => item.userId === _id);
        if (user) {
            user.vacations.push({
                startDate,
                endDate
            });
        } else {
            acc.push({
                userId:_id,
                userName:name,
                vacations: [{
                    startDate,
                    endDate
                }]
            });
        }
        return acc;
    }, []);
fs.writeFileSync(path.join(__dirname + '/result_record_grouped.json'), JSON.stringify(result, null, 2), 'utf8');