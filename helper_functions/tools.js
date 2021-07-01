module.exports = {
    
    // adds timestamps before a set of tasks
    out_formatter : function out_formatter(tasks, timestamps) {
        
        // making the array that will hold the processed output
        let final_array = [];
        for (var i = 0; i < tasks.length; i++) {
            
            // formats the information from the sheet to appear as if they have timestamps
            final_array.push(timestamps[i] + ' -- ' + tasks[i]);
        }

        // sends the final array back to the function where its called
        return final_array;
    },

    // gets the index of task 
    get_task_index : function get_task_index(timestamps, time){
        
        // takes the time from 12:00 --> 12
        // because it elimates minutes and makes it easier to compare
        let nice_time = time.split(':')[0]
        
        
        for (var j = 0; j < timestamps.length; j++) {
            
            // takes the time from 12:00 --> 12
            // because it elimates minutes and makes it easier to compare 
            var nice_ts = timestamps[j][0].split(':')[0];
            
            // if the timestamp matches the current time, return its index
            if (nice_ts == nice_time) {
                return j;
            } 
        }
    },

    // returns the full name of a day based on the initial 3 or 4 letters of its name
    init3_to_full : function init3_to_full(init3) {
        switch (init3) {
            case 'mon':
                return 'Monday';

            case 'tues': 
                return 'Tuesday';

            case 'wed':
                return 'Wednesday';

            case 'thu':
                return 'Thursday';

            case 'fri':
                return 'Friday';

            case 'sat':
                return 'Saturday';

            case 'sun': 
                return 'Sunday';

            default:
                return init3;
        }
    },

    // makes a string that can be used to assign a range of cells 
    range_maker : function range_maker(uday) {
        
        // assigns the day_column to a letter based on the day entered
        switch (uday) {
            case 'mon':
            case 'Monday':
                day_column = 'B';
                break; 
            
            case 'tues':
            case 'Tuesday':
                day_column = 'C';
                break;

            case 'wed':
            case 'Wednesday':
                day_column = 'D';
                break;

            case 'thu':
            case 'Thursday':
                day_column = 'E';
                break;

            case 'fri':
            case 'Friday':
                day_column = 'F';
                break;

            case 'sat':
            case 'Saturday':
                day_column = 'G';
                break;

            case 'sun':
            case 'Sunday':
                day_column = 'H';
                break;
        }

        // "formats" the word to output in a way the api understands
        let out = 'Schedule!' + day_column + '3:' + day_column + '26';
        return out;
    },

    // 08 --> 08:00
    hr_to_full : function hr_to_full (hour) {
        return hour + ':00'
    }
        
}