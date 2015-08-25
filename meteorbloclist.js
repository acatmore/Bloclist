Tasks = new Mongo.Collection("tasks");

if (Meteor.isClient) {

  Template.active.helpers({
    // tasks: function () {

    //   if (Session.get("hideCompleted")) {
    //     // If hide completed is checked, filter tasks
    //     return Tasks.find({checked: {$ne: true}}, {sort: {createdAt: -1}});

    //   } else {
    //     // Otherwise, return all of the tasks
    //     return Tasks.find({}, {sort: {createdAt: -1}});
    //     //add priority levels, use cursor to sort
    //   }
    // },

    // taskHasExpired: function () {
    //   if (moment().unix === Tasks.find({taskExpired: timeEnd})) {
    //     Tasks.update(this._id, {
    //       $set: {expired: true}
    //     });
    //   }
    // },

    // taskIsCompleted: function () {
    //   if (checked: true)
    // },

    //put this into a string so we only have one entry "priority"
    // _id most common way to find something
    // could make an argument with one parameter, take the string as an argument for priority
    seriousTasks: function () {
        return Tasks.find({priority: 'serious'}, {sort: {createdAt: +1}});
    },
    pressingTasks: function () {
        return Tasks.find({priority: 'pressing'}, {sort: {createdAt: +1}});
    },
    routineTasks: function () {
        return Tasks.find({priority: 'routine'}, {sort: {createdAt: +1}});
    },

    hideCompleted: function () {
      return Session.get("hideCompleted");
          // Show newest tasks at the top
          // need to move tasks to completed view once they have been checked as completed
    },
    incompleteCount: function () {
      return Tasks.find({checked: {$ne: true}}).count();
    }


 });

Template.expired.helpers({
  // var time = moment().unix();
  // var expired = Tasks.find({taskExpired: timeEnd})
  // cursor (object) cannot be compared to a number
  //look through mongoDB to do a comparator to its
  // http://docs.mongodb.org/v3.0/reference/operator/query/gte/
  //http://stackoverflow.com/questions/23073023/date-range-mongo-query-using-meteor-js
    expiredTasks: function() {
      var timeNow = moment().unix();
         return Tasks.find({ $and: [ {taskExpired: {$lt: timeNow}}, {checked: false} ] });
         // {sort: {taskExpired: -1}}
    }
});

Template.completed.helpers({
  completedTasks: function() {
    return Tasks.find({checked: true});
    // , {sort: timeCompleted}

     
  }
});
 
  Template.active.events({


    "submit .new-task": function (event, prioritySerious, priorityPressing, priorityRoutine) {
      // Prevent default browser form submit
      event.preventDefault();
 
      // Get value from form element
      var text = event.target.text.value;
      console.log(event.target);

      var priorityLevel = $('[name=priority]:checked').val();
      // maybe put it in as a date object
      var currentTime = moment().unix(); 
      var timeStart = moment().unix();
      var timeEnd = moment().add(1, 'm').unix();
        // console.log(timeStart);
        // console.log(timeEnd);

      // Insert a task into the collection
      var id = Tasks.insert({
        text: text,
        createdAt: currentTime, // current time (format in correct date)
        taskStarted: timeStart,
        taskExpired: timeEnd,
        priority: priorityLevel
      });
      console.log(Tasks.find({_id:id}).fetch());
      // Clear form
      event.target.text.value = "";
    },


    "change .hide-completed input": function (event) {
      Session.set("hideCompleted", event.target.checked);
    },
  });

  Template.task.events({
    "click .toggle-checked": function () {
      var moment = moment.unix();
      // Set the checked property to the opposite of its current value
      Tasks.update(this._id, {
        $set: {checked: ! this.checked}
        
      // },
      //   {
      //     $set: {timeCompleted: moment}
      });
    },
    "click .delete": function () {
    }
  });
}



if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
    // look into autopublish, it is publishing everything (maybe insecure as well)
    // will want to remove these at some point
  });
}
