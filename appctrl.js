var myApp = angular.module('myApp',['ngDragDrop', 'ui.bootstrap']);

myApp.factory('myService', ['$http', function($http) {
//      $http.defaults.useXDomain = true;
 //     delete $http.defaults.headers.common["X-Requested-With"];
      $http.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
      $http.defaults.headers.common["Accept"] = "application/json";
      $http.defaults.headers.common["Content-Type"] = "application/json";
//      $http.defaults.headers.common['X-User-Agent'] = "DSEUI";
//      $http.defaults.headers.common['Cache-Control'] = "no-cache";
//	  application/json; charset=utf-8
        return {
            apiPostRequest: function (data) {
                console.log('POSTREQUEST');
                var resp = $http.post('http://localhost:9200/optysor/opportunityobj/_search', data);
                return resp;
            },
			apiDeleteRequest: function () {
				console.log('BULKDELETE');
                var resp = $http.post('http://localhost:9200/optysor/opportunityobj/_bulk', data);
				return resp;
            },
			apiPostCreateRoom: function (data) {
//				$http.defaults.headers.common.Authorization = 'Bearer ' +'M2Y2MzY4ODQtYzE0Zi00NTFmLWEwZGYtNDUzN2IxMTJhYmU4Nzc2N2EzNGItMDZi';
				var resp = $http.post('http://localhost:8080/JAXRS-HelloWorld/rest/helloWorldREST/products',data);
				return resp;
			
			},
			apiDeleteRoom: function (roomId) {
				$http.defaults.headers.common.Authorization = 'Bearer ' +'';
				var resp = $http.delete('https://api.ciscospark.com/v1/rooms/'+roomId);
				return resp;
			},
			apiAddPeople: function (data) {
				$http.defaults.headers.common.Authorization = 'Bearer ' +'';
				var resp = $http.post('https://api.ciscospark.com/v1/memberships',data);
				return resp;
			}
			
        }
}]);


myApp.directive('myDirective', function() {
	return {
			restrict:'E',
			compile:function(element) {
					console.log("Inside Directive123");
					}
			}
   });

myApp.directive('whenScrolled', function() {
    return function(scope, elm, attr) {
        var raw = elm[0];

        var funCheckBounds = function(evt) {
            var rectObject = raw.getBoundingClientRect();
			console.log("rectObject.bottom : "+rectObject.bottom);
			console.log("window.innerHeight : "+window.innerHeight);
            if (rectObject.bottom <= window.innerHeight) {
				console.log("event inside if");
                scope.$apply(attr.whenScrolled);
            }

        };
        
        angular.element(window).bind('scroll load', funCheckBounds);
        
        
    };
});

myApp.controller('ModalInstanceCtrl', function ($scope, $modalInstance) {
        $scope.ok = function () {
          $modalInstance.close();
        };
        $scope.cancel = function () {
          $modalInstance.dismiss('cancel');
        };
      });


myApp.controller('MyCtrl',['myService','$scope','$http', '$timeout', '$q', '$modal', function(myService,$scope,$http,$timeout,$q, $modal) {




		$scope.shareIndexUser;

		$scope.roomId;

		$scope.open = function() {
		  $scope.showModal = true;
		};


		$scope.cartItems =[];

		$scope.clearCart = function() {
				
				$scope.cartItems = [];
				
		
		};

        $scope.getCartData = function () {
				
				if($scope.itemsincart.length>0)
				{
					var idCartList;//="["+$scope.itemsincart.toString()+"]";
					for(var i=0;i<$scope.itemsincart.length;i++)
					{
						if(i==0)
						idCartList = '"'+$scope.itemsincart[i]+'"';
						else{
							idCartList=idCartList+',';
							idCartList = idCartList+ '"'+$scope.itemsincart[i]+'"';
						}
						

					}

					var finalidCartList = '['+idCartList+']';
					
					console.log("idCartList : "+finalidCartList);
					var cartDataQuery = '{'+
													  '"query" : {'+
														'"filtered" : {'+
														  '"filter" : {'+
															'"terms" : {'+
															  '"_id" : '+finalidCartList+
															'}'+
														  '}'+
														'}'+
													  '}'+
													'}';
						
						console.log("cartDataQuery : "+cartDataQuery);

						$http.post('http://localhost:9200/optysor/opportunityobj/_search',cartDataQuery)
							.success(function (data) {
								var dataj=JSON.parse(JSON.stringify(data));

								var datarequired=dataj.hits;
		//						$scope.totalRecords=datarequired.total;
								var postdatatemp = [];
								console.log("Resultset size: "+datarequired.hits.length);
								var resultsetlength=datarequired.hits.length;
								for(var i=0;i<resultsetlength;i++)
								{
									$scope.cartItems.push(datarequired.hits[i]);
								}
								console.log("cartItems :"+$scope.cartItems);
								
					})
					.error(function (data) {
							console.log("HERE5");
							console.log("data is"+JSON.stringify(data));
							$scope.ResponseDetails = "Data: ";
					});
				}
				else
				{
					console.log("No Items in Cart");
				}

		};


		$scope.openRoom = function() {
		    var data = JSON.stringify({
										"title": "IB-United_Group"
									});

			myService.apiPostCreateRoom(data).success(function (resp) {
					console.log("resp is "+JSON.stringify(resp));
					$scope.rooomId = resp.id;
					console.log("$scope.roomId : "+$scope.roomId);
/*
				{
					"id": "Y2lzY29zcGFyazovL3VzL1JPT00vYWQ3NWYyZjAtMWQ3Yi0xMWU2LTgwMWEtMWI1Nzk2MjQzY2U3",
					"title": "IB-United_Group",
					"type": "group",
					"isLocked": false,
					"lastActivity": "2016-05-19T04:39:30.975Z",
					"created": "2016-05-19T04:39:30.975Z"
				}
*/
			}).error(function (resp){
					console.log("Error in creating room :"+resp);
			})
					
		
		};

		$scope.ok = function() {

			  var shareIndexUsers = $scope.shareIndexUser.split(',');
			  console.log('shareIndexUsers*****'+shareIndexUsers);
   			  for(var i=0;i<shareIndexUsers.length;i++)
			  {
					console.log('shareIndexUsers[i]*****'+shareIndexUsers[i]);
					var logQuery = JSON.stringify({
							"userid" : shareIndexUsers[i],
							"update_comments" : 0,
							"marked_for_delete" : 0,
							"deleted" : 0
						});
					$scope.logCollab(logQuery);
				
			  }
			  $scope.showModal = false;

		};

		$scope.cancel = function() {
		  $scope.showModal = false;
		};

        $scope.list1 = {title: 'Drag and Drop'};
        $scope.list2 = {};
        $scope.beforeDrop = function() {
          var modalInstance = $modal.open({
            templateUrl: 'myModalContent.html',
            controller: 'ModalInstanceCtrl'
          });
          
          return modalInstance.result;
        };
      
			$scope.birthDate = '2013-07-23';
	        $scope.dateOptions = {};

			var today = new Date();
			today.setDate(today.getDate() + 7);

			$scope.today=today;

			$scope.addToCart = function(){
					console.log("added to cart");
					var incart=$scope.selection
					$scope.itemsincart=incart;
					console.log("items in cart as : "+$scope.itemsincart);
					$scope.selection = [];
			};

			$scope.convertToOpty = function(){

					var convertToOptyQuery;
					for(var i=0;i<$scope.itemsincart.length;i++)
					{
						if(i==0)
						{
								console.log("i==0");
								convertToOptyQuery=JSON.stringify(
										{ "update" : {"_id" : $scope.itemsincart[i], "_type" : "opportunityobj", "_index" : "optysor"}}
										);
								convertToOptyQuery=convertToOptyQuery+"\n";
								convertToOptyQuery=convertToOptyQuery+JSON.stringify(
										{ "doc" : {"cloud_deal" : "Y"}}
										);
							
						}
						else
						{
								convertToOptyQuery=convertToOptyQuery+"\n"+JSON.stringify(
										{ "update" : {"_id" : $scope.itemsincart[i], "_type" : "opportunityobj", "_index" : "optysor"}}
										);
								convertToOptyQuery=convertToOptyQuery+"\n";
								convertToOptyQuery=convertToOptyQuery+JSON.stringify(
										{ "doc" : {"cloud_deal" : "Y"}}
										);
						}
					}
					console.log("convertToOptyQuery final: "+convertToOptyQuery);

					postdata=convertToOptyQuery+"\n";
					console.log("postdata : "+convertToOptyQuery);

					$http.post('http://localhost:9200/optysor/opportunityobj/_bulk',postdata)
					.success(function (data) {
							console.log("HERE4");
							console.log("data is success"+JSON.stringify(data));
							var dataj=JSON.parse(JSON.stringify(data));
							$scope.deleteMessage= $scope.itemsincart.length + " items converted to Opportunity";
							$("#showMessage").show().delay(2000).fadeOut();
							var logQuery = JSON.stringify({
											"userid" : loginUserId,
											"update_comments" : 0,
											"marked_for_delete" : 0,
											"deleted" : 0
										});
//							$scope.logCollab(logQuery);
							$scope.logChangeOptyData($scope.itemsincart);
							
							$scope.selection = [];
							$scope.itemsincart = [];
		/*					postdata = JSON.stringify({
											"_source" : ["opty_id", "opty_name", "complex_deal_flag", "oppty_type_code", "sales_path_cd", "opty_theater_name", "create_date", "sales_terr_name", "territory_id", "iso_currency_cd", "sales_hierarchy_type_cd", "complex_deal_flag", "srvc_provider_internal_it_flag", "cloud_deal" ],
											"query": {"match_all": {}},"aggs": {
															"group_by_currency": {
																 "terms": {
																	"field": "iso_currency_cd"
																 }
															  },
															  "group_by_oppty_type_code": {
																  "terms": {
																	  "field": "oppty_type_code"
																  }
															  },
															  "group_by_opty_theater_name": {
																  "terms": {
																	  "field": "opty_theater_name"
																  }
															  }
														  }
										});
		*/					
							postdata = JSON.stringify({
											"_source" : ["opty_id", "opty_name", "complex_deal_flag", "oppty_type_code", "sales_path_cd", "opty_theater_name", "create_date", "sales_terr_name", "territory_id", "iso_currency_cd", "sales_hierarchy_type_cd", "complex_deal_flag", "srvc_provider_internal_it_flag", "cloud_deal" ],
											"query": {"match_all": {}},"aggs": {
															"group_by_complex_deal_flag": {
																 "terms": {
																	"field": "complex_deal_flag"
																 }
															  },
															  "group_by_srvc_provider_internal_it_flag": {
																  "terms": {
																	  "field": "srvc_provider_internal_it_flag"
																  }
															  }
														  }
										});
							
							resultSize=100;
							fromCounter=0;
							toCounter=99;
							$scope.PostDataResponse =[];
							$scope.searchString="";
							$scope.SendData(fromCounter,toCounter,resultSize,postdata);


							
		//					$timeout(function(){$scope.showDataAction();}, 3000);
							
					})
					.error(function (data) {
							console.log("HERE5");
							console.log("data is"+JSON.stringify(data));
							$scope.ResponseDetails = "Data: ";
					});
			
			};

			$scope.deleteIndex = function(){
				alert("Index deleted");
			};



			$scope.multifieldSearch = function(row){
					if(row._source.sales_terr_name==null)
						row._source.sales_terr_name='-999';
					return (
						angular.lowercase(row._source.opty_name).indexOf(angular.lowercase($scope.optySearch) || '') !==-1 &&
						angular.lowercase(row._source.opty_theater_name).indexOf(angular.lowercase($scope.optyTheaterName) || '') !==-1 &&
						angular.lowercase(row._source.sales_terr_name).indexOf(angular.lowercase($scope.salesTerrName) || '') !==-1
						)
			}

			$scope.showSideBar=false;
			$scope.showChangeStatsToggle=true;
			$scope.showChangeStats = [];
			$scope.showChangeStats[0] = "Click OpptyName to track changes";
			$scope.getTheClass = function() {
			    return 'col-lg-12';
			}

			$scope.getChangeStats = function(optyId){
							console.log("OptyId : "+optyId);
							var getChangeStatsQuery = JSON.stringify({
															"query": 
																{"term": 
																	{"optyid.raw" : {"value":optyId}}}
													});
							console.log("getChangeStatsQuery"+getChangeStatsQuery);
							$http.post('http://localhost:9200/optysor/changeoptyhistory/_search',getChangeStatsQuery)
							.success(function (data) {
									var dataj = JSON.parse(JSON.stringify(data));
									console.log("Before log insert"+dataj);

									if(dataj.hits.hits.length>0)
									{
										$scope.showChangeStats = [];
										for(var i=0;i<dataj.hits.hits.length;i++)
										{		
												console.log("ul populate : "+data.hits.hits[i]._source.userid+" updated this record on "+data.hits.hits[i]._source.actiondate);
												$scope.showChangeStats.push(data.hits.hits[i]._source.userid+" updated this record on "+data.hits.hits[i]._source.actiondate);
										}
										console.log("$scope.showChangeStats"+$scope.showChangeStats);
									}
									else
									{
										$scope.showChangeStats = [];
										$scope.showChangeStats[0] = "No changes to this record";
										console.log("$scope.showChangeStats"+$scope.showChangeStats);
									}

							})
							.error(function (data) {
									console.log("error log insert");
									console.log("error is"+JSON.stringify(data));
							});
			
			};

			$scope.getCollabData = function(){
							
							var getCollabDataQuery = JSON.stringify({
									"_source" : ["opty_id", "opty_name", "complex_deal_flag", "oppty_type_code", "sales_path_cd", "opty_theater_name", "create_date", "sales_terr_name", "territory_id", "iso_currency_cd", "sales_hierarchy_type_cd", "complex_deal_flag", "srvc_provider_internal_it_flag", "cloud_deal" ],
									"query": {"match_all": {}}, "size": 0, 
									"aggs":{
										"group_by_userid":{
											"terms":{
												"field":"userid"
											}, 
											"aggs" : {
												"group_by_updated":{
													"sum":{
														"field":"update_comments"
													}
												},
												"group_by_marked":{
													"sum":{
														"field":"marked_for_delete"
													}
												},
												"group_by_deleted":{
													"sum":{
														"field":"deleted"
													}
												}
											}
										}
									}
								});
							$http.post('http://localhost:9200/optysor/collaboration/_search',getCollabDataQuery)
							.success(function (data) {
									console.log("Before log insert");

									$scope.collabData = [];

									for(var i=0;i<data.aggregations.group_by_userid.buckets.length;i++)
									{
										$scope.collabData.push(data.aggregations.group_by_userid.buckets[i]);
									}

							})
							.error(function (data) {
									console.log("error log insert");
									console.log("error is"+JSON.stringify(data));
							});
						
			
			};

			var param = location.search.substr(location.search.indexOf('=')+1);
			console.log("param : "+param);
			if (param)
				document.getElementById("loginUserId").innerHTML = param;
			var loginUserId=param;
			console.log("loginUserId :"+loginUserId);

			$scope.logCollab = function(postdata){

							$http.post('http://localhost:9200/optysor/collaboration/',postdata)
							.success(function (data) {
									console.log("Log inserted");
							})
							.error(function (data) {
									console.log("error log insert");
									console.log("error is"+JSON.stringify(data));
							});
				
			};

			$scope.logChangeOptyData = function(selectionArray){

							var changeOptyDataQuery;
							var d = new Date();
							for(var i=0;i<selectionArray.length;i++)
							{
								if(i==0)
								{
									changeOptyDataQuery=JSON.stringify({ 
											"index" : {"_index" : "optysor", "_type" : "changeoptyhistory"}
										})+"\n";
									changeOptyDataQuery=changeOptyDataQuery+ JSON.stringify({
											"userid" : loginUserId,
											"optyid" : selectionArray[i],
											"actiondate" : d
										})+"\n";
								}
								else
								{
									changeOptyDataQuery=changeOptyDataQuery+JSON.stringify(
										{ "index" : {"_index" : "optysor", "_type" : "changeoptyhistory"}}
									)+"\n";
									changeOptyDataQuery=changeOptyDataQuery+ JSON.stringify({
											"userid" : loginUserId,
											"optyid" : selectionArray[i],
											"actiondate" : d
									})+"\n";
								}
							}
							console.log("changeoptylog final: "+changeOptyDataQuery);


							$http.post('http://localhost:9200/optysor/changeoptyhistory/_bulk',changeOptyDataQuery)
							.success(function (data) {
									console.log("Opty change log inserted");
							})
							.error(function (data) {
									console.log("error opty change insert");
									console.log("error is"+JSON.stringify(data));
							});
				
			};



			$scope.updateCommRecords = new Set();
			$scope.updateComm = function(item){

				$scope.updateCommRecords.add(item);
				console.log("onchange item : "+item);
				console.log("onchange : "+$scope.updateCommRecords.size);
					
			};



			$scope.showtable=true;
		    $scope.name = 'Superhero'; 
			console.log("HERE");
			var resultSize=100;
			var fromCounter=0;
			var toCounter=99;
			$scope.PostDataResponse =[];
			var postdate;
            $scope.SendData = function (fromCounter,toCounter,resultSize,postdata) {

			console.log("fromCounter:"+fromCounter+" toCounter:"+toCounter+" resultSize:"+resultSize);

			console.log("HERE3"+'http://localhost:9200/optysor/opportunityobj/_search?size='+resultSize+'&from='+fromCounter+'&to='+toCounter);
            $http.post('http://localhost:9200/optysor/opportunityobj/_search?size='+resultSize+'&from='+fromCounter+'&to='+toCounter,postdata)
            .success(function (data) {
					console.log("HERE4");
//					console.log("data is success"+JSON.stringify(data));
					var dataj=JSON.parse(JSON.stringify(data));

//get aggregations
					var resultagg=dataj.aggregations;

					$scope.resultAggOptyTypeCode=[];
					for(var i=0;i<resultagg.group_by_complex_deal_flag.buckets.length;i++)
					{
						if(resultagg.group_by_complex_deal_flag.buckets[i].key=="y")
						{
							$scope.resultAggOptyTypeCode.push(resultagg.group_by_complex_deal_flag.buckets[i]);
						}
					}
//					resultAggOptyTypeCode=resultagg.group_by_oppty_type_code.buckets;
					console.log("resultAggOptyTypeCode :"+$scope.resultAggOptyTypeCode.length);

					$scope.resultAggOptyTheaterName=[];
					for(var i=0;i<resultagg.group_by_srvc_provider_internal_it_flag.buckets.length;i++)
					{
						if(resultagg.group_by_srvc_provider_internal_it_flag.buckets[i].key=="y")
						{
							$scope.resultAggOptyTheaterName.push(resultagg.group_by_srvc_provider_internal_it_flag.buckets[i]);
						}
					}
//					resultAggOptyTheaterName=resultagg.group_by_opty_theater_name.buckets;
					console.log("resultAggOptyTheaterName :"+$scope.resultAggOptyTheaterName.length);

/*					$scope.resultAggIsoCurrencyCode=[];
					for(var i=0;i<resultagg.group_by_currency.buckets.length;i++)
					{
						$scope.resultAggIsoCurrencyCode.push(resultagg.group_by_currency.buckets[i]);
					}
*/
//					resultAggIsoCurrencyCode=resultagg.group_by_currency.buckets;
/*					console.log("resultAggIsoCurrencyCode :"+$scope.resultAggIsoCurrencyCode.length);
*/
					var datarequired=dataj.hits;
					$scope.totalRecords=datarequired.total;
					var postdatatemp = [];
//					console.log("dataj "+(dataj.hits.hits[0]._source.oppty_type_code));
					console.log("Resultset size: "+datarequired.hits.length);
					var resultsetlength=datarequired.hits.length;
					for(var i=0;i<resultsetlength;i++)
					{
						$scope.PostDataResponse.push(datarequired.hits[i]);
					}
					var xlsData = [];
					postdatatemp.push('Id');
					postdatatemp.push('Opty Name');
					postdatatemp.push('Opty Type Code');
					postdatatemp.push('Opty Id');
					postdatatemp.push('Sales Path Cd');
					postdatatemp.push('Opty Theater Name');
					postdatatemp.push('Create Date');
					postdatatemp.push('Sales Terr Name');
					postdatatemp.push('ISO Currency Code');
					postdatatemp.push('Comments');
					xlsData.push(postdatatemp);

					for(var i=0;i<resultsetlength;i++)
					{
						postdatatemp = [];
						postdatatemp.push(datarequired.hits[i]._id);
						postdatatemp.push(datarequired.hits[i]._source.opty_name);
						postdatatemp.push(datarequired.hits[i]._source.oppty_type_code);
						postdatatemp.push(datarequired.hits[i]._source.opty_id);
						postdatatemp.push(datarequired.hits[i]._source.sales_path_cd);
						postdatatemp.push(datarequired.hits[i]._source.opty_theater_name);
						postdatatemp.push(datarequired.hits[i]._source.create_date);
						postdatatemp.push(datarequired.hits[i]._source.sales_terr_name);
						postdatatemp.push(datarequired.hits[i]._source.iso_currency_cd);
						postdatatemp.push(datarequired.hits[i]._source.sales_hierarchy_type_cd);
						xlsData.push(postdatatemp);
					}
					
					$scope.d=xlsData;
//					console.log("PostDataResponse :"+$scope.PostDataResponse);
            })
            .error(function (data) {
					console.log("HERE5");
					console.log("data is"+JSON.stringify(data));
	                $scope.ResponseDetails = "Data: ";
            });
        };

		$scope.items = [];
    
//	    var counter = 0;
		$scope.counter=10;
	    $scope.loadMore = function() {
			console.log("inside load more");
			fromCounter=toCounter+1;
			toCounter=toCounter+50;
			resultSize=50;
			console.log("postData"+postdata);
			$scope.SendData(fromCounter,toCounter,resultSize,postdata);
		
		};
  
//		$scope.loadMore();
                       
	    $scope.showDataAction = function() {
			if($scope.searchString == undefined || $scope.searchString.length<1)
			{	
				console.log("$scope.searchString is undefined");
			   $scope.getCollabData();
/*	           postdata = JSON.stringify({
									"_source" : ["opty_id", "opty_name", "complex_deal_flag", "oppty_type_code", "sales_path_cd", "opty_theater_name", "create_date", "sales_terr_name", "territory_id", "iso_currency_cd", "sales_hierarchy_type_cd", "complex_deal_flag", "srvc_provider_internal_it_flag", "cloud_deal" ],
									"query": {"match_all": {}},"aggs": {
													"group_by_currency": {
														 "terms": {
															"field": "iso_currency_cd"
														 }
													  },
													  "group_by_oppty_type_code": {
														  "terms": {
															  "field": "oppty_type_code"
														  }
													  },
													  "group_by_opty_theater_name": {
														  "terms": {
															  "field": "opty_theater_name"
														  }
													  }
												  }
								});
*/
				postdata = JSON.stringify({
									"_source" : ["opty_id", "opty_name", "complex_deal_flag", "oppty_type_code", "sales_path_cd", "opty_theater_name", "create_date", "sales_terr_name", "territory_id", "iso_currency_cd", "sales_hierarchy_type_cd", "complex_deal_flag", "srvc_provider_internal_it_flag", "cloud_deal" ],
									"query": {"match_all": {}},"aggs": {
												"group_by_complex_deal_flag": {
													 "terms": {
														"field": "complex_deal_flag"
													 }
												  },
												  "group_by_srvc_provider_internal_it_flag": {
													  "terms": {
														  "field": "srvc_provider_internal_it_flag"
													  }
												  }
											  }
								});

			};
				console.log("postData"+postdata);
			
		  		$scope.SendData(fromCounter,toCounter,resultSize,postdata);
		};

		$scope.showDataAction();

		

	    $scope.globalSearch = function() {
			if($scope.searchString == undefined || $scope.searchString.length<=1)
			{	
				console.log("$scope.searchString is undefined");
/*	            postdata = JSON.stringify({
									"_source" : ["opty_id", "opty_name", "complex_deal_flag", "oppty_type_code", "sales_path_cd", "opty_theater_name", "create_date", "sales_terr_name", "territory_id", "iso_currency_cd", "sales_hierarchy_type_cd", "complex_deal_flag", "srvc_provider_internal_it_flag", "cloud_deal" ],
									"query": {"match_all": {}},"aggs": {
													"group_by_currency": {
														 "terms": {
															"field": "iso_currency_cd"
														 }
													  },
													  "group_by_oppty_type_code": {
														  "terms": {
															  "field": "oppty_type_code"
														  }
													  },
													  "group_by_opty_theater_name": {
														  "terms": {
															  "field": "opty_theater_name"
														  }
													  }
												  }
								});
*/
				postdata = JSON.stringify({
									"_source" : ["opty_id", "opty_name", "complex_deal_flag", "oppty_type_code", "sales_path_cd", "opty_theater_name", "create_date", "sales_terr_name", "territory_id", "iso_currency_cd", "sales_hierarchy_type_cd", "complex_deal_flag", "srvc_provider_internal_it_flag", "cloud_deal" ],
									"query": {"match_all": {}},"aggs": {
												"group_by_complex_deal_flag": {
													 "terms": {
														"field": "complex_deal_flag"
													 }
												  },
												  "group_by_srvc_provider_internal_it_flag": {
													  "terms": {
														  "field": "srvc_provider_internal_it_flag"
													  }
												  }
											  }
								});
			};

				$scope.PostDataResponse =[];
				resultSize=100;
				fromCounter=0;
				toCounter=99;
				q = $scope.searchString;
				if (q.length > 1) {
/*						postdata = JSON.stringify({
											"_source" : ["opty_id", "opty_name", "complex_deal_flag", "oppty_type_code", "sales_path_cd", "opty_theater_name", "create_date", "sales_terr_name", "territory_id", "iso_currency_cd", "sales_hierarchy_type_cd", "complex_deal_flag", "srvc_provider_internal_it_flag", "cloud_deal" ],
											"query": {
												"multi_match": {
													"fields": ["opty_name","oppty_type_code","opty_theater_name","opty_theater_name"],
													"query": q,
													"type": "cross_fields"
												}
											},"aggs": {
												"group_by_currency": {
													 "terms": {
														"field": "iso_currency_cd"
													 }
												  },
												  "group_by_oppty_type_code": {
													  "terms": {
														  "field": "oppty_type_code"
													  }
												  },
												  "group_by_opty_theater_name": {
													  "terms": {
														  "field": "opty_theater_name"
													  }
												  }
											  }
										});
*/
						postdata = JSON.stringify({
											"_source" : ["opty_id", "opty_name", "complex_deal_flag", "oppty_type_code", "sales_path_cd", "opty_theater_name", "create_date", "sales_terr_name", "territory_id", "iso_currency_cd", "sales_hierarchy_type_cd", "complex_deal_flag", "srvc_provider_internal_it_flag", "cloud_deal" ],
											"query": {
												"multi_match": {
													"fields": ["opty_name","oppty_type_code","opty_theater_name","opty_theater_name"],
													"query": q,
													"type": "cross_fields"
												}
											},"aggs": {
												"group_by_complex_deal_flag": {
													 "terms": {
														"field": "complex_deal_flag"
													 }
												  },
												  "group_by_srvc_provider_internal_it_flag": {
													  "terms": {
														  "field": "srvc_provider_internal_it_flag"
													  }
												  }
											  }
										});

				};
				console.log("postData"+postdata);
		  		$scope.SendData(fromCounter,toCounter,resultSize,postdata);
		};

		$scope.selection = [];

		$scope.itemsincart = [];

		$scope.toggleSelection = function toggleSelection(oppRecordId) 
		{
			var idx = $scope.selection.indexOf(oppRecordId);
			
			// is currently selected
			if (idx > -1) {
				console.log("selection removed");
			  $scope.selection.splice(idx, 1);
			}

			// is newly selected
			else {
				console.log("selection added");
			  $scope.selection.push(oppRecordId);
			}
			console.log("selection : "+$scope.selection);
    	};
		$scope.showDeleteMessage=false;
		$scope.deleteMessage;
		$scope.delSelectedData = function(){
			var deleteQuery;
			for(var i=0;i<$scope.selection.length;i++)
			{
//				{ "delete" : { "_index" : "optysor", "_type" : "opportunityobj", "_id" : "1" } }
//				{ "delete" : { "_index" : "optysor", "_type" : "opportunityobj", "_id" : "2" } }
				if(i==0)
				{
					console.log("i==0");
					deleteQuery=JSON.stringify(
							{ "delete" : {"_id" : $scope.selection[i] , "_type" : "opportunityobj", "_index" : "optysor"}}
							);
				}
				else
				{
					deleteQuery=deleteQuery+"\n"+JSON.stringify(
								{ "delete" : {"_id" : $scope.selection[i] , "_type" : "opportunityobj", "_index" : "optysor"}}

					);
				}
				console.log("deleteQuery temp: "+deleteQuery);
			}
			console.log("deleteQuery final: "+deleteQuery);

			postdata=deleteQuery+"\n";
			console.log("postdata : "+postdata);

			$http.post('http://localhost:9200/optysor/opportunityobj/_bulk',postdata)
            .success(function (data) {
					console.log("HERE4");
					console.log("data is success"+JSON.stringify(data));
					var dataj=JSON.parse(JSON.stringify(data));
					$scope.deleteMessage= $scope.selection.length + " records deleted";
			})
            .error(function (data) {
					console.log("HERE5");
					console.log("data is"+JSON.stringify(data));
	                $scope.ResponseDetails = "Data: ";
            });
		}

		$scope.delSelectedData = function(){
			var deleteQuery;
			for(var i=0;i<$scope.selection.length;i++)
			{
//				{ "delete" : { "_index" : "optysor", "_type" : "opportunityobj", "_id" : "1" } }
//				{ "delete" : { "_index" : "optysor", "_type" : "opportunityobj", "_id" : "2" } }
				if(i==0)
				{
					console.log("i==0");
					deleteQuery=JSON.stringify(
							{ "delete" : {"_id" : $scope.selection[i] , "_type" : "opportunityobj", "_index" : "optysor"}}
							);
				}
				else
				{
					deleteQuery=deleteQuery+"\n"+JSON.stringify(
								{ "delete" : {"_id" : $scope.selection[i] , "_type" : "opportunityobj", "_index" : "optysor"}}

					);
				}
				console.log("deleteQuery temp: "+deleteQuery);
			}
			console.log("deleteQuery final: "+deleteQuery);

			postdata=deleteQuery+"\n";
			console.log("postdata : "+postdata);

			$http.post('http://localhost:9200/optysor/opportunityobj/_bulk',postdata)
            .success(function (data) {
					console.log("HERE4");
					console.log("data is success"+JSON.stringify(data));
					var dataj=JSON.parse(JSON.stringify(data));
					$scope.deleteMessage= $scope.selection.length + " items deleted";
					var logQuery = JSON.stringify({
									"userid" : loginUserId,
									"update_comments" : 0,
									"marked_for_delete" : 0,
									"deleted" : $scope.selection.length
								});
					$scope.logCollab(logQuery);

					$scope.selection = [];
/*					postdata = JSON.stringify({
									"_source" : ["opty_id", "opty_name", "complex_deal_flag", "oppty_type_code", "sales_path_cd", "opty_theater_name", "create_date", "sales_terr_name", "territory_id", "iso_currency_cd", "sales_hierarchy_type_cd", "complex_deal_flag", "srvc_provider_internal_it_flag", "cloud_deal" ],
									"query": {"match_all": {}},"aggs": {
													"group_by_currency": {
														 "terms": {
															"field": "iso_currency_cd"
														 }
													  },
													  "group_by_oppty_type_code": {
														  "terms": {
															  "field": "oppty_type_code"
														  }
													  },
													  "group_by_opty_theater_name": {
														  "terms": {
															  "field": "opty_theater_name"
														  }
													  }
												  }
								});
*/
					postdata = JSON.stringify({
									"_source" : ["opty_id", "opty_name", "complex_deal_flag", "oppty_type_code", "sales_path_cd", "opty_theater_name", "create_date", "sales_terr_name", "territory_id", "iso_currency_cd", "sales_hierarchy_type_cd", "complex_deal_flag", "srvc_provider_internal_it_flag", "cloud_deal" ],
									"query": {"match_all": {}},"aggs": {
													"group_by_complex_deal_flag": {
														 "terms": {
															"field": "complex_deal_flag"
														 }
													  },
													  "group_by_srvc_provider_internal_it_flag": {
														  "terms": {
															  "field": "srvc_provider_internal_it_flag"
														  }
													  }
												  }
								});
								
					resultSize=100;
					fromCounter=0;
					toCounter=99;
					$scope.PostDataResponse =[];
					$scope.searchString="";
					$scope.logCollab();
			  		$scope.SendData(fromCounter,toCounter,resultSize,postdata);

					
//					$timeout(function(){$scope.showDataAction();}, 3000);
					
			})
            .error(function (data) {
					console.log("HERE5");
					console.log("data is"+JSON.stringify(data));
	                $scope.ResponseDetails = "Data: ";
            });
		}


		$scope.markForDeletion = function(){
			var markForDeletionQuery;
			for(var i=0;i<$scope.selection.length;i++)
			{
				if(i==0)
				{
						console.log("i==0");
						markForDeletionQuery=JSON.stringify(
								{ "update" : {"_id" : $scope.selection[i], "_type" : "opportunityobj", "_index" : "optysor"}}
								);
						markForDeletionQuery=markForDeletionQuery+"\n";
						markForDeletionQuery=markForDeletionQuery+JSON.stringify(
								{ "doc" : {"srvc_provider_internal_it_flag" : "Y"}}
								);
					
				}
				else
				{
						markForDeletionQuery=markForDeletionQuery+"\n"+JSON.stringify(
								{ "update" : {"_id" : $scope.selection[i], "_type" : "opportunityobj", "_index" : "optysor"}}
								);
						markForDeletionQuery=markForDeletionQuery+"\n";
						markForDeletionQuery=markForDeletionQuery+JSON.stringify(
								{ "doc" : {"srvc_provider_internal_it_flag" : "Y"}}
								);
				}
			}
			console.log("markForDeletionQuery final: "+markForDeletionQuery);

			postdata=markForDeletionQuery+"\n";
			console.log("postdata : "+markForDeletionQuery);

			$http.post('http://localhost:9200/optysor/opportunityobj/_bulk',postdata)
            .success(function (data) {
					console.log("HERE4");
					console.log("data is success"+JSON.stringify(data));
					var dataj=JSON.parse(JSON.stringify(data));
					$scope.deleteMessage= $scope.selection.length + " items marked for deletion";
					$("#showMessage").show().delay(2000).fadeOut();
					var logQuery = JSON.stringify({
									"userid" : loginUserId,
									"update_comments" : 0,
									"marked_for_delete" : $scope.selection.length ,
									"deleted" : 0
								});
					$scope.logCollab(logQuery);
					$scope.logChangeOptyData($scope.selection);
					
					$scope.selection = [];
/*					postdata = JSON.stringify({
									"_source" : ["opty_id", "opty_name", "complex_deal_flag", "oppty_type_code", "sales_path_cd", "opty_theater_name", "create_date", "sales_terr_name", "territory_id", "iso_currency_cd", "sales_hierarchy_type_cd", "complex_deal_flag", "srvc_provider_internal_it_flag", "cloud_deal" ],
									"query": {"match_all": {}},"aggs": {
													"group_by_currency": {
														 "terms": {
															"field": "iso_currency_cd"
														 }
													  },
													  "group_by_oppty_type_code": {
														  "terms": {
															  "field": "oppty_type_code"
														  }
													  },
													  "group_by_opty_theater_name": {
														  "terms": {
															  "field": "opty_theater_name"
														  }
													  }
												  }
								});
*/					
					postdata = JSON.stringify({
									"_source" : ["opty_id", "opty_name", "complex_deal_flag", "oppty_type_code", "sales_path_cd", "opty_theater_name", "create_date", "sales_terr_name", "territory_id", "iso_currency_cd", "sales_hierarchy_type_cd", "complex_deal_flag", "srvc_provider_internal_it_flag", "cloud_deal" ],
									"query": {"match_all": {}},"aggs": {
													"group_by_complex_deal_flag": {
														 "terms": {
															"field": "complex_deal_flag"
														 }
													  },
													  "group_by_srvc_provider_internal_it_flag": {
														  "terms": {
															  "field": "srvc_provider_internal_it_flag"
														  }
													  }
												  }
								});
					
					resultSize=100;
					fromCounter=0;
					toCounter=99;
					$scope.PostDataResponse =[];
					$scope.searchString="";
			  		$scope.SendData(fromCounter,toCounter,resultSize,postdata);


					
//					$timeout(function(){$scope.showDataAction();}, 3000);
					
			})
            .error(function (data) {
					console.log("HERE5");
					console.log("data is"+JSON.stringify(data));
	                $scope.ResponseDetails = "Data: ";
            });
		}



		$scope.updateComments = function(){
			var updateQuery;
			console.log("$scope.postresponsedata() : "+$scope.PostDataResponse[0]._source.sales_hierarchy_type_cd);

			var myArr=Array.from($scope.updateCommRecords);
			console.log("myArr length : "+myArr.length);
			console.log("myArr : "+myArr);
			

			var updateQuery;


			for(var i=0;i<myArr.length;i++)
			{
				console.log("inside myArr : "+myArr[i]);
				for(var j=0;j<$scope.PostDataResponse.length;j++)
				{
						if($scope.PostDataResponse[j]._id==myArr[i])
						{
							console.log("postdataresponse==myarr");

								if(i==0)
								{
									console.log("i==0");
									updateQuery=JSON.stringify(
											{ "update" : {"_id" : myArr[i] , "_type" : "opportunityobj", "_index" : "optysor"}}
											);
									updateQuery=updateQuery+"\n";
									updateQuery=updateQuery+JSON.stringify(
											{ "doc" : {"sales_hierarchy_type_cd" : $scope.PostDataResponse[j]._source.sales_hierarchy_type_cd, "complex_deal_flag" : "Y"}}
											);
									
								}
								else
								{
									updateQuery=updateQuery+"\n"+JSON.stringify(
											{ "update" : {"_id" : myArr[i] , "_type" : "opportunityobj", "_index" : "optysor"}}
											);
									updateQuery=updateQuery+"\n";
									updateQuery=updateQuery+JSON.stringify(
											{ "doc" : {"sales_hierarchy_type_cd" : $scope.PostDataResponse[j]._source.sales_hierarchy_type_cd, "complex_deal_flag" : "Y"}}
											);
								}
//							console.log("updateQuery temp: "+updateQuery);
						}
				}
			}
//			console.log("updateQuery final: "+updateQuery);

			postdata=updateQuery+"\n";
			console.log("postdata : "+postdata);

			$http.post('http://localhost:9200/optysor/opportunityobj/_bulk',postdata)
            .success(function (data) {
					console.log("HERE4");
					console.log("data is success"+JSON.stringify(data));
					var dataj=JSON.parse(JSON.stringify(data));
					$scope.deleteMessage= myArr.length + " items updated";
					$("#showMessage").show().delay(2000).fadeOut();
					var logQuery = JSON.stringify({
									"userid" : loginUserId,
									"update_comments" : myArr.length ,
									"marked_for_delete" : 0 ,
									"deleted" : 0
								});
					$scope.logCollab(logQuery);

					$scope.selection = [];
					$scope.updateCommRecords.clear();
					console.log("set size: "+$scope.updateCommRecords.size);
					myArr = [];
/*					postdata = JSON.stringify({
									"_source" : ["opty_id", "opty_name", "complex_deal_flag", "oppty_type_code", "sales_path_cd", "opty_theater_name", "create_date", "sales_terr_name", "territory_id", "iso_currency_cd", "sales_hierarchy_type_cd", "complex_deal_flag", "srvc_provider_internal_it_flag", "cloud_deal" ],
									"query": {"match_all": {}},"aggs": {
													"group_by_currency": {
														 "terms": {
															"field": "iso_currency_cd"
														 }
													  },
													  "group_by_oppty_type_code": {
														  "terms": {
															  "field": "oppty_type_code"
														  }
													  },
													  "group_by_opty_theater_name": {
														  "terms": {
															  "field": "opty_theater_name"
														  }
													  }
												  }
								});
*/

					postdata = JSON.stringify({
									"_source" : ["opty_id", "opty_name", "complex_deal_flag", "oppty_type_code", "sales_path_cd", "opty_theater_name", "create_date", "sales_terr_name", "territory_id", "iso_currency_cd", "sales_hierarchy_type_cd", "complex_deal_flag", "srvc_provider_internal_it_flag", "cloud_deal" ],
									"query": {"match_all": {}},"aggs": {
													"group_by_complex_deal_flag": {
														 "terms": {
															"field": "complex_deal_flag"
														 }
													  },
													  "group_by_srvc_provider_internal_it_flag": {
														  "terms": {
															  "field": "srvc_provider_internal_it_flag"
														  }
													  }
												  }
								});
					resultSize=100;
					fromCounter=0;
					toCounter=99;
					$scope.PostDataResponse =[];
					$scope.searchString="";
			  		$scope.SendData(fromCounter,toCounter,resultSize,postdata);

					
//					$timeout(function(){$scope.showDataAction();}, 3000);
					
			})
            .error(function (data) {
					console.log("HERE5");
					console.log("data is"+JSON.stringify(data));
	                $scope.ResponseDetails = "Data: ";
            });




		}



}]);