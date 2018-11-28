export class App {
  constructor() {
    this.message = "Hello world! Seriously, it has never been easier than this!";
  }
  // message = "Hello world";
  configureRouter(config, router) {
    config.map([
      {
        route: ["", "contacts"],
        moduleId: "views/contacts/contacts",
        nav: true,
        title: "Contacts"
      }
    ]);
    this.router = router;
    // Comment the following lines out if you don't wanna use push state
    // and just use simple # base routing instead
    // config.options.pushState = true;
    // config.options.root = "/";
  }
}
