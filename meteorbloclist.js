Tasks = new Mongo.Collection("tasks");

if (Meteor.isClient) {

  Template.active.helpers({

    //put this into a string so we only have one entry "priority"
    // _id most common way to find something
    // could make an argument with one parameter, take the string as an argument for priority
    seriousTasks: function () {
        return Tasks.find({priority: 'serious'}, {sort: {createdAt: +1}}, {checked: {$ne: true}});
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
    expiredTasks: function() {
      var timeNow = moment().unix();
         return Tasks.find({ $and: [ {taskExpired: {$lt: timeNow}}, {checked: false} ] });
         // {sort: {taskExpired: -1}}
    }
});

Template.completed.helpers({
  completedTasks: function() {
    return Tasks.find({checked: true});


     
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
      var currentTime = moment().format("dddd, MMMM Do YYYY, h:mm a"); 
      // var endDisplay = timeStart.diff(timeEnd, 'days');
      var timeStart = moment().unix();
      var timeEnd = moment().add(7, 'd').unix();
        // console.log(timeStart);
        // console.log(timeEnd);

      // Insert a task into the collection
      var id = Tasks.insert({
        text: text,
        createdAt: currentTime, // current time (format in correct date)
        // endsAt: endDisplay,
        taskStarted: timeStart,
        taskExpired: timeEnd,
        priority: priorityLevel
      });
      console.log(Tasks.find({_id:id}).fetch());
      // Clear form
      event.target.text.value = "";
    },


    // "change .hide-completed input": function (event) {
    //   Session.set("hideCompleted", event.target.checked);
    // }
  });

  Template.task.events({
    "click .toggle-checked": function () {
      // var moment = moment.unix();
      // Set the checked property to the opposite of its current value
      Tasks.update(this._id, {
        $set: {checked: ! this.checked}         

      }),

      Tasks.update(this._id, {
        $set: {priority: ''}
      })
    },
    "click .delete": function () {
      Tasks.remove(this._id);
    }
  });
}



if (Meteor.isServer) {
  Meteor.startup(function () {
    // look into autopublish, it is publishing everything (maybe insecure as well)
    // will want to remove these at some point
  });
}
