### modalStateProvider

This code offers a custom Provider which makes creating AngularJS 1.X modals simple. Simply append the `Provider` name, `modalStateProvider`, before your regular UI-Router state definition. This Provider will serve a central location in your AngularJS app which handles all or almost all Modal-related logic.

##### UI-Router State Turned Into Modal With One Word of Code

Here's an example:

```
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
```

By simply appending `modalStateProvider` and including the Provider given in modalStateProvider in your source code, creating AngularJS modals is simple.

##### Tech Stack

- AngularJS V1.5.0
- UI-Router V0.2.18
- ui-bootstrap-tpls V1.1.2 (download the version named ui-bootstrap-tpls, which also includes the modal and many other types of templates for easier UI creation)
- Angular-Animate V1.5.0 (optional, but worth it for user-friendly animations and the ability to customize the type and behavior of animations)
- This code can work with up to AngularJS 1.5, UI-Router V0.2.18 with no alternations. It can be used in later Angular 1.X and in the latest UI-Router version (1.0.28 at the moment), however, some mild code alterations may be necessary.
