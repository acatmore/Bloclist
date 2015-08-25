Router.route('/', {
  name: "active",
  template: "active"
});

Router.route('/expired', {
  name: "expired",
  template: "expired"
});
Router.route('/completed', {
  name: "completed",
  template: "completed"
});