/* * 
*   AngularJS V1.5.0
*	UI-Router V0.2.18
*	ui-bootstrap-tpls V1.1.2 (download the version named ui-boostrap-tpls,
*	which also includes the modal template)
*	Angular-Animate V1.5.0 (optional, but worth it for user-friendly animations and the ability to customize the type and behaviour of animations)
*  
*   This custom Provider, modalStateProvider can be wrapped around normal
*   ui-router states to conveniently create modals with a few lines of code.
*   This code can work with up to AngularJS 1.5,  UI-Router V0.2.18 with no alternations. It can
*   be used in later Angular 1.X and in the latest UI-Router version (1.0.28 at the moment), however,
*   some mild code alterations may be necessary.
*/ 


// It's incredibly easy to turn normal ui-router states into
// Modals with this provider. The provider name, modalStateProvider,
// is simply appended to the beginning of the state definition,
// followed by a '.'

// Here's an example of creating a Modal:
modalStateProvider.state('shop.products.details', {
	url: '/details/:productId',
	templateUrl: '/views/modal',
	resolve: {
		// Note that modalState will replace the $stateParams object
		// when using this Provider. As such, all $stateParams properties
		// can be found inside it
		product: ['sales', 'modalState', function (sales, modalState) {
			return sales.find(modalState.stateParams.productId);
		}]
	},
	controller: 'ModalController'
});


// Here is the full provider code
app.provider('modalState', [
	'$stateProvider',
	function ($stateProvider) {

		let modalState = {
			stateParams: {},
		};
		this.$get = function () {
			return modalState;
		};
		this.state = function (stateName, options) {

			var $uibModalInstance;
			$stateProvider.state(stateName, {
				url: options.url,
				onEnter: function ($uibModal, $state, $transition$) {
					modalState.stateParams = $stateParams;
					//Additional options can be added to the Modal Instance in this section. For example:
					   options.keyboard = false;   // Controls whether keyboard clicks close the modal
					   options.animation = true;   // Activates the modal opening and closing animations
					
					//Learn more about more possible options in this specific version here: 
					//https://angular-ui.github.io/bootstrap/versioned-docs/1.1.2/         
					
					// The modal can also be customized from inside this provider
					// by adding conditionals which check the current state name
					// and perform certain actions depending on the result
					if ($state.next.name === 'shop.products.details') {
						
						// Say the next state name is 'shop.products.details',
						// we can conditionally add needed classes for this specific modal by
						// assigning a string with each class separated by a space to the 
						// windowClass property of options.

						// Here's an example which only adds the 'marketplace' and 'details-modal'
						// class to the modal created at state 'shop.products.details'. We can add
						// animations or styling with the windowClass property
						options.windowClass = 'marketplace details-modal';
					} else if ($state.next.name === 'shop.error') {

						// Here's another example where the next state is 'shop.error'.
						// Again, classes are conditionally added depending on the specific
						// needs of the 'shop.error' modal.
						options.windowClass = 'marketplace error'; 
						
						// Allows configuration of modal size with preset values
						options.size = 'sm';
						
						options.backdrop = 'static';
						
						// Controls whether keyboard clicks close the modal
						options.keyboard = false;
					}
					
					// Here the current instance is passed the options object
					// and instantiated
					$uibModalInstance = $uibModal.open(options);
					
					// Finally, the $uibModalInstance.result['finally]() is called
					// when the modal is closed, whether by click, keypress, or
					// transition to another state. This allows us to perform any
					// cleanup necessary.

					// Here two things are happening. 
					$uibModalInstance.result['finally'](function () {
						// First, we reassign $uibModalInstance to 'null' in 
						// preparation for the next time it will be needed.
						$uibModalInstance = null;
			
						// Second, this modal state will automatically retransition
						// to it's parent. In some modals, this would have already occurred
						// a this point. But sometimes it's useful to not have to manually
						// retransition to the parent state and have the provider handle it
						// instead.
						if ($state.$current.name === stateName) {
						
							// If $state.$current.name is still the modal,
							// retransition to parent.
							$state.go('^');
						}
					});
				},
				// This will automatically close the modal window is the state is changed
				// while the modal remains open.
				onExit: function () {
					if ($uibModalInstance) {
						$uibModalInstance.close();
					}
				}
			});
		};
}]);