angular

.module('attendance-app', ['ionic', 'ngCordova'])

.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider

        .state('app', {
            url: '/app',
            abstract: true,
            templateUrl: 'templates/menu.html',
            controller: 'appCtrl'
        })

            .state('app.event-list', {
                url: '/event-list',
                views: {
                    'menu-content': {
                        templateUrl: 'templates/event-list.html',
                        controller: 'eventlistCtrl'
                    }
                }
            })

            .state('app.view-me', {
                url: '/view-me',
                views: {
                    'menu-content': {
                        templateUrl: 'templates/view-me.html',
                        controller: 'viewmeCtrl'
                    }
                }
            })

            .state('app.opening-attendance', {
                url: '/opening-attendance',
                views: {
                    'menu-content': {
                        templateUrl: 'templates/opening-attendance.html',
                        controller: 'eventopeningCtrl'
                    }
                }
            })

            .state('app.closing-attendance', {
                url: '/closing-attendance',
                views: {
                    'menu-content': {
                        templateUrl: 'templates/closing-attendance.html',
                        controller: 'eventclosingCtrl'
                    }
                }
            })

            .state('app.event-feedback', {
                url: '/event-feedback',
                views: {
                    'menu-content': {
                        templateUrl: 'templates/event-feedback.html',
                        controller: 'eventfeedbackCtrl'
                    }
                }
            })

            .state('app.opening-closing', {
                url: '/opening-closing',
                views: {
                    'menu-content': {
                        templateUrl: 'templates/opening-closing.html',
                        controller: 'eventstatusCtrl'
                    }
                }
            })

            .state('app.feedback', {
                url: '/feedback/:event_id',
                views: {
                    'menu-content': {
                        templateUrl: 'templates/feedback.html',
                        controller: 'feedbackCtrl'
                    }
                }
            })

            .state('app.see-feedback', {
                url: '/see-feedback',
                views: {
                    'menu-content': {
                        templateUrl: 'templates/see-feedback.html',
                        controller: 'seefeedbackCtrl'
                    }
                }
            })

            .state('app.get-feedback', {
                url: '/get-feedback/:event_id',
                views: {
                    'menu-content': {
                        templateUrl: 'templates/get-feedback.html',
                        controller: 'getfeedbackCtrl'
                    }
                }
            })

        .state('login', {
            url: '/login',
            templateUrl: 'templates/login-page.html',
            controller: 'loginCtrl'
          
        })

        .state('first-time-user', {
            url: '/first-time-user',
            templateUrl: 'templates/first-time-user.html',
            controller: 'registerCtrl'
          
        })

        $urlRouterProvider.otherwise('/login')
})

.run(function ($ionicPlatform)  {
    $ionicPlatform.ready(function ()    {
        if (window.cordova && window.cordova.plugins.Keyboard)  {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

            // Don't remove this line unless you know what you are doing. It stops the viewport
            // from snapping when text inputs are focused. Ionic handles this internally for
            // a much nicer keyboard experience.
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar)   {
            StatusBar.styleDefault();
        }
    });

    //declare a function whenever a user is change any routes/state of url

});

