angular

.module('attendance-app')

.controller('appCtrl', function ($scope, $ionicPopup, $state, $window, $ionicHistory)	{
	$scope.logout = function ()	{
		localStorage.clear();
    	$ionicHistory.clearCache();
    	$ionicHistory.clearHistory();
    	$state.go('login');
	};
})

.controller('loginCtrl', function ($scope, $ionicPopup, $state, $http, apiEndpoint)	{

	$scope.userData = {};

	console.log($scope.userData.matric_no);

	$scope.login = function ()	{

		if ($scope.userData.matric_no == null || $scope.userData.password == null)	{
			var alertPopup = $ionicPopup.alert({
        			title: 'Login Failed',
        			template: 'Please fill in both blanks.'
      		});

      		return;
      	}

      	if ($scope.userData.matric_no != parseInt($scope.userData.matric_no, 10))	{
      		var alertPopup = $ionicPopup.alert({
        			title: 'Login Failed',
        			template: 'Only numbers are allowed as matric number.'
      		});

      		return;
      	}

		$http.post(apiEndpoint.url + '/login', $scope.userData)
			.then(function (respond)	{
				if (respond.data.success == true)	{
					localStorage.clear();
					localStorage.matric_no = $scope.userData.matric_no;
					$state.go('app.event-list');
				}	
				if	(respond.data.success == false)	{
					var alertPopup = $ionicPopup.alert({
	        			title: 'Login Failed',
	        			template: respond.data.msg
	      			});

	      			return alertPopup;
				}
			},	function (error)	{
				console.log(error);
				var alertPopup = $ionicPopup.alert({
	        			title: 'Login Failed',
	        			template: 'Server is currently not responding.'
	      		});
			});

	};
})

.controller('registerCtrl', function ($scope, $ionicPopup, $state, $http, apiEndpoint)	{

	$scope.userData = {};

	$scope.register = function ()	{

		if ($scope.userData.matric_no == null || $scope.userData.password == null || $scope.userData.repeat == null || $scope.userData.code == null)	{
			var alertPopup = $ionicPopup.alert({
        			title: 'Register Failed',
        			template: 'Please fill in all blanks.'
      		});

      		return;
      	}

      	if ($scope.userData.password.length < 1)	{
      		var alertPopup = $ionicPopup.alert({
        			title: 'Register Failed',
        			template: 'Password must be longer than 8 characters.'
      		});

      		return;
      	}

      	if ($scope.userData.password != $scope.userData.repeat)	{
      		var alertPopup = $ionicPopup.alert({
        			title: 'Register Failed',
        			template: 'Repeated password does not match with password.'
      		});

      		return;
      	}


      	if ($scope.userData.matric_no != parseInt($scope.userData.matric_no, 10))	{
      		var alertPopup = $ionicPopup.alert({
        			title: 'Registeration Failed',
        			template: 'Only numbers are allowed as matric number.'
      		});

      		return;
      	}

		$http.post(apiEndpoint.url + '/register', $scope.userData)
		
		.then(function (respond)	{
			if (respond.data.success == true)	{
				var alertPopup = $ionicPopup.alert({
        			title: 'Registeration Success',
        			template: 'You are an occupant of the college !'
      			});
      			localStorage.matric_no = $scope.userData.matric_no;
				$state.go('app.view-me');
			}

			if (respond.data.success == false)	{
				var alertPopup = $ionicPopup.alert({
        			title: 'Registeration Failed',
        			template: respond.data.msg
      			});
			}
		},	function (error)	{
			var alertPopup = $ionicPopup.alert({
        			title: 'Registeration Failed',
        			template: 'Server is currently not responding.'
      		});
		});

	};
})

.controller('viewmeCtrl', function ($scope, $ionicPopup, $http, apiEndpoint)	{

	$scope.userData = {
		matric_no: 35282,
		session_key: '123qwe'
	};

	$scope.meritsData = {};
	$scope.profileData = {};
	$scope.totalMerit = 0.0;
	$scope.totalEvent = 0;

	$scope.$on('$ionicView.afterEnter', function ()	{

  		$http.get(apiEndpoint.url + '/view-me/' + localStorage.matric_no)
		.then(function (respond)	{
			if (respond.data.success == true)	{
				$scope.meritsData = respond.data.result;
				$scope.profileData = respond.data.profile;
				angular.forEach($scope.meritsData, function (value,index)	{
                $scope.totalMerit += value.merit_point;
                $scope.totalEvent++;
                console.log('lala');
        });
			}	
		},	function (error)	{
			var alertPopup = $ionicPopup.alert({
	    			title: 'Connecting Failed',
	    			template: 'Server is currently not responding.'
	  		});
		});

		angular.forEach($scope.meritsData, function (value,index)	{
                $scope.totalMerit += value.merit_point;
                $scope.totalEvent++;
                console.log('lala');
        });

	});
})

.controller('eventlistCtrl', function ($scope, $ionicPopup, $http, apiEndpoint, $filter)	{

	$scope.eventsData = [];

	$scope.$on('$ionicView.afterEnter', function ()	{

  		$http.post(apiEndpoint.url + '/event-list', $scope.userData)
		.then(function (respond)	{
			if (respond.data.success == true)	{
				$scope.eventsData = JSON.parse(JSON.stringify(respond.data.result));
				for (var i = 0; i < $scope.eventsData.length; i++)  {
                	$scope.eventsData[i].edate = $filter('date')($scope.eventsData[i].edate, 'dd/MM/yyyy');
            	}
			}	
		},	function (error)	{
			var alertPopup = $ionicPopup.alert({
	    			title: 'Connecting Failed',
	    			template: 'Server is currently not responding.'
	  		});
		});
	});
})

.controller('eventstatusCtrl', function ($scope, $ionicPopup, $http, apiEndpoint, $filter, $window)	{

	$scope.eventsData = [];

	$scope.$on('$ionicView.afterEnter', function ()	{

  		$http.get(apiEndpoint.url + '/event-status/' + localStorage.matric_no)
		.then(function (respond)	{
			if (respond.data.success == true)	{
				$scope.eventsData = JSON.parse(JSON.stringify(respond.data.result));
				for (var i = 0; i < $scope.eventsData.length; i++)  {
                	$scope.eventsData[i].edate = $filter('date')($scope.eventsData[i].edate, 'dd/MM/yyyy');
            	}
			}	
		},	function (error)	{
			var alertPopup = $ionicPopup.alert({
	    			title: 'Connecting Failed',
	    			template: 'Server is currently not responding.'
	  		});
		});
	});

	$scope.startOpening = function (event_id)	{

		$http.get(apiEndpoint.url + '/start-open/' + event_id)
			.then(function (respond)	{
				if (respond.data.success == true)	{
					var alertPopup = $ionicPopup.alert({
	        			title: 'Succesful !',
	        			template: respond.data.msg
	      			});
	      			$scope.eventsData = $filter('filter')($scope.eventsData, function(value, index) { 
                        return value.event_id !== event_id; 
                    });
                    $window.location.reload();
				}
			},	function (error)	{
				console.log(error);
				var alertPopup = $ionicPopup.alert({
	        			title: 'Connecting Failed',
	        			template: 'Server is currently not responding.'
	      		});
			});

	};

	$scope.closeOpening = function (event_id)	{

		$http.get(apiEndpoint.url + '/close-open/' + event_id)
			.then(function (respond)	{
				if (respond.data.success == true)	{
					var alertPopup = $ionicPopup.alert({
	        			title: 'Succesful !',
	        			template: respond.data.msg
	      			});
	      			$scope.eventsData = $filter('filter')($scope.eventsData, function(value, index) { 
                        return value.event_id !== event_id; 
                    });
                    $window.location.reload();
				}
			},	function (error)	{
				console.log(error);
				var alertPopup = $ionicPopup.alert({
	        			title: 'Connecting Failed',
	        			template: 'Server is currently not responding.'
	      		});
			});

	};

	$scope.startClosing = function (event_id)	{

		$http.get(apiEndpoint.url + '/start-close/' + event_id)
			.then(function (respond)	{
				if (respond.data.success == true)	{
					var alertPopup = $ionicPopup.alert({
	        			title: 'Succesful !',
	        			template: respond.data.msg
	      			});
	      			$scope.eventsData = $filter('filter')($scope.eventsData, function(value, index) { 
                        return value.event_id !== event_id; 
                    });
                    $window.location.reload();
				}
			},	function (error)	{
				console.log(error);
				var alertPopup = $ionicPopup.alert({
	        			title: 'Connecting Failed',
	        			template: 'Server is currently not responding.'
	      		});
			});

	};

	$scope.closeClosing = function (event_id)	{

		$http.delete(apiEndpoint.url + '/close-close/' + event_id)
			.then(function (respond)	{
				if (respond.data.success == true)	{
					var alertPopup = $ionicPopup.alert({
	        			title: 'Succesful !',
	        			template: respond.data.msg
	      			});
	      			$scope.eventsData = $filter('filter')($scope.eventsData, function(value, index) { 
                        return value.event_id !== event_id; 
                    });
                    $window.location.reload();
				}
			},	function (error)	{
				console.log(error);
				var alertPopup = $ionicPopup.alert({
	        			title: 'Connecting Failed',
	        			template: 'Server is currently not responding.'
	      		});
			});

	};
})

.controller('eventopeningCtrl', function ($scope, $ionicPopup, $http, apiEndpoint, $cordovaGeolocation, $filter)	{

	$scope.eventsData = [];
	$scope.formData = {};

	var posOptions = { timeout: 10000, enableHighAccuracy: true};

	$scope.$on('$ionicView.afterEnter', function ()	{

  		$http.get(apiEndpoint.url + '/event-opening/' + localStorage.matric_no)
		.then(function (respond)	{
			if (respond.data.success == true)	{
				$scope.eventsData = JSON.parse(JSON.stringify(respond.data.result));
				for (var i = 0; i < $scope.eventsData.length; i++)  {
                	$scope.eventsData[i].edate = $filter('date')($scope.eventsData[i].edate, 'dd/MM/yyyy');
            	}
			}	
		},	function (error)	{
			var alertPopup = $ionicPopup.alert({
	    			title: 'Connecting Failed',
	    			template: 'Server is currently not responding.'
	  		});
		});
	});

	$scope.sendLocation = function (event_id, ename)	{
		$cordovaGeolocation
	        .getCurrentPosition(posOptions)
	        .then(function (position)   {
	            $scope.formData.latitude = position.coords.latitude;
	            $scope.formData.longitude = position.coords.longitude;
	            $scope.formData.event_id = event_id;
	            $scope.formData.ename = ename;

				$http.post(apiEndpoint.url + '/opening-attendance/' + localStorage.matric_no, $scope.formData)
					.then(function (respond)	{
						if (respond.data.success == true)	{
							var alertPopup = $ionicPopup.alert({
		        			title: 'Alert',
		        			template: respond.data.msg
	      			});
						}	
					},	function (error)	{
						console.log(error);
						var alertPopup = $ionicPopup.alert({
				    			title: 'Connecting Failed',
				    			template: 'Server is currently not responding.'
				  		});
					});

	        },	function (error) {
	        		console.log(error);
    		});
	};
})

.controller('eventclosingCtrl', function ($scope, $ionicPopup, $http, apiEndpoint, $cordovaGeolocation, $filter)	{

	$scope.eventsData = {};
	$scope.formData = {};

	var posOptions = { timeout: 10000, enableHighAccuracy: true};

	$scope.$on('$ionicView.afterEnter', function ()	{

  		$http.get(apiEndpoint.url + '/event-closing/' + localStorage.matric_no)
		.then(function (respond)	{
			if (respond.data.success == true)	{
				$scope.eventsData = JSON.parse(JSON.stringify(respond.data.result));
				for (var i = 0; i < $scope.eventsData.length; i++)  {
                	$scope.eventsData[i].edate = $filter('date')($scope.eventsData[i].edate, 'dd/MM/yyyy');
            	}
			}	
		},	function (error)	{
			var alertPopup = $ionicPopup.alert({
	    			title: 'Connecting Failed',
	    			template: 'Server is currently not responding.'
	  		});
		});
	});

	$scope.sendLocation = function (event_id, ename)	{
		$cordovaGeolocation
	        .getCurrentPosition(posOptions)
	        .then(function (position)   {
	            $scope.formData.latitude = position.coords.latitude;
	            $scope.formData.longitude = position.coords.longitude;
	            $scope.formData.event_id = event_id;
	            $scope.formData.ename = ename;

				$http.post(apiEndpoint.url + '/closing-attendance/' + localStorage.matric_no, $scope.formData)
					.then(function (respond)	{
						if (respond.data.success == true)	{
							var alertPopup = $ionicPopup.alert({
		        			title: 'Alert',
		        			template: respond.data.msg
	      			});
						}	
					},	function (error)	{
						console.log(error);
						var alertPopup = $ionicPopup.alert({
				    			title: 'Connecting Failed',
				    			template: 'Server is currently not responding.'
				  		});
					});

	        },	function (error) {
	        		console.log(error);
    		});
	};
})

.controller('eventfeedbackCtrl', function ($scope, $ionicPopup, $http, apiEndpoint, $filter)	{

	$scope.eventsData = {};

	$scope.$on('$ionicView.afterEnter', function ()	{

  		$http.get(apiEndpoint.url + '/event-feedback/' + localStorage.matric_no)
		.then(function (respond)	{
			if (respond.data.success == true)	{
				$scope.eventsData = JSON.parse(JSON.stringify(respond.data.result));
				for (var i = 0; i < $scope.eventsData.length; i++)  {
                	$scope.eventsData[i].edate = $filter('date')($scope.eventsData[i].edate, 'dd/MM/yyyy');
            	}
			}	
		},	function (error)	{
			var alertPopup = $ionicPopup.alert({
	    			title: 'Connecting Failed',
	    			template: 'Server is currently not responding.'
	  		});
		});
	});

})

.controller('feedbackCtrl', function ($scope, $ionicPopup, $http, apiEndpoint, $state, $stateParams, $ionicHistory)	{

	$scope.form = {
		matric_no: localStorage.matric_no
	};

	$scope.goBack = function ()	{
   		//$state.go('app.event-feedback');
   		$ionicHistory.goBack();
	}

	$scope.sendFeedback = function ()	{
		if ($scope.form.feedback == "" || $scope.form.feedback == null)	{
			var alertPopup = $ionicPopup.alert({
				title: 'Failed',
				template: 'Please fill in the feedback form.'
			})
			return alertPopup;
		}

		$http.post(apiEndpoint.url + '/event-sendfeedback/' + $stateParams.event_id, $scope.form)
		.then(function (respond)	{
			if (respond.data.success == true)	{
				var alertPopup = $ionicPopup.alert({
	    			title: 'Feedback Success',
	    			template: 'Feedback has been sent.'
	  			});
	  			$ionicHistory.goBack();
			}

			if (respond.data.success == false)	{
				var alertPopup = $ionicPopup.alert({
	    			title: 'Success',
	    			template: respond.data.msg
	  			});
			}	
		},	function (error)	{
			var alertPopup = $ionicPopup.alert({
	    			title: 'Connecting Failed',
	    			template: 'Server is currently not responding.'
	  		});
		});
	}

})

.controller('seefeedbackCtrl', function ($scope, $ionicPopup, $http, apiEndpoint, $stateParams, $filter)	{

	$scope.eventsData = {};

	$scope.$on('$ionicView.afterEnter', function ()	{

  		$http.get(apiEndpoint.url + '/event-seefeedback/' + localStorage.matric_no)
		.then(function (respond)	{
			if (respond.data.success == true)	{
				$scope.eventsData = JSON.parse(JSON.stringify(respond.data.result));
				for (var i = 0; i < $scope.eventsData.length; i++)  {
                	$scope.eventsData[i].edate = $filter('date')($scope.eventsData[i].edate, 'dd/MM/yyyy');
            	}
			}	
		},	function (error)	{
			var alertPopup = $ionicPopup.alert({
	    			title: 'Connecting Failed',
	    			template: 'Server is currently not responding.'
	  		});
		});
	});

})

.controller('getfeedbackCtrl', function ($scope, $ionicPopup, $http, apiEndpoint, $stateParams, $state, $ionicHistory)	{

	$scope.feedbackData = {};

	$scope.goBack = function ()	{
   		//$state.go('app.see-feedback');
   		$ionicHistory.goBack();
	}

	$scope.$on('$ionicView.afterEnter', function ()	{

  		$http.get(apiEndpoint.url + '/event-getfeedback/' + $stateParams.event_id)
		.then(function (respond)	{
			if (respond.data.success == true)	{
				$scope.feedbackData = JSON.parse(JSON.stringify(respond.data.result));
			}	
		},	function (error)	{
			var alertPopup = $ionicPopup.alert({
	    			title: 'Connecting Failed',
	    			template: 'Server is currently not responding.'
	  		});
		});
	});

});

